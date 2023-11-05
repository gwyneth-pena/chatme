import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../utils/ChatContext";
import { Stack } from "react-bootstrap";
import moment from "moment";
import '../../../src/index.css';


const Notifications = () => {

    const {notifications, updateNotifications, chats, updateCurrentChat, allUsers} = useContext(ChatContext);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadNotif, setUnreadNotif] = useState([]);


    useEffect(()=>{
        setUnreadNotif(notifications.filter(item=>!item.isRead));
    }, [notifications]);    


    const markAllAsUnread = (notifications, status)=>{
        let newNotifications = notifications.map(item=>{
            return {...item, isRead:status?false:true};
        });

        updateNotifications(newNotifications);
    };

    const markAsRead = (notification, status)=>{
        let newNotifications = notifications.map(item=>{
            if (item !== notification) return item;
            else return {...item, isRead:status?true:false};
        });

        newNotifications = newNotifications.sort((a, b)=>{
            return new Date(b.createdAt).getTime - new Date(a.createdAt).getTime();
        });

        let currentChat = chats.filter(item=>{
            return item.members?.includes(notification.senderId);
        });

        if(currentChat.length>0){
            updateCurrentChat(currentChat[0]);
        }
        updateNotifications(newNotifications);
        setIsOpen(false);
    };

    const getSenderName = (senderId)=>{
        let senderName = allUsers.filter(usr=>usr._id==senderId)[0]?.name;
        return senderName;
    };

    return <div className="me-4 cursor-pointer notification-bell">
        <i onClick={()=>setIsOpen(!isOpen)} style={{cursor:'pointer'}}>
        <svg style={{position:'relative'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bell-fill" viewBox="0 0 16 16">
            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
        </svg>
        {
            unreadNotif.length>0 &&
            <span className="text-danger notification-indicator">●</span>
        }
        </i>
        {
            isOpen && 
            <div className="notification-container overflow-auto">
                <button className="btn bg-white text-dark text-centers" onClick={()=>markAllAsUnread(notifications, true)}>Mark all as unread</button><br/>
                <button className="btn bg-white text-dark text-centers mt-2" onClick={()=>markAllAsUnread(notifications, false)}>Mark all as read</button><br/>
                {   
                    notifications.length>0 ?             
                    <div className="mt-3">
                        {
                            notifications.map((notif, index)=>{
                                return <Stack key={index} direction="horizontal" className={`mb-2 p-3 notification-content ${!notif.isRead?"unread":""}`} gap={3} onClick={()=>markAsRead(notif)}>
                                    <p style={{margin:0, padding:0}}><strong>{getSenderName(notif.senderId)}</strong> sent you a message.
                                    <br/>
                                    <span>{moment(notif.createdAt).calendar()}</span>
                                    </p>
                                </Stack>
                            })
                        }
                    </div>
                    :
                    <Stack direction="horizontal" style={{marginTop:"20px"}} gap={3}>No notifications yet...</Stack>
                }
            </div>
        }
    </div>;
}
 
export default Notifications;