import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/profileLector.css"; // Asegúrate de tener estilos compartidos

const ProfileCritico = () => {
    const { store, actions } = useContext(Context);
    const [critic, setCritic] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCritico = async () => {
            if (store.userId) {
                setLoading(true);
                await actions.getCritico();  
                setLoading(false);
            }
        };
        fetchCritico();
    }, [store.userId]);  

    const handleImageUpload = async (e) => {
        const files = e.target.files;

        if (files.length > 0) {
            try {
                await actions.uploadImage(files);
                await updateCritico(store.imageUrl); 
            } catch (error) {
                console.error("Error al manejar la carga de la imagen:", error);
            }
        }
    };

    const updateCritico = async (imageUrl) => {
        const body = {
            nombre: critic.nombre,
            apellido: critic.apellido,
            genero: critic.genero,
            acerca_de_mi: critic.acerca_de_mi,
            email: critic.email,
            images: imageUrl 
        };

        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/critico/${critic.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el crítico");
            }

            const responseData = await response.json();
            console.log("Crítico actualizado:", responseData);
        } catch (error) {
            console.error("Error al actualizar crítico:", error);
        }
    };

    useEffect(() => {
        if (store.critico) {
            setCritic(store.critico); // Este useEffect se ejecuta cuando 'store.critico' cambia
        }
    }, [store.critico]);

    return (
        <div className="container profile-container my-5 card-addbook">
            {loading ? (
                <div>Loading...</div>  // Aquí puedes poner un spinner o un texto de "Cargando..."
            ) : (
                <div className="card shadow-sm">
                    <div className="card-header text-center">
                        <h4>{critic.nombre} {critic.apellido}</h4>
                    </div>
                    <div className="card-body">
                        <div className="d-flex flex-column align-items-center">
                            <div className="profile-image mb-3">
                                <img 
                                    src={critic.images || "https://via.placeholder.com/150"} 
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
                            <p className="card-text"><strong>Email:</strong> {critic.email}</p>
                            <p className="card-text"><strong>Gender:</strong> {critic.genero}</p>
                            <p className="card-text"><strong>About Me:</strong> {critic.acerca_de_mi}</p>
                            <Link to="/listaLibrosCritico" className="btn btn-primary mt-3">
                                Back to list
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileCritico;
