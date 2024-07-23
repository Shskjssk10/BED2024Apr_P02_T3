const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  socket.on("userConnected", (username) => {
    //store the username with the socket ID as the key
    onlineUsers[socket.id] = username;
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  //when user disconnect
  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];

    // Emit the updated list of online users to all clients
    io.emit("onlineUsers", Object.values(onlineUsers));

    io.emit("message", "User left the chat");
  });

  // Handle incoming chat messages
  socket.on("chatMessage", (message) => {
    console.log(message);
    socket.broadcast.emit("message", message);
  });
});
