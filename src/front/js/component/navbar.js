import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);

    useEffect(() => {
        console.log(store.auth, store.userType);
    }, [store.auth, store.userType]);

    
    

    const handleLogout = () => {
        
        if (store.userType === "critic") {
            actions.logoutCritico();
        } else if (store.userType === "lector") {
            actions.logoutLector();
        } else if (store.userType === "admin") {
            actions.logoutAdmin(); 
        }
    };

    return (
        <header className="navbar-color py-2 d-none d-md-block pb-1" style={{ marginTop: 0 }}>
            <div className="container-md page-container">
                <div className="row align-items-center navbar">
                    <div className="col" style={{ maxWidth: "500px", }}>
                        <h1 className="text-white mb-3">Booksy</h1>
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
                                className="bg-dark fs-6 no-underline"
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
                            <>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-sm bg-gray-300 text-white hover:bg-opacity-25 active:bg-opacity-50 mr-2"
                                >
                                    Logout
                                </button>

                                {store.userType === "critic" && (
                                    <>
                                        <Link to="/verReviewCritico">
                                            <button className="btn btn-sm bg-gray-300 text-white hover:bg-opacity-25 active:bg-opacity-50 mr-2">
                                                My Reviews
                                            </button>
                                        </Link>
                                        <Link
                                            to="/perfilCritico"
                                            className="btn btn-sm bg-gray-300 text-white hover:bg-opacity-25 active:bg-opacity-50 mr-2"
                                        >
                                            Perfil
                                        </Link>
                                    </>
                                )}
                                {store.userType === "lector" && (
                                    <Link
                                        to="/perfilLector"
                                        className="btn btn-sm bg-gray-300 text-white hover:bg-opacity-25 active:bg-opacity-50 mr-2"
                                    >
                                        Perfil
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="d-flex">
                                    <div className="dropdown mr-2">
                                        <button
                                            className="btn btn-sm bg-gray-300 text-white hover:bg-opacity-25 active:bg-opacity-50 dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Login
                                        </button>
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
                                        <button
                                            className="btn btn-sm bg-gray-300 text-white hover:bg-opacity-25 active:bg-opacity-50 dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Signup
                                        </button>
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