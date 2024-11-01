import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const SignupLector = () => {

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
   

    const { store, actions } = useContext(Context);

    function sendData(e){
        e.preventDefault(); 

     
        actions.addLector(email,password,name,lastname);
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
                <button type="submit" className="btn btn-primary my-5 px-2" >Register</button>
            </form>
            <Link to="/">
                <button className="btn btn-primary p-2">Back Booksy</button>
            </Link>
        </div>
    );
};

export default SignupLector;
