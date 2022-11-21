import { Navigate, Outlet } from "react-router-dom";

import { tokenApi } from "../../api/api";


const PrivateRoute = () => {


    if (tokenApi.tokenExists()) {
        return <Outlet />;

    } else {
        return <Navigate to="/sign-in" />
    }

}


export default PrivateRoute;