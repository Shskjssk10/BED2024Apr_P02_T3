const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

let onlineUsers = {};

// Utility function to get a socket ID by username
const getSocketIdByUsername = (username) => {
  return Object.keys(onlineUsers).find(
    (socketId) => onlineUsers[socketId] === username
  );
};

io.on("connection", (socket) => {
  socket.on("userConnected", (username) => {
    console.log(`Username received: ${username}`);
    onlineUsers[socket.id] = username;
    console.log("Current online users:", onlineUsers);
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete onlineUsers[socket.id];
    console.log("Updated online users:", onlineUsers);
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  socket.on("chatMessage", (message) => {
    console.log("Broadcasting message:", message);
    socket.broadcast.emit("message", { message, from: onlineUsers[socket.id] });
  });

  socket.on("privateMessage", (data) => {
    const { recipient, message } = data;
    const recipientSocketId = getSocketIdByUsername(recipient);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("privateMessage", {
        message,
        from: onlineUsers[socket.id],
      });
    }
  });
});
