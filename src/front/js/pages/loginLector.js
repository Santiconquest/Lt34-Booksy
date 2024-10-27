import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";

export const LoginLector = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const astronautIcon = "https://via.placeholder.com/150";
    const emailIcon = "https://via.placeholder.com/50/0000FF/808080?text=Email";
    const passwordIcon = "https://via.placeholder.com/50/FF0000/FFFFFF?text=Pass";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 
        const loginData = await actions.loginLector(email, password);
    
        if (loginData) {
            navigate("/readersListOfBooks");
        } else {
            setError("Email o contraseña incorrectos");
        }
    };

    useEffect(() => {
        // Redirige si el usuario ya está autenticado
        if (store.isAuthenticated) {
            navigate("/readersListOfBooks");
        }
    }, [store.isAuthenticated, navigate]);

    return (
        <>
            <div className="background"></div>
            <div className="centering">
                <form className="my-form" onSubmit={handleSubmit}>
                    <div className="login-welcome-row">
                        <img
                            className="login-welcome"
                            src={astronautIcon}
                            alt="Astronaut"
                        />
                        <h1>LogIn Lectores!</h1>
                    </div>

                    {error && <div className="alert alert-danger" role="alert">{error}</div>}

                    <div className="text-field">
                        <label htmlFor="email">Email:</label>
                        <input
                            aria-label="Email"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <img
                            alt="Email Icon"
                            title="Email Icon"
                            src={emailIcon}
                        />
                    </div>
                    <div className="text-field">
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            aria-label="Password"
                            name="password"
                            placeholder="Your Password"
                            title="Minimum 6 characters at least 1 Alphabet, 1 Number and 1 Symbol"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <img
                            alt="Password Icon"
                            title="Password Icon"
                            src={passwordIcon}
                        />
                    </div>
                    <input type="submit" className="my-form__button" value="Login" />
                    <div className="my-form__actions">
                        <div className="my-form__signup">
                            <Link to="/signup" title="Create Account">Eres nuevo? Crea una cuenta</Link>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};
