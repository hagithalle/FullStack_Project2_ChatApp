import { useState, useEffect } from 'react';
import { CssBaseline, Toolbar, Typography, AppBar, Box, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogOut } from '../dl/slices/authSlice'; // Ensure you import the log out action

export default function Header() {
  const [name, setName] = useState(""); // Store user name here
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: userAuth } = useSelector((state) => state.auth);

  // Load the user info from sessionStorage on component mount
  useEffect(() => {
    //const user = JSON.parse(sessionStorage.getItem("user"));
    if (userAuth) {
      setName(userAuth.fullName); // Set the name state if user is found
    }
    console.log('User from sessionStorage:', userAuth);  // Debugging line
  }, [userAuth]);

  // Handle logout action
  const handlerLogOut = () => {
    setName(""); // Clear name state when logging out

    // Dispatch log out action to clear user state in Redux
    dispatch(authLogOut());

    // Clear sessionStorage
    sessionStorage.clear();

    // After clearing session and Redux state, navigate to login
    navigate("/login");
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="static" sx={{ backgroundColor: 'rgba(20, 80, 80, 0.8)' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: { xs: 1, sm: 0 } }}>
            <Typography variant="h5" component="div" sx={{ marginLeft: 1, color: 'white' }}>
              ChattApp
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', textAlign: 'center' }}>
            <Typography variant="h6" component="p" sx={{ color: 'white' }}>
              {name ? `Logged in as ${name}` : ""}  {/* Display name or loading message */}
            </Typography>
          </Box>

          <Box>
            <Button sx={{ color: '#fff' }} onClick={handlerLogOut}>
              <LogoutIcon sx={{ color: 'white' }} />
              Log Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}