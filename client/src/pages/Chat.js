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

    const {chats, updateChats, users, updateUsers, currentChat, updateCurrentChat, messages, updateMessages} = useContext(ChatContext);
    const {user} = useContext(AuthContext);
    const [chatLoading, setChatLoading] = useState(true);
    const [chatError, setChatError] = useState(null);
    const [messageError, setMessageError] = useState(null);

    useEffect(()=>{

        axios.get(`${apiBaseUrl}/chats/${user.id}`, {
            headers: {
                Authorization:  `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            let chatsReceived = response.data;
            setChatLoading(false);
            updateChats(chatsReceived);

            
            axios.get(`${apiBaseUrl}/users`, {
                headers: {
                    Authorization:  `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response=>{
                let chats = [];
                chatsReceived.forEach(item => {
                    chats.push(item.members[0])
                    chats.push(item.members[1])
                });
                let users = response.data.data.user.filter(usr=>{
                    return usr._id!==user.id && !chats.includes(usr._id);
                });
                updateUsers(users);
            }).catch(error=>{
                setChatError(error.response.data.message);
            });

        }).catch(error=>{
            setChatLoading(false);
            setChatError(error.response.data.message);
        });

    },[]);

    useEffect(()=>{
    },[chats,users])

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

    return (
        <>
            <NavBar></NavBar>
            <Container className="my-4">
                <Stack direction="horizontal" gap={4} className="align-items-start">
                        {
                        chats?.length>0 && 
                        <Stack className="messages-box flex-grow-0" gap={3}>
                        <FindUser data={users}/>
                        {chatLoading && <p>Loading...</p>}
                        {chatError && <p>Oops there's an error. Try again later.</p>}
                        { chats?.map((item,index)=>{
                            return <div key={index} onClick={()=>{updateCurrentChat(item);}}>
                                <UserChat chat={item} user={user}/>
                            </div>
                        }) }
                    </Stack>
                    }
                    <ChatBox/>
                </Stack>
            </Container>
        </>
    );
}

export default Chat;