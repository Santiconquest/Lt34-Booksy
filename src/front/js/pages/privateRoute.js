import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

const PrivateRoute = ({ element }) => {
    const { store } = useContext(Context);

    return store.auth ? element : <Navigate to="/" />;
};

export default PrivateRoute;
