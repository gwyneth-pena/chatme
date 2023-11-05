import { useContext, useEffect, useRef, useState } from "react"
import { useFetchRecipient } from "../../hooks/useFetchRecipient"
import { AuthContext } from "../../utils/AuthContext"
import { ChatContext } from "../../utils/ChatContext";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import '../../../src/index.css';
import { indexOf } from "lodash";


export const ChatBox = ()=>{

    const apiBaseUrl = process.env.NODE_ENV.toLowerCase() === 'development' ?  
    process.env.REACT_APP_API_BASE_URL_DEV: process.env.REACT_APP_API_BASE_PROD;

    const {user} = useContext(AuthContext);
    const {currentChat, messages, updateMessages, socket,onlineUsers, updateAllMessages, allMessages} = useContext(ChatContext);
    const {recipient} = useFetchRecipient(currentChat, user);
    const [textMsg, setTextMsg] = useState("");
    const [textMsgError, setTextMsgError] = useState(null);
    const scroll = useRef();
    
    useEffect(()=>{
        return ()=>{
            socket.off('sendMessage');
        }
    },[recipient, messages]);

    useEffect(()=>{
        scroll.current?.scrollIntoView({behavior:'smooth'});
    },[messages, textMsg]);

    const submit = (text, chatId, senderId, messages)=>{
        let body = {text, senderId, chatId};
        if(text!==""){
            axios.post(`${apiBaseUrl}/messages/create`, body,{
                headers: {
                    Authorization:  `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response=>{
                let msgs = messages;
                msgs.push(response.data);
                let receiver = currentChat.members.filter(mem=>mem!==user.id);
                socket.emit('sendMessage', {message:{...response.data,receiver:receiver[0]}, onlineUsers});
                let messageArr = allMessages.filter(item=>item[0]?.chatId==chatId)[0];
                if(!messageArr){
                    messageArr = [];
                }
                let messageArrIndex = indexOf(allMessages, messageArr);
                if(messageArrIndex==-1){
                    messageArrIndex = allMessages.length;
                }
                let newAllMessages = allMessages;
                messageArr.push(response.data);
                newAllMessages[messageArrIndex] = messageArr; 
                updateAllMessages(prev=>[...newAllMessages]);
                updateMessages(msgs);
                setTextMsg('');
                setTextMsgError(null);
            }).catch(error=>{
                setTextMsgError(error.response?.data.message);
            })
        }
    };

    return <>

        <div style={{height:"85vh", width:"100%"}}>
            {recipient==null && 

            <Stack gap={4} style={{height:"100%"}}>
                <p style={{textAlign:'center', width: '100%'}}>No chats selected.</p>
            </Stack>            
            }      

            {
            recipient!=null && 

            <Stack gap={4} className="w-100" style={{height:"100%"}}>
                <Stack gap={3} className="overflow-auto w-100">
                    <div className="chat-header">
                        <strong>{recipient?.name}</strong>
                    </div>
                    <div className="mt-5">
                        {
                            messages && messages?.map((msg,index)=>{
                                return <div className={user.id!==msg.senderId?'chat-msg others':'chat-msg mine'}  key={index}  ref={scroll}>
                                    <span>{msg.text}</span>
                                    <span className="chat-time">{moment(msg.createdAt).calendar()}</span>
                                </div>

                            })
                        }
                    </div>
                </Stack>
                <Stack direction="horizontal" gap={3} className="mt-auto">
                    <InputEmoji value={textMsg} onChange={setTextMsg} placeholdeer="Type a message"/>
                    <button onClick={()=>{submit(textMsg, currentChat?._id, user?.id, messages)}} className="btn btn-secondary">Send</button>
                </Stack>
                {textMsgError && <p className="text-danger">{textMsgError}</p>}
            </Stack>
            }  
        </div>


    </>
}