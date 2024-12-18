// src/Components/Card.js
import { styled } from '@mui/material';
import MuiCard from '@mui/material/Card';

// Define a styled Card component
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background (80% opacity)
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

export default Card;