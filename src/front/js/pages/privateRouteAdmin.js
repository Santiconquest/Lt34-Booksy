import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

const PrivateRouteAdmin = ({ element }) => {
    const { store } = useContext(Context);

    if (store.auth && store.userType === "admin") {
        return element; 
    } else {
        return <Navigate to="/" />; 
    }
};

export default PrivateRouteAdmin;
