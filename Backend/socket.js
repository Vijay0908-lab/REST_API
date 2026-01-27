let io;
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:3000", // Your frontend URL
        methods: ["GET", "POST"],
      },
    });

    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("Socket.io is not initialised");
    }
    return io;
  },
};
