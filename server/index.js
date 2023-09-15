const express = require("express");
const cors = require("cors");
// 与mongodb进行交互
const mongoose = require("mongoose");

const userRoutes = require("./routes/UserRoutes");
const messagesRoutes = require("./routes/MessageRoutes");
const socket = require("socket.io");
const { replaceOne } = require("./model/userModel");

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
    origin: "*",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;

  setInterval(() => {}, 10000);

  // 新用户登录
  socket.on("add-user", (currentUser) => {
    onlineUsers.set(currentUser._id, socket.id);
  });

  // 用户发送消息
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data);
    }
  });

  // 当前聊天用户在线状态
  socket.on("inOn", (user_id) => {
    if (onlineUsers.has(user_id)) {
      socket.emit("isOnMsg", "success");
    } else {
      socket.emit("isOnMsg", "error");
    }
  });

  // 监听客户端发送的正在输入事件
  socket.on("typing", (typing_id) => {
    const sendUserSocket = onlineUsers.get(typing_id);
    // 广播给其他用户，显示该用户正在输入
    socket.to(sendUserSocket).emit("userTyping", typing_id);
  });

  // 监听客户端发送的停止输入事件
  socket.on("stopTyping", (typing_id) => {
    const sendUserSocket = onlineUsers.get(typing_id);
    // 广播给其他用户，停止显示该用户正在输入
    socket.to(sendUserSocket).emit("stopTyping", typing_id);
  });
});
