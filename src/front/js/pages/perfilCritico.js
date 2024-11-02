import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";


const ProfileCritico = () => {
    const { store, actions } = useContext(Context);
    const [critic, setCritic] = useState([]);                  

    const handleImageUpload = (e) => {
        const files = e.target.files;
        actions.uploadImage(files);
    };

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
            <div>
                <h1>Upload Profile Image</h1>
                <input type="file" onChange={handleImageUpload} />
                {store.loading ? (
                    <p>Loading...</p>
                ) : store.imageUrl ? (
                    <img src={store.imageUrl} alt="Uploaded" style={{ width: "150px", height: "auto" }} />

                ) : (
                    <p>No image uploaded</p>
                )}
        </div>
            
            {critic ? (
                <div className="card my-5">
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
            <Link to="/listaLibrosCritico">
                <span className="btn btn-primary btn-lg" role="button">
                    Back to list
                </span>
            </Link>
        </div>
    );
};

export default ProfileCritico;

