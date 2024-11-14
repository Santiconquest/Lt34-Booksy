import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import "../../styles/wishlistLector.css"; 

export const WishlistLector = () => {
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
                        <Link to="/favoritosLector" className="nav-item nav-link">
                            Favoritos
                        </Link>
                        <Link to="/wishlistLector" className={`nav-item nav-link ${location.pathname === "/wishlistLector" ? "active" : ""}`}>
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


              <div className="container">
            <h1 className="mt-5">Lista de Deseos del Lector</h1>
            {store.books.length === 0 ? (
                <p>Cargando libros...</p> 
            ) : store.wishlist.length === 0 ? (
                <p>No hay libros en tu lista de deseos.</p>
            ) : (
                <div className="row">
                    {store.wishlist.map((wishlistId) => {
                        const wishlistBook = store.books.find(book => book.id === wishlistId);
                        if (!wishlistBook) return null; 

                        return (
                            <div key={wishlistId} className="col-md-3 mb-4"> 
                                <div className="card" style={{ height: '365px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <img
                                        src={wishlistBook.cover}
                                        alt={wishlistBook.titulo}
                                        className="card-img-top"
                                        style={{ maxHeight: '200px', width: '100%', objectFit: 'contain', margin: 'auto' }} 
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title" style={{ marginBottom: '5px', height: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {truncateTitle(wishlistBook.titulo, 40)}
                                        </h5> 
                                        <p className="card-text" style={{ marginTop: '10px', height: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            <strong>Autor:</strong> {truncateTitle(wishlistBook.autor, 40)}
                                        </p>
                                        <div className="d-flex justify-content-between">
                                            <Link to={`/bookdetails/${wishlistBook.id}`} className="btn btn-primary">Ver Detalles</Link>
                                            <button 
                                                className="btn btn-danger ml-2" 
                                                onClick={() => actions.toggleWishlist(wishlistBook.id)} 
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
        </div>


        
        </>
    );
};
