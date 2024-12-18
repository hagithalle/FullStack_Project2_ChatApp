import { FormHelperText, Typography, FormControl, FormLabel, Link, Button, InputAdornment, IconButton, OutlinedInput, createTheme, styled, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { Visibility, VisibilityOff, Mail } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Card from '../Components/Card';
import { useDispatch, useSelector } from "react-redux";
import { authLogin, reset } from '../dl/slices/authSlice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import whatapBackground from '../../images/whatap_background.jpg'; // Import your image

const theme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
   
  },
});


const Container = styled(Stack)(({ theme }) => ({
  height: '100vh', // Ensure it takes up the full viewport height
  padding: 150,
  backgroundImage: `url(${whatapBackground})`, // Set the background image
  backgroundSize: 'cover', // Cover the full container
  backgroundPosition: 'center', // Center the image
  backgroundRepeat: 'no-repeat', // Prevent repetition of the image
}));

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess) {
      toast.success(message);
    
      navigate("/messanger");
    }
    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, dispatch, navigate]);

  // Input change handler
  const handlerChange = (event) => {
    const { name, value } = event.target;
    setUserLogin((prevUserLogin) => ({
      ...prevUserLogin,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Prevent mouse down default behavior (for password visibility toggle)
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Form submit handler
  const handlerSubmit = (event) => {
    event.preventDefault();
    dispatch(authLogin(userLogin)); // Dispatch login action
  };

  return (
    <Container>
      <Card variant="outlined">
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'Arial' }}>
          Login
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <OutlinedInput
            id="email"
            name="email"
            required
            placeholder="@com"
            fullWidth
            variant="outlined"
            value={userLogin.email}  // Bind to state
            onChange={handlerChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end">
                  <Mail />
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>Enter your email address</FormHelperText> {/* Helper text */}
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <OutlinedInput
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={userLogin.password}  // Bind to state
            onChange={handlerChange}
            placeholder="******"
            required
            fullWidth
            variant="outlined"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'hide the password' : 'display the password'}
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <FormHelperText>Please enter your password</FormHelperText> {/* Helper text */}
        </FormControl>

        {/* Login Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={handlerSubmit}
          sx={{
            backgroundColor: "#1B8A6B",
            '&:hover': { backgroundColor: "rgba(27, 138, 107, 0.8)" },
          }}
        >
          Login
        </Button>

        {/* Register Link */}
        <Typography sx={{ textAlign: 'center', mt: 2 }}>
          New User?{''}
          <Link
            onClick={() => navigate("/register")}
            variant="body2"
            sx={{ position: 'relative', paddingLeft: '20px' }}
          >
            Register
          </Link>
        </Typography>
      </Card>
    </Container>
  );
}