import moment from "moment";
import { useFetchMessagesByChat } from "../../hooks/useFetchMessagesByChat";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../utils/ChatContext";
import _, { concat } from 'lodash';

const UserChat = ({chat,user, sortedAllMessages})=>{

    const { recipient } = useFetchRecipient(chat, user);
    const {allMessages, updateAllMessages, messages} = useContext(ChatContext);
    const { messagesByChat } = useFetchMessagesByChat(chat);
    const [sortedMessages, setSortedMessages] = useState([]);

    useEffect(()=>{
        let messagesByUser = [];
        if(messagesByChat[0]?.chatId){
            messagesByUser = sortedAllMessages.filter(item=>item[0]?.chatId==messagesByChat[0]?.chatId)[0];
        }else{
            messagesByUser = messages.sort((a, b)=>{
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        }
        setSortedMessages(messagesByUser);
    }, [allMessages, sortedAllMessages, messages]);

    useEffect(()=>{
        if(messagesByChat.length!=0){
            const existingMsg = allMessages.filter(item=>item[0]?.chatId==messagesByChat[0]?.chatId);
            if(existingMsg.length==0){    
                updateAllMessages(prev=>[...prev, messagesByChat]);
            }
        }else{
            updateAllMessages(prev=>[...prev, []]);
        }
    },[messagesByChat]);

    return <>
        <Stack direction="horizontal" gap={3} className="chat-preview align-items-center p-2 justify-content-between">
            <div className="d-flex">
                <div className="me-2" name-initials={recipient?.name[0]?.toUpperCase()}></div>
                <div className="text-content">
                    <div className="name">{recipient?.name}  {recipient?.isOnline 
                        && <span className="online">●</span>
                    } </div>
                    <div className="text">{sortedMessages?.length>0?sortedMessages[0]?.text:null}</div>
                    <div className="date">{sortedMessages?.length>0?moment(sortedMessages[0]?.createdAt).calendar():null}</div>
                </div>
            </div>
        </Stack>
    </>
}

export default UserChat;