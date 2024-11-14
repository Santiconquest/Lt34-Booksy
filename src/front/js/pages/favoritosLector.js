import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../styles/favoritosLector.css"; 

export const FavoritosLector = () => {
    const { store, actions } = useContext(Context);
    const location = useLocation(); 

    useEffect(() => {
        
        actions.getBooks(); 
    }, [actions]); 

    const truncateTitle = (title, maxLength) => {
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
    };

    return (
        <>

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
                        <Link to="/favoritosLector" className={`nav-item nav-link ${location.pathname === "/favoritosLector" ? "active" : ""}`}>
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
                        <Link to="/visionAPI" className={`nav-item nav-link ${location.pathname === "/visionAPI" ? "active" : ""}`}>
                            ScanBook
                        </Link>
                        <Link 
                            to="/bookRecommendations" 
                            className={`nav-item nav-link ${location.pathname === "/bookRecommendations" ? "active" : ""}`} 
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

              <h1 className="mt-5">Favoritos del Lector</h1>
                {store.books.length === 0 ? (
                    <p>Cargando libros...</p> 
                ) : store.favorites.length === 0 ? (
                    <p>No hay libros en tus favoritos.</p>
                ) : (
                    <div className="row">
                        {store.favorites.map((favoriteId) => {
                            const favoriteBook = store.books.find(book => book.id === favoriteId);
                            if (!favoriteBook) return null;

                            return (
                                <div key={favoriteId} className="col-md-3 mb-4"> 
                                    <div className="card" style={{ height: '365px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <img
                                            src={favoriteBook.cover}
                                            alt={favoriteBook.titulo}
                                            className="card-img-top"
                                            style={{ maxHeight: '200px', width: '100%', objectFit: 'contain', margin: 'auto' }} 
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ marginBottom: '5px', height: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncateTitle(favoriteBook.titulo, 40)}</h5> 
                                            <p className="card-text" style={{ marginTop: '10px', height: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                <strong>Autor:</strong> {truncateTitle(favoriteBook.autor, 20)}
                                            </p>
                                            <div className="d-flex justify-content-between">
                                                <Link to={`/bookdetails/${favoriteBook.id}`} className="btn btn-primary">Ver Detalles</Link>
                                                <button 
                                                    className="btn btn-danger ml-2" 
                                                    onClick={() => actions.toggleFavorite(favoriteBook.id)} 
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}



              </div>
              </div>
              </div>
            </div>
          </div>
        </div>
        </>
    );
};
