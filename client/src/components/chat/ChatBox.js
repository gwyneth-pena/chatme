import { useContext, useEffect } from "react"
import { useFetchRecipient } from "../../hooks/useFetchRecipient"
import { AuthContext } from "../../utils/AuthContext"
import { ChatContext } from "../../utils/ChatContext";
import { Stack } from "react-bootstrap";
import moment from "moment";

export const ChatBox = ()=>{
    const {user} = useContext(AuthContext);
    const {currentChat, messages} = useContext(ChatContext);
    const {recipient} = useFetchRecipient(currentChat, user);

    useEffect(()=>{
    },[recipient, messages]);

    return <>

        {recipient==null && 

            <p style={{textAlign:'center', width: '100%'}}>No chats selected.</p>
            
        }      

        {
            recipient!=null && 

            <Stack gap={4} className="chat-box">
                <div className="chat-header">
                    <strong>{recipient?.name}</strong>
                </div>
                {
                     messages && messages.map((msg,index)=>{
                        return <div style={{display:'flex', flexDirection:'column'}} key={index}>
                            <span>{msg.text}</span>
                            <span>{moment(msg.createdAt).calendar()}</span>
                        </div>

                    })
                }
            </Stack>
        }  


    </>
}