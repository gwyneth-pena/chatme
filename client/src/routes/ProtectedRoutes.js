import { Navigate, Outlet} from "react-router-dom";


const ProtectedRoutes = ({user}) => {

    if (!user) {
        // localStorage.removeItem('token');
        return <Navigate to="/login"/>
    } else {
        return <Outlet/>
    }

}

export default ProtectedRoutes;