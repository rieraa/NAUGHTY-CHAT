const express = require("express");
const cors = require("cors");
// 与mongodb进行交互
const mongoose = require("mongoose");

const userRoutes = require("./routes/UserRoutes");
const app = express();
require("dotenv").config(); // todo

// *中间件
app.use(cors());
app.use(express.json());

// *挂载userRoutes到api/auth路径下
// !路径开头一定要加 "/"
app.use("/api/auth", userRoutes);

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
