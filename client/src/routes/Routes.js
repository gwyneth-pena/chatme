import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthContext";



const Routes = ()=>{
    const {user} = useContext(AuthContext);

    const publicRoutes = [
        {
            path:'/login',
            element: user?<Navigate to="/chat"/>:<Login/>
        },
        {
            path:'/register',
            element: user?<Navigate to="/chat"/>:<Register/>
        }
    ];

    const forAuthenticatedRoutes = [
        {
            path:"/",
            element: <ProtectedRoutes user={user}/>,
            children:[
                {
                    path: "/chat",
                    element: <Chat/>
                },
                {
                    path: "/**",
                    element: <Chat/>
                }
            ]

        }
    ];

    const router = createBrowserRouter([
        ...publicRoutes,
        ...forAuthenticatedRoutes
    ]);

    return <RouterProvider router={router} />;
};


export default Routes;
