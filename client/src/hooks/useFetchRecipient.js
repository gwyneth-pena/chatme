import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchRecipient = (chat, user)=>{

    const apiBaseUrl = process.env.NODE_ENV.toLowerCase() === 'development' ?  
    process.env.REACT_APP_API_BASE_URL_DEV: process.env.REACT_APP_API_BASE_PROD;

    const [recipient, setRecipient] = useState(null);
    const [error, setError] = useState(null);
    const recipientId = chat?.members.find(id=>user?.id!==id);

    useEffect(()=>{

        const getUser = ()=>{

            if(!recipientId) return null;

            axios.get(`${apiBaseUrl}/users/${recipientId}`, {
                headers: {
                    Authorization:  `Bearer ${localStorage.getItem('token')}`
            }}).then(response=>{
                setRecipient(response.data.data);
            }).catch(error=>{
                setError(error.response.data.message);
            })

        }

        getUser();

    },[chat, user])

    return {recipient, error};
}