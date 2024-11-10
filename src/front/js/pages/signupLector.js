import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

const SignupLector = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.auth) {
            navigate("/");
        }
    }, [store.auth, navigate]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [error, setError] = useState('');

    const isPasswordValid = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
    };

    function sendData(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!isPasswordValid(password)) {
            setError("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.");
            return;
        }

        setError('');
        actions.addLector(email, password, name, lastname);
        navigate("/loginLector");
    }

    return (
        <div>
            <h1 className="w-50 mx-auto m-5">Register as a Reader</h1>
            <form className="w-50 mx-auto" onSubmit={sendData}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label htmlFor="inputName" className="form-label">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            className="form-control"
                            id="inputName"
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputLastname" className="form-label">Last Name</label>
                        <input
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            type="text"
                            className="form-control"
                            id="inputLastname"
                        />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="exampleInputEmail2" className="form-label">Email address</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            className="form-control"
                            id="exampleInputEmail2"
                            aria-describedby="emailHelp"
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="exampleInputPassword2" className="form-label">Password</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="form-control"
                            id="exampleInputPassword2"
                        />
                    </div>
                </div>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                        />
                    </div>
                </div>
                {error && <div className="text-danger my-2">{error}</div>}
                <button type="submit" className="btn btn-primary my-5 px-2">Register</button>
            </form>
            <Link to="/">
                <button className="btn btn-primary p-2">Back Booksy</button>
            </Link>
        </div>
    );
};

export default SignupLector;
