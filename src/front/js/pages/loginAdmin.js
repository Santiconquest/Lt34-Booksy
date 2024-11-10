import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Navigate } from "react-router-dom";

const LoginAdmin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // Nuevo estado para manejar errores
    const { store, actions } = useContext(Context);

    function sendData(e) {
        e.preventDefault();
        
        // Restablecer el error antes de intentar el login
        setError('');

        actions.loginAdmin(email, password)
            .then(() => {
                // Si el login es exitoso, el store se actualiza y redirige automáticamente
            })
            .catch((errorMessage) => {
                // Si ocurre un error, se muestra un mensaje de error
                setError(errorMessage);
            });
    }

    return (
        <div>
            {store.auth ? (
                <Navigate to='/addbook' /> 
            ) : (
                <form className="w-50 mx-auto" onSubmit={sendData}>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="form-control"
                            id="exampleInputEmail"
                            aria-describedby="emailHelp"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="form-control"
                            id="exampleInputPassword"
                        />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}  {/* Mostrar el mensaje de error */}
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            )}
        </div>
    );
}

export default LoginAdmin;
