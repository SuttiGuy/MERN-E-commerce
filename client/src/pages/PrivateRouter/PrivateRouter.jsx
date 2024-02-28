import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const PrivateRouter = ({children}) => {
    const {user} =useContext(AuthContext);
    const location = useLocation();
    if(user){
        return children;
    }
    return <Navigate to="/signin" state={{from: location}} replace />
};

export default PrivateRouter;