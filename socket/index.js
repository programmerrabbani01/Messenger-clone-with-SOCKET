import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

httpServer.listen(8000, () => {
  console.log("Socket.IO server listening on port 8000");
});

// active users

let activeUsers = [];

// init socket server

io.on("connection", (socket) => {
  console.log("A user connected");

  // console.log(activeUsers);

  // set Active User to Socket from MessengerMain

  socket.on("setActiveUser", (data) => {
    const checkActiveUser = activeUsers.some((d) => d._id === data._id);

    if (!checkActiveUser) {
      activeUsers.push({
        userId: data._id,
        socketId: socket.id,
        user: data,
      });
    }

    // catch all active users
    io.emit("getActiveUsers", activeUsers);
  });

  // send real time chat

  socket.on("realTimeMsgSend", (data) => {
    const checkActiveUser = activeUsers.find(
      (d) => d.userId == data.receiverID
    );

    if (checkActiveUser) {
      socket.to(checkActiveUser.socketId).emit("realTimeMsgGet", data);
    }
  });

  // remove log out user
  socket.on("removeLogOutUser", (id) => {
    activeUsers = activeUsers.filter((data) => data.userId !== id);

    // catch all active users
    io.emit("getActiveUsers", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove active user from socket when i close a tab from browser

    activeUsers = activeUsers.filter((data) => data.socketId !== socket.id);

    // catch all active users
    io.emit("getActiveUsers", activeUsers);

    console.log("User disconnected");
  });
});
