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
    origin: "http://localhost:3000",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  let user_id;

  global.chatSocket = socket;

  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    user_id = userId;
    console.log("add" + userId);
    console.log(onlineUsers);

    // 通知其他在线用户有新用户上线
    socket.broadcast.emit("user-online", userId);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

  // 在每次发送心跳消息时设置一个超时计时器
  let heartbeatTimeout;

  // 设置心跳检测定时器
  const startHeartbeat = (user_id) => {
    heartbeatTimeout = setTimeout(() => {
      // 超时逻辑，例如关闭连接
      socket.disconnect(true); // 断开连接并清除所有监听
      console.log("Connection timed out. Disconnecting client." + socket.id);
      // 通知其他在线用户有用户下线
      socket.broadcast.emit("user-offline", user_id);
      onlineUsers.delete(user_id);
      console.log(onlineUsers);
    }, 31000); // 设置超时时间为 4 秒
  };

  // 设置心跳检测定时器
  const heartbeatInterval = setInterval(() => {
    // 向前端发送心跳消息
    socket.emit("heartbeat", "heartbeat");
  }, 30000); // 每30秒发送一次心跳消息

  // 监听心跳回应
  socket.on("heartbeat_response", (user_id) => {
    // 收到前端的心跳回应，表示前端在线
    console.log("client:" + user_id + " alive " + Date());
    // 重置超时计时器
    clearTimeout(heartbeatTimeout);
    // 重新开始心跳检测
    startHeartbeat(user_id);
  });

  // 开始心跳检测
  startHeartbeat();
});
