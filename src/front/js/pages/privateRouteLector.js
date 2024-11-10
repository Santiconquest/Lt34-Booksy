import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../store/appContext";

const PrivateRouteLector = ({ element }) => {
    const { store } = useContext(Context);

    // Verificar si el usuario está autenticado y su tipo es 'lector'
    if (store.auth && store.userType === "lector") {
        return element; // Si es lector, permitir el acceso
    } else {
        return <Navigate to="/" />; // Si no es lector, redirigir a la página principal
    }
};

export default PrivateRouteLector;
