const io = require("socket.io")(3000, {
  cors: {
    origin: ["http://localhost:8080"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (message, room) => {
    console.log(message);
    socket.to(room).emit("receive-message", message);
  });
});
