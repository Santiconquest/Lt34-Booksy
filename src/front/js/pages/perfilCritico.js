import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

const ProfileCritico = () => {
    const { store, actions } = useContext(Context);
    const [critic, setCritic] = useState([]); 

    useEffect(() => {
        const fetchCritico = async () => {
            await actions.getCritico();
        };
        fetchCritico();
    }, []);

    useEffect(() => {
        setCritic(store.critico);
    }, [store.critico]); 
    console.log(critic)
    return (
        <div className="container">
            <h1 className="my-5">Critic Profile</h1>
            {critic ? (
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">{critic.nombre} {critic.apellido}</h5>
                        <p className="card-text"><strong>Email:</strong> {critic.email}</p>
                        <p className="card-text"><strong>Gender:</strong> {critic.genero}</p>
                        <p className="card-text"><strong>About Me:</strong> {critic.acerca_de_mi}</p>
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
            <Link to="/">
                <button className="btn btn-primary my-5">Back to Booksy</button>
            </Link>
        </div>
    );
};

export default ProfileCritico;

