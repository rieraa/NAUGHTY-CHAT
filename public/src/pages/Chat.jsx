import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { allContactsRoute } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";

function Chat() {
  const navigate = useNavigate();

  // 联系人数组
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  // 当前聊天对象
  const [currentChat, setCurrentChat] = useState(undefined);

  // 设置当前登录用户
  useEffect(() => {
    const currentUser = async function () {
      console.log("用户已登录");
      if (!localStorage.getItem("chat-app-user")) {
        console.log("set current");
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
      }
    };
    currentUser();
  }, []);

  // 检查当前用户是否设置头像 若已设置头像 则获取所有其他的用户信息
  useEffect(() => {
    const checkUserAvatar = async function () {
      console.log("设置头像");
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          console.log(`${allContactsRoute}/${currentUser._id}`);
          const data = await axios.get(
            `${allContactsRoute}/${currentUser._id}`
          );
          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    };
    checkUserAvatar();
  }, [currentUser]);

  // 设置当前聊天对象
  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          // 此处为子传父 因此通过传入一个函数来实现
          changeChat={handleChatChange}
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid; //todo
    // 左侧联系人 25%
    // 聊天界面   75%
    grid-template-columns: 25% 75%; //todo
    //todo 针对手机的也可以补充
    // 响应式 针对平板
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    /* //phone
    @media screen and (min-width: 360px) and (max-width: 480px) {
      grid-template-columns: 15% 75%;
    } */
  }
`;

export default Chat;
