import { Box, Typography, TextField, Button, Grid, Paper } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { createNewMessage, getChatHistory } from "../dl/slices/messageSlice";
import { getAllUsers, getUserById } from "../dl/slices/usersSlice";
import { getGroupById } from "../dl/slices/groupsSlice";
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllBlockedUser } from "../dl/slices/blockedUserSlice";
import whatapBackground from '../../images/ChatBackground.jpg'
import PersonIcon from '@mui/icons-material/Person';

// Random color generator
const generateRandomColor = () => {
  const getDarkValue = () => Math.floor(Math.random() * 128);
  const r = getDarkValue();
  const g = getDarkValue();
  const b = getDarkValue();
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export default function Messaging({ socket, user, onlineUsers }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId, groupId } = useParams();
  const [newMessage, setNewMessage] = useState('');
  const messageEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { users, currentUserSocket } = useSelector((state) => state.users);
  const { currentGroupSocket } = useSelector((state) => state.groups);
  const { messages } = useSelector((state) => state.messages);
  const [messagesChat, setMessagesChat] = useState([]);
  const [usersColors, setUsersColor] = useState([]);
  const { blockedUsers } = useSelector(state => state.blockedUsers);

  useEffect(() => {
    console.log("messing")
    dispatch(getAllBlockedUser());
  }, [dispatch, userId]);

  useEffect(() => {
    console.log("list blockedUsers: ", blockedUsers);
    console.log("user: ",user, "currentSocet: ",currentUserSocket)
  }, [blockedUsers]);

  const isGroup = !!groupId;

  useEffect(() => {
    const fetchMessagesAndDetails = async () => {
      const targetId = isGroup ? groupId : userId;
      if (targetId) {
        if (isGroup) {
          dispatch(getGroupById(targetId));
          dispatch(getAllUsers());
        } else {
          dispatch(getUserById(targetId));
        }
        dispatch(getChatHistory(targetId));
      }
    };

    fetchMessagesAndDetails();
  }, [dispatch, userId, groupId, isGroup]);

  useEffect(() => {
    if (userId) {
      if (messages.length > 0 && currentUserSocket && user) {
        const filteredMessages = messages.filter(
          (msg) =>
            ((msg.sender_id === currentUserSocket._id && msg.receiver_id === user._id) ||
             (msg.sender_id === user._id && msg.receiver_id === currentUserSocket._id))
        );
        setMessagesChat(filteredMessages);
      }
    } else if (groupId) {
      if (messages.length > 0 && currentGroupSocket) {
        const filteredMessages = messages.filter(
          (msg) => msg.receiver_id === currentGroupSocket._id
        );
        setMessagesChat(filteredMessages);
      }
    }
  }, [messages, currentUserSocket, currentGroupSocket, user, userId, groupId]);

  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (message) => {
        if (
          (message.receiver_id === groupId && isGroup) ||
          (message.receiver_id === user._id && !isGroup)
        ) {
          setMessagesChat((prevMessages) => {
            // Prevent adding the same message twice
            if (!prevMessages.some((msg) => msg.date === message.date && msg.messageText === message.messageText)) {
              return [...prevMessages, message];
            }
            return prevMessages;
          });
        }
      });
      return () => {
        socket.off("getMessage");
      };
    }
  }, [socket, groupId, user, isGroup]);

  useEffect(() => {
    if (isGroup && groupId && user) {
      socket.emit("joinGroup", groupId, user._id);
    }
  }, [isGroup, groupId, user, socket]);

  useEffect(() => {
    setUsersColor(users?.map(user => ({
      ...user,
      color: generateRandomColor()
    })));
  }, [users]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const isBlocked = blockedUsers.some(blockedUser => blockedUser.blocked_user_id === user?._id && blockedUser.user_id == currentUserSocket._id);
   
   console.log("messaing isBlocking?", isBlocked)
    if (isBlocked) {
      alert("You cannot send a message to this user because you have been blocked.");
      return;
    }
    if (loading) return; // Prevent sending multiple times

    setLoading(true);

    const message = {
      sender_id: user._id,
      receiver_id: groupId || currentUserSocket._id,
      messageText: newMessage,
      date: new Date().toISOString(),
    };

    dispatch(createNewMessage(message));


    if (socket) {
      socket.emit("sentMessage", message);
    }

   setMessagesChat((prevMessages) => {
    // Ensure no duplicates by checking if the message already exists
    if (!prevMessages.find((msg) => msg.date === message.date && msg.messageText === message.messageText)) {
      return [...prevMessages, message];
    }
    return prevMessages;
  });



    setNewMessage('');
    setLoading(false);
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const isBlocked = blockedUsers.some(blockedUser => blockedUser.blocked_user_id === user?._id && blockedUser.user_id == currentUserSocket?._id);

  return (
    <Box display="flex" flexDirection="column" height="100%" >
      {(userId || groupId) && (
        <>
          <Box 
            display="flex" 
            alignItems="center" 
            bgcolor="rgba(255, 255, 255, 0.6)" 
            borderRadius={1}
           
            p={2}  
            sx={{
             
              boxShadow: 1, 
            }}
          >
            <PersonIcon sx={{ marginRight: "8px", color: "gary" }} />
            <Typography variant="h5" gutterBottom align="left">
              {userId
                ? `${currentUserSocket ? currentUserSocket.fullName : 'Loading...'}`
                : `${currentGroupSocket ? currentGroupSocket.name : 'Loading...'}`}
            </Typography>
          </Box>

          <Box
            flex={1}
            overflow="auto"
            p={2}
            bgcolor="#fff"
            borderRadius={1}
            boxShadow={1}
            mb={2}
            sx={{
              backgroundImage: `url(${whatapBackground}), linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3))`
            }}
          >
              {isGroup ? 
                <MessageWithGroup messagesWithGroup={messagesChat} currentGroupSocket={currentGroupSocket} users={usersColors} user={user} /> :
                <MessageWithUser messagesWithUser={messagesChat} currentUserSocket={currentUserSocket} isBlocked={isBlocked} />
            }
            <div ref={messageEndRef} />
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                sx={{
                  borderRadius: '30px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '30px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={2} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="success"
                onClick={handleSendMessage}
                fullWidth
                disabled={loading || isBlocked}
                sx={{
                  borderRadius: '50%',
                  padding: 1,
                  minWidth: 0,
                  width: 50,
                  height: 50,
                }}
              >
                {loading ? <CircularProgress size={24} color="white" /> : <SendIcon />}
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}

function MessageWithUser({ messagesWithUser, currentUserSocket, isBlocked }) {
  console.log("isBlocked:", isBlocked)
  if (isBlocked) {
    return (
      <Box mb={2} display="flex" justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: '#f8d7da',
            maxWidth: '80%',
          }}
        >
          <Typography variant="body1" color="error" align="center">
            You cannot send a message to this user because you have been blocked.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Ensure currentUserSocket and user are defined before rendering messages
  if (!currentUserSocket) {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <>
      {messagesWithUser.map((message, index) => {
        const isCurrentUser = message.sender_id === currentUserSocket._id;
        const senderName = isCurrentUser ? currentUserSocket.fullName : 'You';
        const messageBgColor = isCurrentUser ? '#e1ffc7' : '#f1f1f1';

        return (
          <Box key={index} display="flex" flexDirection={isCurrentUser ? 'row-reverse' : 'row'} mb={2}>
            <Paper
              elevation={3}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: messageBgColor,
                maxWidth: '80%',
              }}
            >
              <Typography variant="div" color="blue">
                {senderName}
              </Typography>
              <Typography variant="body1">{message.messageText}</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(message.date).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </>
  );
}

function MessageWithGroup({ messagesWithGroup, currentGroupSocket, users, user }) {
  const getUserColor = (userId) => {
    const foundUser = users.find(u => u._id === userId);
    return foundUser ? foundUser.color || '#f1f1f1' : '#f1f1f1';
  };

  return (
    <>
      {messagesWithGroup.map((message, index) => {
        const isCurrentUser = message.sender_id === user._id;
        const sender = isCurrentUser ? user : users.find(u => u._id === message.sender_id);
        
        const messageBgColor = isCurrentUser ? '#e1ffc7' : '#f1f1f1';
        const senderNameColor = isCurrentUser ? 'blue' : getUserColor(message.sender_id);

        return (
          <Box key={index} display="flex" flexDirection={isCurrentUser ? 'row' : 'row-reverse'} mb={2}>
            <Paper
              elevation={3}
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: messageBgColor,
                maxWidth: '80%',
              }}
            >
              <Typography variant="div" sx={{ color: senderNameColor, fontWeight: 'bold' }}>
                {isCurrentUser ? "You" : sender ? sender.fullName : 'Unknown'}
              </Typography>
              <Typography variant="body1">{message.messageText}</Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(message.date).toLocaleTimeString()}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </>
  );
}