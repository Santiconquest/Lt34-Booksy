import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

const PrivateRouteCritico = ({ element }) => {
    const { store } = useContext(Context);

    
    return store.auth && store.userType === "critic" ? element : <Navigate to="/" />;
};

export default PrivateRouteCritico;
