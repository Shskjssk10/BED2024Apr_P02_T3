const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    io.emit("message", "User left the chat");
  });

  socket.on("chatMessage", (message) => {
    console.log(message);
    socket.broadcast.emit("message", message);
  });
});
