import { useCallback, useContext, useRef } from "react";
import ReactSearchBox from "react-search-box";
import { ChatContext } from "../../utils/ChatContext";
import axios from 'axios';
import { AuthContext } from "../../utils/AuthContext";


export const FindUser = ({data}) => {

    const apiBaseUrl = process.env.NODE_ENV.toLowerCase() === 'development' ?  
    process.env.REACT_APP_API_BASE_URL_DEV: process.env.REACT_APP_API_BASE_PROD;

    data = data.map(item=>{return {value: item.name, key:item._id}});
    const { updateChats, chats, updateUsers, users, updateCurrentChat } = useContext(ChatContext);
    const {user} = useContext(AuthContext);
    const chatsRendered = useRef([]);
    const usersRendered = useRef([]);
    usersRendered.current = users || [];
    chatsRendered.current = chats || [];

    const createChat = useCallback(({item})=>{
    
        const body = {
            firstId: item.key,
            secondId: user.id
        };
        axios.post(`${apiBaseUrl}/chats/create`, body, {
            headers: {
                Authorization:  `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response=>{
            if(response){
                chatsRendered.current.push(response.data);
                if(chatsRendered.current){
                    let chatsSum = [];
                    chatsRendered?.current?.forEach(item => {
                        chatsSum.push(item.members[0])
                        chatsSum.push(item.members[1])
                    });
        
                    usersRendered.current = usersRendered.current.filter(usr=>{
                        return usr._id!==user.id && !chatsSum.includes(usr._id);
                    });
        
                    updateCurrentChat(response.data);
                    updateChats(chatsRendered.current);
                    updateUsers(usersRendered.current);
                }
            }
        }); 
    },[]);

    return <>
        <ReactSearchBox
            clearOnSelect={true}
            onSelect={createChat}
            placeholder="Search user"
            data={data}
        />
    </>
};