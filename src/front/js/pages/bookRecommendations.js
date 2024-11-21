import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import "../../styles/readersListOfBooks.css";
import { NavbarContenido } from "../component/navbarContenido.js";
import { Footer } from "../component/footer.js";

const BookRecommendations = () => {
    const { store, actions } = useContext(Context);
    const location = useLocation(); 

    const handleGetRecommendations = () => {
        actions.getRecommendations();
    };

    useEffect(() => {
        handleGetRecommendations();
    }, []); 

    return (
        <>
        <NavbarContenido/>
        <div className="container page-container">
        <div className="row" style={{ width: '100%' }}>
            <div className="col-12 col-md-3" >

            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">

                <h6 className="fw-bold text-uppercase mb-3 mt-2">
                     Mi Biblioteca
                </h6>

                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">            
                        <Link to="/readersListOfBooks" className="nav-item nav-link">
                            Lista de Libros
                        </Link>
                        <Link to="/favoritosLector" className="nav-item nav-link">
                            Favoritos
                        </Link>
                        <Link to="/wishlistLector" className="nav-item nav-link">
                            Wishlist
                        </Link>
                    </nav>
                </div>
                </div>
              </div>

            </div>
            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">

                <h6 className="fw-bold text-uppercase mb-3 mt-2">
                    Herramientas Booksy
                </h6>

                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">
                        <Link to="/chat" className="nav-item nav-link">
                            ChatScribe
                        </Link>
                        <Link to="/visionAPI" className="nav-item nav-link">
                            ScanBook
                        </Link>
                        <Link 
                            to="/bookRecommendations" 
                            className={`nav-item nav-link ${location.pathname === "/bookRecommendations" ? "active" : ""}`} // Agregar clase activa según la ruta
                        >
                            Sugerencias AI
                        </Link>
                    </nav>    
                </div>
                </div>
              </div>

            </div>
          </div>



          <div className="col-12 col-md-9">
            <div className="card card-bleed shadow-light-lg mb-6 me-0 ms-3">
              <div className="card-body">
              <div className="row">
              <div className="text-start">
                <h5 className="recomm-title mb-4">Recomendación de Booksy</h5>
                </div>
                <div className="text-center">
                
                <div className="mt-3" style={{ minHeight: '100px' }}>
                    {store.loading ? ( 
                        <div>
                        <div className="spinner-grow text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        </div>
                    ) : store.recommendations.length > 0 ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            <p className="text-dark">{store.recommendations[0]}</p>
                        </div>
                    ) : (
                        <p className="text-dark">No hay recomendaciones disponibles.</p> 
                    )}

                    <button 
                        className="btn btn-primary btn-lg shadow-lg mb-3 mt-3 " 
                        onClick={handleGetRecommendations}
                    >
                        Mas Sugerencias
                    </button>
                </div>
                
            </div>            </div>

              </div>
            </div>


          </div>
        </div>
        </div>
        <Footer/>
        </>
    );
};

export default BookRecommendations;
