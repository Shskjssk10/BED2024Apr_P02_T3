const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("userConnected", (username) => {
    console.log(`Username received: ${username}`);
    onlineUsers[socket.id] = username;
    console.log("Current online users:", onlineUsers);
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  //when user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete onlineUsers[socket.id];
    console.log("Updated online users:", onlineUsers);
    io.emit("onlineUsers", Object.values(onlineUsers));
    io.emit("message", "User left the chat");
  });

  // Handle incoming chat messages
  socket.on("chatMessage", (message) => {
    console.log(message);
    socket.broadcast.emit("message", message);
  });
});
