import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/profileLector.css";


const ProfileLector = () => {
    const { store, actions } = useContext(Context);
    const [lector, setLector] = useState([]);  

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            try {
                await actions.uploadImage(files);
                await updateLector(store.imageUrl);
            } catch (error) {
                console.error("Error al manejar la carga de la imagen:", error);
            }
        }
    };

    const updateLector = async (imageUrl) => {
        const body = {
            nombre: lector.name,         
            apellido: lector.lastname,
            email: lector.email,
            images: imageUrl              
        };
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/lector/${lector.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error("Error al actualizar el lector");
            }
            const responseData = await response.json();
            console.log("Lector actualizado:", responseData);
        } catch (error) {
            console.error("Error al actualizar lector:", error);
        }
    };

    useEffect(() => {
        const fetchLector = async () => {
            await actions.getLector();
        };
        fetchLector();
    }, []);

    useEffect(() => {
        setLector(store.lector);
        console.log(store.lector);
    }, [store.lector]); 

    return (
        <div className="container profile-container my-5 card-addbook">
            <div className="card shadow-sm">
                <div className="card-header  text-center">
                    <h4>{lector.name} {lector.lastname}</h4>
                </div>
                <div className="card-body">
                    <div className="d-flex flex-column align-items-center">
                        <div className="profile-image mb-3">
                            <img 
                                src={lector.images || "https://via.placeholder.com/150"} 
                                alt="Uploaded" 
                                className="rounded-circle" 
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                        </div>
                        <input 
                            type="file" 
                            className="form-control mb-4" 
                            onChange={handleImageUpload} 
                            style={{ maxWidth: "300px" }} 
                        />
                        <p className="card-text"><strong>Email:</strong> {lector.email}</p>
                        <Link to="/readersListOfBooks" className="btn btn-primary mt-3">
                            Volver a Booksy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileLector;
