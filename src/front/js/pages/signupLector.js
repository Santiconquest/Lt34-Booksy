import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const SignupLector = () => {

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [suscriptionDate, setSuscriptionDate] = useState('');

    const { store, actions } = useContext(Context);

    function sendData(e){
        e.preventDefault(); 

     
        actions.addLector(email,password,name,lastName,suscriptionDate);
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
                        <label htmlFor="inputLastName" className="form-label">Last Name</label>
                        <input 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            type="text" 
                            className="form-control" 
                            id="inputLastName" 
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="inputGender" className="form-label">Suscription Date</label>
                        <select 
                            value={suscriptionDate} 
                            onChange={(e) => setSuscriptionDate(e.target.value)} 
                            className="form-select" 
                            aria-label="Default select example"
                        >
                            <option value="" disabled>Select Date</option>
                            {/* Ver como puedo agregar un calendario con la fecha actual */}
                            <label for="start">Start date:</label>

                            <input 
                                type="date" 
                                id="start" 
                                name="trip-start" 
                                value="2024-10-22" 
                                min="2024-01-01" 
                                max="2028-12-31" />

                        </select>
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
                <button type="submit" className="btn btn-primary my-5 px-2" >Register</button>
            </form>
            <Link to="/">
                <button className="btn btn-primary p-2">Back Booksy</button>
            </Link>
        </div>
    );
};

export default SignupLector;
