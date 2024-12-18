const {Server} = require("socket.io")

const io = new Server({cors: "http://localhost:5173"})

let onlineUsers=[]
let groups={}

io.on("connection", (socket) => {
  console.log("new connection:",socket.id)

 
  // Add new user when they connect
  socket.on("addNewUser", (userId, fullName) => {
    console.log("addNewUser id:", userId);

    console.log("onlineUsers befor add new user:",onlineUsers)
    // Check if user already exists
    const userExists = onlineUsers.some((user) => user.userId === userId);

    if (!userExists) {
      // If user doesn't exist, add them to the onlineUsers array
      onlineUsers.push({
        userId,
        socketId: socket.id,
        fullName: fullName
      });

      console.log("User added to onlineUsers:", onlineUsers);
    }

    // Emit the updated list of online users
    io.emit("getOnlineUsers", onlineUsers);
  });

   // Handle user joining a group
   socket.on("joinGroup", (groupId, userId) => {
    console.log(`${userId} is joining group ${groupId}`);
    
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
  
    if (!groups[groupId].includes(userId)) {
      groups[groupId].push(userId);
      socket.join(groupId);
      console.log(`${userId} joined group ${groupId}`);
    }
    
    io.to(groupId).emit("getGroupMembers", groups[groupId]);  // Emit updated group members
  });

  // Handle user leaving a group
  socket.on("leaveGroup", (groupId, userId) => {
    console.log(`${userId} is leaving group ${groupId}`);
    
    // Remove the user from the group
    if (groups[groupId]) {
      groups[groupId] = groups[groupId].filter((id) => id !== userId);
      socket.leave(groupId);  // Leave the group room
      console.log(`${userId} left group ${groupId}`);
    }

    // Emit updated group members
    io.to(groupId).emit("getGroupMembers", groups[groupId]);
  });

  // Handle sending a message
  socket.on("sentMessage", (message) => {
    console.log("sentMessage:", message);
    
    if (message.receiver_id) {
      if (groups[message.receiver_id]) {  // Check if the message is for a group
        // Broadcast the message to all group members
        groups[message.receiver_id].forEach(userId => {
          const groupMember = onlineUsers.find(user => user.userId === userId);
          if (groupMember) {
            io.to(groupMember.socketId).emit("getMessage", message);  // Emit to each user in the group
          }
        });
      } else {
        // If it's not a group, it's a direct message
        const receiver = onlineUsers.find(user => user.userId === message.receiver_id);
        if (receiver) {
          console.log("message:", message);
          console.log("receiver:", receiver);
          io.to(receiver.socketId).emit("getMessage", message);  // Emit to the individual user
        } else {
          console.log(`User with ID ${message.receiver_id} is not online.`);
        }
      }
    }
  });


 // Handle disconnection
 socket.on("disconnect", () => {
  // Remove user from the onlineUsers list
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
  console.log("after disconnect:", onlineUsers);
  
  // Emit the updated list of online users
  io.emit("getOnlineUsers", onlineUsers);

  // Remove user from any group they are part of
  for (let groupId in groups) {
    groups[groupId] = groups[groupId].filter((userId) => {
      return userId !== socket.id;
    });
    io.to(groupId).emit("getGroupMembers", groups[groupId]);
  }
});
});


io.listen(3000);