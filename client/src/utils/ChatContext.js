import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {io} from 'socket.io-client';
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { indexOf } from "lodash";

export const ChatContext = createContext();


export const ChatContextProvider = ({children})=>{
    const apiBaseUrl = process.env.NODE_ENV.toLowerCase() === 'development' ?  
    process.env.REACT_APP_API_BASE_URL_DEV: process.env.REACT_APP_API_BASE_PROD;

    const [chats, setChats] = useState([]);

    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const {user} = useContext(AuthContext);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [allMessages, setAllMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    useEffect(()=>{
        const newSocket = io(process.env.REACT_APP_SOCKET_SERVER_URL);
        setSocket(newSocket);
        return ()=>{
            newSocket.disconnect();
        }
    },[user]);


    useEffect(()=>{

        if(socket===null) return;
        socket.emit('addNewUser',user);
        socket.on("getOnlineUsers", (response)=>{
            updateOnlineUsers(response);
        });

        socket.on("getNotifications", (response)=>{
            const isChatOpen = currentChat?.members.some(mem=>mem===response.senderId);

            if(isChatOpen){
                setNotifications(prev=>[...prev, {...response, isRead:true}].sort((a,b)=>{
                    return new Date(b.date).getTime()-new Date(a.date).getTime();
                }));
            }else{
                setNotifications(prev=>[...prev, {...response}].sort((a,b)=>{
                    return new Date(b.date).getTime()-new Date(a.date).getTime();
                }));
            }
        });

        return ()=>{
            socket.off("getOnlineUsers");
            socket.off("getNotifications");
        }
    },[socket, currentChat]);


    useEffect(()=>{
        if(socket===null) return;
        socket.on("getMessage", (response)=>{
            delete response.receiver;
            let message = response;
            if (currentChat?._id===message.chatId){
                setMessages(prev=>[...prev,message]);
            }else{
                axios.get(`${apiBaseUrl}/users`, {
                    headers: {
                        Authorization:  `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response=>{
                    updateAllUsers(response.data.data.user);
                });
            }
            let messageArr = allMessages.filter(item=>item[0]?.chatId==message.chatId)[0];
            if(!messageArr){
                messageArr = [];
            }
            let messageArrIndex = indexOf(allMessages, messageArr);
            if(messageArrIndex==-1){
                messageArrIndex = allMessages.length;
            }
            let newAllMessages = allMessages;
            messageArr?.push(message);
            newAllMessages[messageArrIndex] = messageArr; 
            updateAllMessages(prev=>[...newAllMessages]);
        });

        return ()=>{
            socket.off("getMessage");
        }
    },[socket, currentChat, ]);


    const updateChats = useCallback((chats)=>{
        setChats(chats);
    },[]);

    const updateUsers = useCallback((users)=>{
        setUsers(users);
    },[]);

    const updateAllMessages = useCallback((messages)=>{
        setAllMessages(messages);
    },[]);

    const updateAllUsers = useCallback((users)=>{
        setAllUsers(users);
    },[]);

    const updateNotifications= useCallback((notifications)=>{
        setNotifications(notifications);
    },[]);

    const updateCurrentChat = useCallback((currentChat)=>{
        setCurrentChat(currentChat);
    },[]);

    const updateMessages = useCallback((messages)=>{
        setMessages(messages);
    },[]);

    
    const updateOnlineUsers = useCallback((users)=>{
        setOnlineUsers(users);
    },[]);

    return <ChatContext.Provider value={{
        updateChats,
        chats,
        users,
        updateUsers,
        currentChat,
        updateCurrentChat,
        messages,
        updateMessages,
        onlineUsers,
        socket,
        allUsers,
        updateAllUsers,
        notifications,
        updateNotifications,
        updateAllMessages,
        allMessages
    }}>
        {children}
    </ChatContext.Provider>;
};