import jwt_decode from "jwt-decode";
import { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{

    const [user, setUser] = useState(null);

    const updateUser = useCallback((user)=>{
        setUser(user);
    },[]);

    const logoutUser = useCallback(()=>{
        localStorage.clear();
        setUser(null);
    },[]);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const {id, name, exp} = jwt_decode(token);
            if (exp * 1000 >= new Date().getTime()) {
                setUser({id, name});
            }else{
                setUser(null);
            }
        }
    },[]);
    
    return <AuthContext.Provider value={{
        updateUser,
        logoutUser,
        user
    }}>
        {children}
    </AuthContext.Provider>;
};

