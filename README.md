# CHAT APP

## websocket 介绍

web socket 是一种全双工通讯的网络技术,属于应用层协议,基于 TCP 传输协议,并复用了 HTTP 的握手通道

是一种长连接,不需要频繁的链接断开

### websocket 数据帧格式

> 单位是 bit 如 FIN RSV 都占据 1bit opcode 占据 4bit

![image-20230906162803200](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309061628568.png)

- FIN 1BIT 标记数据是否发送到最后一位

   如果是消息的最后一个分片，则返回的是 1 否则返回 0

- OPCODE 4BIT

  ==9 10 用于心跳监测==

  ![image-20230906222522624](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309062225696.png)

- MASK(掩码)

  - 客户端发送消息到服务端 掩码为 1
  - 服务端发送消息到客户端 掩码为 0

- PAYLOAD（数据载荷长度）

  说明传输的数据的字节 根据 Payload length 的长度 判断后续字节的作用

  ![image-20230907103055654](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309071030759.png)

  `Buffer`字节数组

  - 大端序：高位放在低地址先读，按顺序读取

  - 小端序：

    ![image-20230907112108233](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309071121351.png)

    **输出为 256 1**

- Masking-Key

   0 或 4 字节(32 位)所有从客户端传送到服务端的数据帧，数据载荷都进行了掩
  码操作，Mask 为 1，且携带了 4 字节的 Masking-key。如果 Mask 为 0，则没有 Masking-key。
  载荷数的长度，不包括 mask key 的长度

## websocket 建立链接过程

![	](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309062208820.png)

**客户端请求头及请求相应状态**：

![image-20230906221244548](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309062212586.png)

**服务端响应**

![image-20230906221421998](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309062214054.png)

其中请求中的`Sec-Websocket-Key`用于验证链接是否合法

状态码中的 101 代表协议切换

## 客户端发送消息到客户端

### 代码

> 客户端代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <input type="text" id="text" />
    <button onclick="send()">send</button>
    <script>
      let text = document.getElementById("text");
      // 在浏览器链接服务器
      let soket = new WebSocket("ws://localhost:8889");
      // 当链接打开或建立后，触发回调
      soket.onopen = function () {
        soket.send("hello server");
      };

      // 服务器端给客户端发送消息时 可以通过soket.onmessage接受 存储于event中
      soket.onmessage = function (event) {
        // soket.send(event.data);
        console.log(event.data);
      };
      function send() {
        let value = text.value;
        text.value = "";
        soket.send(value);
      }
    </script>
  </body>
</html>
```

> 服务端代码

```js
const { Server } = require("ws");
const wsServer = new Server({ port: 8889 });
//wsServer 服务器
//socket 套接字 类似于打电话的手机

//"connection"监听客户端过来的链接
wsServer.on("connection", (socket) => {
  //“message"监听当前链接的客户端发来的消息
  socket.on("message", (message) => {
    console.log(message.toLocaleString());
    socket.send(message);
  });
});
```

### 流程

1. `let soket = new WebSocket("ws://localhost:8889") `浏览器链接服务器
2. `        soket.send("hello server");`客户端向服务器发消息 "hello server”
3. `socket.on("message"`)服务端监听到消息并触发回调，向客户端发送消息
4. `soket.onmessage`客户端监听到服务端的相应，触发回调打印

## 实现

### 问题

- 什么函数可以传入回调函数，若没有回调函数，如何使用promise进行链接，什么又是promise

- 为什么链接mongodb服务器MONGO_URL="mongodb://127.0.0.1:27017/chat"成功

  MONGO_URL="mongodb://localhost:27017/chat"失败

- 页面的暴露方式不理解

  ![image-20230907184048713](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309071840780.png)

- form表单是如何捕获实践(什么又是句柄提交)

  ```jsx
  <>
      <FormContainer>
      {/* 捕获事件  并传递到自定义函数中*/}
          <form onSubmit={(event)=>{handleSummit(event)}}></form>
      </FormContainer>
  </>
  ```

- styled-components 是什么模块

- 各种css样式

  ```css
  const FormContainer = styled.div`
  
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
  
    .brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
  
      img {
        height: 5rem;
      }
  
      h1 {
        color: white;
        text-transform: uppercase;
      }
    }
  
    form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      background-color: #00000076;
      border-radius: 2rem;
      padding: 3rem 5rem;
  
      input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        border-radius: 0.4ram;
        color: white;
        width: 100%;
        font-size: 1rem;
  
        &:focus {
          border: 0.1rem solid #997af0;
          outline: none
        }
      }
  
      button {
        background-color: #997af0;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
  
        &:hover {
          background-color: #4e0eff;
  
        }
      }
  
      span {
        color: white;
        text-transform: uppercase;
  
        a {
          color: #4e0eff;
          /* text-transform:none; */
          text-decoration: none;
          font-weight: bold;
        }
      }
    }
     
  `;
  ```

  

- react-router-dom 路由知识

  ```jsx
  import React from "react";
  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import Register from "./pages/Register";
  import Login from "./pages/Login";
  import Chat from "./pages/Chat";
  
  export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    );
  }
  ```

- 导入的模块 不了解

  ```json
    "dependencies": {
      "bcrypt": "^5.1.1",//不懂
      "cors": "^2.8.5",//不懂
      "dotenv": "^16.3.1",//不懂
      "express": "^4.18.2",//略懂
      "mongoose": "^7.5.0",//不懂
      "socket.io": "^4.7.2"//不懂
    }
  ```

- ~~此处的方法作用 - event.preventDeafault();~~

  ```jsx
   const handleSummit = (event) => {
      // 事件点阻止默认值
      event.preventDeafault();
      alert("form");
    };
  ```
  
  
  
- toast 通知实现

- HTML命名问题

  ```jsx
   const handleChange = (event) => {
      let old = { ...values }
      console.log(old)
      setValues({
        //聪明的写法
        ...values,//旧值复制来的对象
        [event.target.name]: event.target.value
        //笨蛋的写法
        // username: event.username,
        // email: event.email,
        // password: event.password,
        // confirmPassword: event.confirmPassword,
      });
    };
    
    ......
    ......
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
                //此处的空格出现了问题
              name="confirm Password"
              onChange={(e) => handleChange(e)}
            />
  
    
  ```

  > 错误截图

  ![image-20230907235445480](https://oooooo.oss-cn-fuzhou.aliyuncs.com/readme/202309072354526.png)

- 在 JavaScript 中，事件对象通常在事件处理函数内部自动生成并传递给事件处理函数，无论是 `onChange`、`onClick`、`onSubmit` 还是其他事件.

- 此处`    localStorage.setItem("chat-app-user", JSON.stringify(data.user))//todo`的作用

  ```js
    // event.preventDefault()阻止默认的表单上传事件
    const handleSummit = async (event) => {
      event.preventDefault();
  
      if (handleValidation()) {
        console.log("valid:", registerRoute)
        const { username, email, password } = values;
        // todo 看不懂了
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        })
        if (data.status === fales) {
          toast.error(data.msg, toastOptions);
        }
        if (data.status === true) {
          localStorage.setItem("chat-app-user", JSON.stringify(data.user))//todo
          navigate("/")//todo
        
      }
    };
  ```
  
  

### 相关依赖

> package.json

```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index,js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "socket.io": "^4.7.2"
  }
}
```

### 配置文件

> .env

```
PORT=5000
MONGO_URL="mongodb://localhost:27017/chat"
```

