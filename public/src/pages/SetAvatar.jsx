import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import loader from "../assets/loader.gif";
import 'react-toastify/dist/ReactToastify.css';
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer"


export default function SetAvatar() {
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();


    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setselectedAvatar] = useState(undefined);


    // 错误提醒配置
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "color"
    }


    const setProfilePicture = async () => { }
    // useEffect(async () => {
    //     const data = [];
    //     for (let i = 0; i < 4; i++) {
    //         const image = await axios.get(
    //             `${api}/${Math.round(Math.random() * 1000)}`//todo
    //         );
    //         const buffer = Buffer.from(image.data);//todo
    //         data.push(buffer.toString("base64"));
    //     }
    //     setAvatars(data);
    //     setIsLoading(false);
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = [];
                for (let i = 0; i < 4; i++) {
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                    const buffer = new Buffer(image.data);
                    data.push(buffer.toString("base64"));
                }
                setAvatars(data);
                setIsLoading(false);
            } catch (error) {
                // 处理错误
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // 调用异步函数
    }, []);



    return (
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
                            <div
                                className={`avatar${selectedAvatar === index}?"selected":""`}
                                key={index}
                            >
                                <img
                                    src={`data:img/svg+xml;base64,${avatar}`}
                                    alt="avatar"
                                    onClick={() => setselectedAvatar(index)} />
                            </div>
                        )
                    })}
                </div>
            </Container>
            <ToastContainer />
        </>
    )
}

const Container = styled.div
    `
    
`
