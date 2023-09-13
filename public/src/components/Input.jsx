import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function Input({ handleSendMessage }) {
  // 表情选择器显示状态
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiHidden = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // 获取到选择的表情并添加到消息中
  const handleEmojiClick = (emojiObj) => {
    setMsg((prevMsg) => {
      console.log(
        "🚀 ~ file: Chatinput.jsx:19 ~ handleEmojiClick ~ prevMsg:",
        prevMsg
      );
      return prevMsg + emojiObj.emoji;
    });
  };

  // 发送信息
  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMessage(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-contaier">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiHidden} />
          {/* 选择表情 */}
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick}></Picker>}
        </div>
      </div>
      <form
        className="input-container"
        onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onClick={() => {
            setShowEmojiPicker(false);
          }}
        />
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  //todo
  /* width: 100%; */
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }

  .button-contaier {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ccd639e6;
        cursor: pointer;
      }
      .EmojiPickerReact {
        --epr-bg-color: #080420;
        --epr-hover-bg-color: #080420;
        position: absolute;
        top: -475px;
        /* background-color: #080420; */
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9186f3;

        //todo
        ::-webkit-scrollbar {
          background-color: #080420;
          width: 5px;
        }
        ::-webkit-scrollbar-thumb {
          background-color: #9186f3; /* 设置 thumb 的背景颜色 */
          border-radius: 4px; /* 可选：设置 thumb 圆角 */
        }
        .epr-search-container {
          input {
            background-color: transparent;
            border-color: #9186f3;
          }
        }
        .epr-emoji-category-label {
          background-color: #080420;
        }
      }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-content: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      /* height: 60%; */
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9186f3;
      }
      // todo
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
