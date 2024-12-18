import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, styled, Box } from '@mui/material';
import whatapBackground from '../../images/back-school-seamless-pattern-vector-background_153454-5033.avif'; // Import your image
import Sidebar from '../Components/Sidebar';
import Messaging from '../Components/Messaging'; // Import the Messaging component
import Header from "../Components/Header"
import { useState , useRef, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";


const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const Container = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 64px)',  // Full height minus header (assuming header height is 64px)
  backgroundImage: `url(${whatapBackground}), linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3))`,
  backgroundSize: 'cover',  // or use '100%' based on your preference
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  padding: 80,
  display: 'flex',  // Use flex layout to ensure the sidebar and messaging take full height
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100%',
  width: '100%',
}));

const SidebarWrapper = styled(Box)(({ theme }) => ({
  width: '300px',  // Set the width of the sidebar
  backgroundColor: '#fff',
  boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
  height: '100%',  // Sidebar should stretch to full height
  //display: 'flex',
  //flexDirection: 'column',  // Make the sidebar's content stack vertically
}));

const ChatWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: '16px',
  backgroundColor: '#f4f4f4',
  height: '100%',
}));

export default function Chat() {
  const socket = useRef(null); // Socket reference for global access
  const [user, setUser] = useState(null);
  const { user: userAuth, } = useSelector((state) => state.auth);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
  //  const user = JSON.parse(sessionStorage.getItem("user"));
    if (userAuth) {
      setUser({ _id: userAuth._id, fullName: userAuth.fullName });
    }

    // Initialize the socket connection
    socket.current = io("http://localhost:3000");

    socket.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [userAuth]);

  useEffect(() => {
    if (user && socket.current) {
      socket.current.emit("addNewUser", user._id, user.fullName); // Emit user id to server
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    
      <Container>
        <ContentBox>
        <SidebarWrapper>
            <Sidebar socket={socket.current} onlineUsers={onlineUsers} />
          </SidebarWrapper>
        <ChatWrapper>
            <Messaging socket={socket.current} user={user} onlineUsers={onlineUsers} />
          </ChatWrapper>
        </ContentBox>
      </Container>
    </ThemeProvider>
  );
}