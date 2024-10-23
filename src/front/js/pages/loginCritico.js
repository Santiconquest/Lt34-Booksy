import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";

const LoginCritico = () => {

    const[email, setEmail] = useState ('')
    const[password, setPassword] = useState ('')
    const { store, actions } = useContext(Context);



    function sendData(e){
        e.preventDefault() 

        actions.loginCritico(email, password)
        
    }
    return(
        <div>
            <form className="w-50 mx-auto" onSubmit={sendData}>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1"/>
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    )

}
export default LoginCritico