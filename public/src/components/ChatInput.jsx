import React, { useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput() {
  // 表情选择器显示状态
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiHidden = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // 获取到选择的表情并添加到消息中
  const handleEmojiClick = (emojiObj) => {
    setMsg((prevMsg) => prevMsg + emojiObj.emoji);
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
      <form className="input-container">
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
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;

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
        position: absolute;
        top: -475px;
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
      height: 60%;
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
      svg {
        font-size: 2rem;
      }
    }
  }
`;
