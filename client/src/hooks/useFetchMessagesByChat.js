import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchMessagesByChat = (chat)=>{

    const apiBaseUrl = process.env.NODE_ENV.toLowerCase() === 'development' ?  
    process.env.REACT_APP_API_BASE_URL_DEV: process.env.REACT_APP_API_BASE_PROD;

    const [messagesByChat, setMessagesByChat] = useState([]);
    const [error, setError] = useState(null);

    useEffect(()=>{

        const getMessages = ()=>{
            axios.get(`${apiBaseUrl}/messages/${chat._id}`, {
                headers: {
                    Authorization:  `Bearer ${localStorage.getItem('token')}`
            }}).then(response=>{
                setMessagesByChat(response.data);
            }).catch(error=>{
                setError(error.response?.data?.message);
            })

        }

        getMessages();
    },[])

    return {messagesByChat, error};
}