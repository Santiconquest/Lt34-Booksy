import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/signup.css";

const SignupCritico = () => {
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
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [aboutMe, setAboutMe] = useState('');
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
        actions.signupCritico(email, password, name, lastName, gender, aboutMe);
        navigate("/loginCritico");
    }

    return (
        <section className="container-fluid d-block vh-100 p-0">
            <div className="container-fluid d-flex flex-column ms-5">
                <div className="row align-items-center justify-content-center gx-0 min-vh-100"> 
                    <div  className="col-12 col-md-6 col-lg-4 py-8 py-md-11">
                        {/* Heading */}
                        <h1 className="mb-0 fw-bold mt-5">Critico Profesional</h1>
                        {/* Text */}
                        <p className="mb-6 text-body-secondary">Danos tu mejor opinión</p>
                        {/* Form */}
                        <form className="mx-auto" onSubmit={sendData}>
                            {/* Name, LastName and Gender*/}
                            <div className="form-group">
                                <div className="col">
                                    <label htmlFor="inputName" className="form-label">Nombre</label>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        id="inputName"
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="inputLastName" className="form-label">Apellido</label>
                                    <input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        type="text"
                                        className="form-control"
                                        id="inputLastName"
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="inputGender" className="form-label">Genero</label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="form-select"
                                        aria-label="Default select example"
                                    >
                                        <option value="" disabled>Selecciona tu Género</option>
                                        <option value="Female">Femenino</option>
                                        <option value="Male">Masculino</option>
                                    </select>
                                </div>
                            </div>
                            {/* Email and password*/}
                            <div className="form-group">
                                <div className="col">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        aria-describedby="emailHelp"
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                    <input
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                        className="form-control"
                                        id="exampleInputPassword1"
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar Password</label>
                                    <input
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        type="password"
                                        className="form-control"
                                        id="confirmPassword"
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Acerca de tí</label>
                                    <textarea
                                        value={aboutMe}
                                        onChange={(e) => setAboutMe(e.target.value)}
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows="3"
                                    ></textarea>
                                </div>
                            </div>
                            {error && <div className="text-danger my-2">{error}</div>}
                             {/* Submit*/}
                            <button type="submit" className="btn btn-primary my-5 w-100">Registrarse</button>
                        </form>
                        {/* <Link to="/">
                            <button className="btn btn-primary">Back Booksy</button>
                        </Link> */}
                    </div>
                    <div className="col-lg-7 offset-lg-1 align-self-stretch d-none d-lg-block derecha">
                            {/* Image */}
                            <div className="h-100 w-cover bg-cover"></div>
                            {/* Shape */}
                            <div className="shape shape-start shape-fluid-y text-white triangle">
    
                            </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default SignupCritico;
