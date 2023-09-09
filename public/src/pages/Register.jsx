import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";


import Logo from "../assets/logo.svg";
import 'react-toastify/dist/ReactToastify.css';
import { registerRoute } from "../utils/APIRoutes";


function Register() {
  // 表单中的值
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })


  //  event.preventDefault()阻止默认的表单上传事件
  const handleSummit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password, confirmPassword } = values;
      // todo 看不懂了
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      })
    }
  };


  // 错误提醒配置
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: "color"
  }


  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
      toast.error("🦄 password and confirm password should be same", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("email is required", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters", toastOptions);
      return false;
    }
    return true;


  }


  const handleChange = (event) => {
    // !新的赋值方法 
    // TODO了解target的用处
    setValues({
      //聪明的写法
      ...values,//旧值复制来的对象
      [event.target.name]: event.target.value


      //笨蛋的写法
      // username: event.username,
      // email: event.email,
      // password: event.password,
      // confirmPassword: event.confirmPassword,
    })

      ;
  };
  return (
    <>
      <FormContainer>
        {/* 捕获事件  并传递到自定义函数中*/}
        <form
          onSubmit={(event) => {
            handleSummit(event);
          }}
        >
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>NAUGHYT</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create user</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

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

export default Register;
