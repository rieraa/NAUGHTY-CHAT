# CHAT APP

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
  
- 此处的代码含义

  ```html
  <>
              <Container>
                  <div className="title-container">
                      <h1>
                          Pick an avatar as your profile picture
                      </h1>
                  </div>
                  <div className="avatars">
                      {avatars.map((avatar, index) => {
                          return (
                      {/* 以下返回的都不懂意义 */}
                              <div className={`avatar${selectedAvatar === index}?"selected":""`}>
  
                                  <img src={`data:img/svg+xml;base64,${avatar}`} alt="" />
  
                              </div>
                          )
                      })}
                  </div>
              </Container>
              <ToastContainer />
          </>
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

### 新知识

- 开源的头像api：`https://api.multiavatar.com/45678945`

- `onClick` 或其他事件处理程序需要传递一个函数引用，而不是在声明时直接调用函数，有几个原因：

  1. **延迟执行**: 通过传递一个函数引用，你可以控制事件处理程序何时执行。如果你在声明时直接调用函数，它将在渲染时立即执行，而不是在事件发生时执行。这意味着如果你传递一个函数引用，它会等待事件触发后才执行。
  2. **事件对象**: 事件处理程序通常需要接收事件对象作为参数。当你传递一个函数引用时，React会自动将事件对象传递给该函数。如果你在声明时直接调用函数，你将无法访问事件对象。
  3. **避免重复渲染**: 如果你在渲染期间调用函数，它可能会导致不必要的组件重新渲染。通过传递函数引用，React可以更好地优化组件更新，只在事件触发时执行需要更新的部分。

- 一个小bug，没搞清楚原因：

  若不添加` { new: true }`打印出的值为更新前的值

  ```js
  const userData = await User.findByIdAndUpdate(
        userID,
        {
          isAvatarImageSet: true,
          avatarImage: avatarImage,
        },
        { new: true }
      );
  
      console.log(userData.isAvatarImageSet, userData.avatarImage);
  
  ```

  
