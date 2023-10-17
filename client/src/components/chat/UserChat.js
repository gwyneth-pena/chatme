import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";

const UserChat = ({chat,user})=>{

    const {recipient} = useFetchRecipient(chat, user);

    return <>
        <Stack direction="horizontal" gap={3} className="chat-preview align-items-center p-2 justify-content-between">
            <div className="d-flex">
                <div className="me-2" name-initials={recipient?.name[0]?.toUpperCase()}></div>
                <div className="text-content">
                    <div className="name">{recipient?.name}  <span className="online">●</span> </div>
                    <div className="text">I love you!</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">10/14/2023</div>
                <div className="unread">2</div>
            </div>
        </Stack>
    </>
}

export default UserChat;