import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";


const ProfileLector = () => {
    const { store, actions } = useContext(Context);
    const [lector, setLector] = useState([]);                  

    const handleImageUpload = (e) => {
        const files = e.target.files;
        actions.uploadImage(files);
    };

    useEffect(() => {
        const fetchLector = async () => {
            await actions.getLector();
        };
        fetchLector();
    }, []);

    useEffect(() => {
        setLector(store.lector);
    }, [store.lector]); 
    console.log(lector)
    return (
        <div className="container">
            <h1 className="my-5">Lector Profile</h1>
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
            
            {lector ? (
                <div className="card my-5">
                    <div className="card-body">
                        <h5 className="card-title">{lector.name} {lector.lastname}</h5>
                        <p className="card-text"><strong>Email:</strong> {lector.email}</p>
                        
                    </div>
                </div>
            ) : (
                <p>Loading profile...</p>
            )}
            <Link to="/readersListOfBooks">
                <button className="btn btn-primary my-5">Back to Booksy</button>
            </Link>
        </div>
    );
};

export default ProfileLector;