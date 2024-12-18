import { styled, Typography, FormControl, FormLabel, Button, InputAdornment, IconButton, OutlinedInput, Box, FormHelperText, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import { Visibility, VisibilityOff, Mail } from '@mui/icons-material';
import FaceIcon from '@mui/icons-material/Face';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { authRegister, reset } from '../dl/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import whatapBackground from '../../images/whatap_background.jpg'; // Import your image
import Card from '../Components/Card';

const Container = styled(Stack)(({ theme }) => ({
  height: '100vh', // Ensure it takes up the full viewport height
  padding: 150,
  backgroundImage: `url(${whatapBackground})`, // Set the background image
  backgroundSize: 'cover', // Cover the full container
  backgroundPosition: 'center', // Center the image
  backgroundRepeat: 'no-repeat', // Prevent repetition of the image
}));

export default function NewUserRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, isLoading, message } = useSelector(state => state.auth);

  // Initialize state properly
  const [newUser, setNewUser] = useState({
    userName: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) {
      toast.success(message);
      navigate("/login");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, dispatch, navigate]);

  function handlerChange(event) {
    const { name, value } = event.target;
    setNewUser((prevNewUser) => ({
      ...prevNewUser,
      [name]: value,
    }));
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();
  const handleMouseUpPassword = (event) => event.preventDefault();

  const handlerSubmit = (event) => {
    event.preventDefault();
    
    // Simple validation before dispatching
    if (!newUser.email || !newUser.password || !newUser.userName || !newUser.fullName) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    // Simple Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    
    // Dispatch the action to register the user
    dispatch(authRegister(newUser));
  };

  return (
    <Container>
      <form onSubmit={handlerSubmit}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial' }}>
            Create New User
          </Typography>

          {/* Full Name */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel htmlFor="fullName">Full Name</FormLabel>
            <OutlinedInput
              id="fullName"
              name="fullName"
              required
              value={newUser.fullName}
              onChange={handlerChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <PersonIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>Enter your full name</FormHelperText>
          </FormControl>

          {/* User Name */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel htmlFor="userName">User Name</FormLabel>
            <OutlinedInput
              id="userName"
              name="userName"
              required
              value={newUser.userName}
              onChange={handlerChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <FaceIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>Enter your user name</FormHelperText>
          </FormControl>

          {/* Email */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <OutlinedInput
              id="email"
              name="email"
              required
              value={newUser.email}
              onChange={handlerChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <Mail />
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>Enter your email address</FormHelperText>
          </FormControl>

          {/* Password */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <OutlinedInput
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={newUser.password}
              onChange={handlerChange}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>Enter your password</FormHelperText>
          </FormControl>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ backgroundColor: 'purple', '&:hover': { backgroundColor: 'darkpurple' } }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "#1B8A6B", '&:hover': { backgroundColor: "rgba(27, 138, 107, 0.8)" } }}
            >
              Create
            </Button>
          </Box>
        </Card>
      </form>
    </Container>
  );
}