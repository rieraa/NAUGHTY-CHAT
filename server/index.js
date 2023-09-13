const express = require("express");
const cors = require("cors");
// 与mongodb进行交互
const mongoose = require("mongoose");

const userRoutes = require("./routes/UserRoutes");
const messagesRoutes = require("./routes/MessageRoutes");
const socket = require("socket.io");

const app = express();
require("dotenv").config(); // todo

// *中间件
app.use(cors());
app.use(express.json());

// *挂载userRoutes到api/auth路径下
// !路径开头一定要加 "/"
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Success");
  })
  .catch((error) => {
    console.error("Error occured", error.message);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on Port ${process.env.PORT}`);
});

//todo time: 3:51:25
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
