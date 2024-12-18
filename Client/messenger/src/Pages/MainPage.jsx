import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, styled, Stack} from '@mui/material';

import { Outlet , Navigate, useNavigate} from 'react-router-dom';
import Header from "../Components/Header"
import { useEffect } from 'react';
import ErrorBoundary from '../Components/ErrrorBoundary';


const theme = createTheme({
    palette: {
      mode: 'light',
    },
    typography: {
     
    },
  });

 

export default function MainPage(){
  
  const navigate= useNavigate()

 
  useEffect(()=>{

navigate("/login")
},[])

    return (
        <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header/>   
      <ErrorBoundary>
      <Outlet />
      </ErrorBoundary>
    </ThemeProvider>

  );
}