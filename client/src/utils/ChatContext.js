import { createContext, useCallback, useState } from "react";

export const ChatContext = createContext();


export const ChatContextProvider = ({children})=>{

    const [chats, setChats] = useState([]);

    const [users, setUsers] = useState([]);

    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);


    const updateChats = useCallback((chats)=>{
        setChats(chats);
    },[]);

    const updateUsers = useCallback((users)=>{
        setUsers(users);
    },[]);

    const updateCurrentChat = useCallback((currentChat)=>{
        setCurrentChat(currentChat);
    },[]);

    const updateMessages = useCallback((messages)=>{
        setMessages(messages);
    },[]);

    return <ChatContext.Provider value={{
        updateChats,
        chats,
        users,
        updateUsers,
        currentChat,
        updateCurrentChat,
        messages,
        updateMessages
    }}>
        {children}
    </ChatContext.Provider>;
};