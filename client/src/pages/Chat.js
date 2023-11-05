import NavBar from "../components/Navbar";
import { Container, Stack } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../utils/ChatContext";
import axios from "axios";
import { AuthContext } from "../utils/AuthContext";
import UserChat from "../components/chat/UserChat";
import { FindUser } from "../components/chat/FindUser";
import { ChatBox } from "../components/chat/ChatBox";


function Chat(){

    const apiBaseUrl = process.env.NODE_ENV.toLowerCase() === 'development' ?  
    process.env.REACT_APP_API_BASE_URL_DEV: process.env.REACT_APP_API_BASE_PROD;

    const {chats, 
           updateChats, 
           users, 
           updateUsers, 
           updateAllUsers, 
           currentChat, 
           notifications,
           onlineUsers,
           updateCurrentChat,
           allUsers,
           allMessages,
           updateMessages} = useContext(ChatContext);
    const {user} = useContext(AuthContext);
    const [chatLoading, setChatLoading] = useState(true);
    const [chatError, setChatError] = useState(null);
    const [messageError, setMessageError] = useState(null);
    const [sortedAllMessages, setSortedAllMessages] = useState([]);

    useEffect(()=>{

        axios.get(`${apiBaseUrl}/chats/${user.id}`, {
            headers: {
                Authorization:  `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            let chatsReceived = response.data;
            setChatLoading(false);
            getChatsWithStatus(chatsReceived);
            
            axios.get(`${apiBaseUrl}/users`, {
                headers: {
                    Authorization:  `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response=>{
                let chatsArr = [];
                chatsReceived.forEach(item => {
                    chatsArr.push(item.members[0])
                    chatsArr.push(item.members[1])
                });
                let users = response.data.data.user.filter(usr=>{
                    return usr._id!==user.id && !chatsArr.includes(usr._id);
                });
                updateUsers(users);
                updateAllUsers(response.data.data.user);
            }).catch(error=>{
                setChatError(error.response.data.message);
            });

        }).catch(error=>{
            setChatLoading(false);
            setChatError(error.response.data.message);
        });

    },[]);

    useEffect(()=>{
        getChatsWithStatus(chats);
    },[onlineUsers, users])

    useEffect(()=>{
        axios.get(`${apiBaseUrl}/messages/${currentChat?._id}`,{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            updateMessages(response.data);
        }).catch(error=>{
            setMessageError(error.response.data.message);
        });
    },[currentChat])

    
    useEffect(()=>{
        let sortedByDate = allMessages.map(item=>{
            item = item.sort((a,b)=>{
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            return item;
        });
        setSortedAllMessages(sortedByDate);
    },[allMessages])

    const getChatsWithStatus = (chats)=>{
        let updatedChats = chats;
        updatedChats = updatedChats.map(chat=>{
            let receiver = chat?.members?.find(i=>i!==user?.id);
            return {
                ...chat, 
                isOnline: onlineUsers?.some(onlineUser=>onlineUser.id===receiver)
            };
        });
        updateChats(updatedChats);
    }

    return (
        <>
            <NavBar></NavBar>
            <Container className="my-4">
                <Stack direction="horizontal" gap={4} className="align-items-start">

                    <Stack className="messages-box flex-grow-0" gap={3}>
                        <FindUser data={users}/>
                        <Stack style={{maxHeight:"90vh", minHeight:'40vh', overflowY:"scroll"}}>
                            {chatLoading && <p>Loading...</p>}
                            {chatError && <p>Oops there's an error. Try again later.</p>}
                            {chats?.length>0 &&  chats.map((item,index)=>{
                                return <div key={index} onClick={()=>{updateCurrentChat(item);}}>
                                    <UserChat chat={item} user={user} sortedAllMessages={sortedAllMessages}/>
                                </div>
                            }) }
                        </Stack>
                    </Stack>
                    <ChatBox/>
                </Stack>
            </Container>
        </>
    );
}

export default Chat;