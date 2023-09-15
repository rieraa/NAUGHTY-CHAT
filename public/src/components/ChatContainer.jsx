import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Logout from "./Logout";
import ChatInPut from "./Input";
import axios from "axios";
import { sendMessageRoute, getAllMessagesRoute } from "../utils/APIRoutes";
import { v4 as uuidv4, v4 } from "uuid";
import { Badge } from "antd";

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [istyping, setIsTyping] = useState(false);
  // !
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [inOnline, setIsOnline] = useState("error");
  const scrollRef = useRef();

  // 获得当前聊天联系人的聊天记录
  useEffect(() => {
    if (currentChat) {
      const getAllMsg = async () => {
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      };

      getAllMsg(); // 加载历史消息
    }
    console.log("change chat");

    socket.current.emit("inOn", currentChat._id);
    socket.current.on("isOnMsg", (status) => {
      setIsOnline(status);
    });
  }, [currentChat]);

  const handleSendMessage = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });

    // !看不懂了!!!
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  // !!!! 监听器
  useEffect(() => {
    if (socket.current) {
      // 移除旧的监听器
      socket.current.off("msg-recieve");

      //新设置监听器。这样可以确保每次切换聊天对象时，都只有与当前聊天对象相关的消息会被接收
      socket.current.on("msg-recieve", (data) => {
        if (data.from === currentChat._id) {
          setArrivalMessage({ fromSelf: false, message: data.msg });
        }
      });

      setIsTyping(false);
      socket.current.on("userTyping", (typing_id) => {
        setIsTyping(true);
      });

      socket.current.on("stopTyping", (typing_id) => {
        console.log(
          "🚀 ~ file: ChatContainer.jsx:77 ~ socket.current.on ~ typing_id:",
          typing_id
        );

        setIsTyping(false);
      });
    }
  }, [currentChat]);

  // !!!!!!!
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {}, [currentChat]);

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>

              <div className="username">
                <h3>
                  {istyping
                    ? "is typing ……"
                    : currentChat && currentChat.username}
                </h3>
                <Badge status={inOnline} />
              </div>
            </div>

            <Logout socket={socket} />
          </div>

          <div className="chat-messages">
            {messages.map((message) => {
              return (
                <div
                  ref={scrollRef}
                  key={v4()}>
                  {/* 返回数据中有聊天记录及当前用户是否为发送人的布尔值 */}
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "received"
                    }`}>
                    <div className="avatar"></div>
                    <div className="content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInPut
            handleSendMessage={handleSendMessage}
            socket={socket}
            currentChat={currentChat}
          />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 74.7% 15.6%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        display: flex;
        padding-top: 0.5rem;
        gap: 1rem;
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }

    .received {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
