import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";
import white from "../../img/white.jpg"; 
 
export const Navbar = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [lector, setLector] = useState([]); 
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

    
    useEffect(() => {
        const fetchLector = async () => {
            const lectorId = store.lectorId;  
            if (lectorId) {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/lector/${lectorId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setLector(data);
                    } else {
                        console.error("No se encontró el lector");
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del lector:", error);
                }
            }
        };
        fetchLector();
    }, [store.lectorId]);

    
    useEffect(() => {
        setCritic(store.critico);
    }, [store.critico]);

    const handleLogout = () => {
        if (store.userType === "critic") {
            actions.logoutCritico();
        } else if (store.userType === "lector") {
            actions.logoutLector();
        } else if (store.userType === "admin") {
            actions.logoutAdmin(); 
        }
    };

    
    const userName = store.userType === "lector" 
    ? `${lector.name} ${lector.lastname}` 
    : store.userType === "critic" 
    ? `${critic.nombre} ${critic.apellido}` 
    : store.userType === "admin" 
    ? "My Account" 
    : "";
    const userImage = store.userType === "lector" 
    ? lector.images 
    : store.userType === "critic" 
    ? critic.images 
    : store.userType === "admin" 
    ? `${white}`  // Asegúrate de tener la URL de una imagen blanca aquí
    : "default-image-url";
 
   

    return (
        <header 
            className="d-none d-md-block" 
            style={{
                borderBottom: "1px solid rgb(200, 200, 200)", 
            }}
        >


            <div className="container-md page-container">
                <div className="row align-items-center navbar">
                    <div className="col" style={{ maxWidth: "100%", }}>
                        <Link to="/" style={{ textDecoration: "none" }}>
                            <h1 className="mb-1" style={{ color: "rgb(54 97 255)" }}>Booksy</h1>
                        </Link>

                        <div className="col d-flex">
                            {store.auth && (
                                <Link 
                                    to={ 
                                        store.userType === "lector" 
                                        ? "/readersListOfBooks" 
                                        : store.userType === "critic" 
                                        ? "/listaLibrosCritico" 
                                        : store.userType === "admin" 
                                        ? "/books" 
                                        : "/" 
                                    }
                                    className="fs-6 no-underline"
                                >
                                    {store.userType === "admin" 
                                        ? "Añadir/Quitar/Editar Libro" 
                                        : "Lista de Libros"}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="col-auto d-flex">
                        {store.auth ? (
                            <div className="dropdown">
                            <button
                                className="btn btn-sm bg-gray-300 text-white hover:bg-opacity-25 active:bg-opacity-50"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={userImage} 
                                        alt="User" 
                                        className="rounded-circle user-image" 
                                        style={{ width: "30px", height: "30px", objectFit: "cover", marginRight: "10px" }} 
                                    />
                                    <span>{userName}</span>
                                </div>
                            </button>
                            <ul className="dropdown-menu">
                                {store.userType === "critic" && (
                                    <>
                                        <li>
                                            <Link to="/verReviewCritico" className="dropdown-item">
                                                My Reviews
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/perfilCritico" className="dropdown-item">
                                                Perfil
                                            </Link>
                                        </li>
                                    </>
                                )}
                                {store.userType === "lector" && (
                                    <li>
                                        <Link to="/perfilLector" className="dropdown-item">
                                            Perfil
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        ) : (
                            <>
                                <div className="d-flex">
                                    <div className="row justify-content-center mt-2" style={{width: "680px"}}>
                                        <div className="col-auto">
                                            {/* <Link 
                                                to="/equipment" 
                                                className="btn-link text-decoration-none"
                                                style={{
                                                    color: "#007bff", 
                                                    fontSize: "1rem", 
                                                }}
                                            >
                                                Team
                                            </Link> */}
                                        </div>
                                    </div>


                                    <div className="dropdown mr-2">
                                        <Link to="/equipment">
                                    <button
                                            style={{ backgroundColor: "rgb(54 97 255)", color: "white", border: "none" }}
                                            className="btn btn-sm "
                                            type="button"
                                            
                                        >
                                            Team
                                        </button>
                                        </Link>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link className="dropdown-item" to="/loginLector">
                                                    Como Lector
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/loginCritico">
                                                    Como Crítico
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/loginAdmin">
                                                    Como Administrador
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="dropdown">
                                    {/* <button
                                            style={{ backgroundColor: "rgb(54 97 255)", color: "white", border: "none" }}
                                            className="btn btn-sm dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Signup
                                        </button> */}

                                        <ul className="dropdown-menu">
                                            <li>
                                                <Link className="dropdown-item" to="/signupLector">
                                                    Como Lector
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/signupCritico">
                                                    Como Crítico
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
