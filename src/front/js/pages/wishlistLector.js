import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faTrash as trashIcon } from '@fortawesome/free-solid-svg-icons';
import { faEye as eyeIcon } from '@fortawesome/free-solid-svg-icons';
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

    const handleWishlistToggle = (bookId) => {
        actions.toggleWishlist(bookId); 
    };

    return (
        <>
        <div className="container page-container">
            <div className="row" style={{ width: '100%' }}>
                <div className="col-12 col-md-3">
                    <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
                        <div className="collapse d-md-block" id="sidenavCollapse">
                            <div className="card-body">
                                <h6 className="fw-bold text-uppercase mb-3 mt-2">Mi Biblioteca</h6>
                                <nav className="nav flex-column">
                                    <Link to="/readersListOfBooks" className="nav-item nav-link">Lista de Libros</Link>
                                    <Link to="/favoritosLector" className="nav-item nav-link">Favoritos</Link>
                                    <Link to="/wishlistLector" className={`nav-item nav-link ${location.pathname === "/wishlistLector" ? "active" : ""}`}>Wishlist</Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
                        <div className="collapse d-md-block" id="sidenavCollapse">
                            <div className="card-body">
                                <h6 className="fw-bold text-uppercase mb-3 mt-2">Herramientas Booksy</h6>
                                <nav className="nav flex-column">
                                    <Link to="/chat" className="nav-item nav-link">ChatScribe</Link>
                                    <Link to="/visionAPI" className={`nav-item nav-link ${location.pathname === "/visionAPI" ? "active" : ""}`}>ScanBook</Link>
                                    <Link to="/bookRecommendations" className={`nav-item nav-link ${location.pathname === "/bookRecommendations" ? "active" : ""}`}>Sugerencias AI</Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-9">
                    <div className="card card-bleed shadow-light-lg mb-6 me-0 ms-3">
                        <div className="card-body">
                            <div className="text-start mb-4">
                                <h5 className="recomm-title">Wishlist</h5>
                            </div>

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
                                            <div key={wishlistId} className="col-md-3 mb-1"> 
                                                <div className="tarjeta-wish" style={{ height: '334px', border: "none"}}>
                                                    <img 
                                                        src={wishlistBook.cover}
                                                        alt={wishlistBook.titulo}
                                                        className="card-img-top"
                                                        style={{ maxHeight: '200px', width: '100%', objectFit: 'contain', margin: 'auto', height: '200px' }} 
                                                    />
                                                    <div className="card-body text-center">
                                                        <h5 className="card-title mb-1" style={{ height: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                            {truncateTitle(wishlistBook.titulo, 40)}
                                                        </h5> 
                                                        <p className="card-text mb-2" style={{ height: '35px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                                            {truncateTitle(wishlistBook.autor, 20)}
                                                        </p>
                                                        <div className="d-flex justify-content-center">
                                                            <Link to={`/bookdetails/${wishlistBook.id}`} className="">
                                                                <FontAwesomeIcon icon={eyeIcon} className="icon-style eye" />
                                                            </Link>
                                                            <span 
                                                                onClick={() => handleWishlistToggle(wishlistBook.id)} 
                                                                className="-icon ms-3"
                                                            >
                                                                <FontAwesomeIcon icon={store.wishlist.includes(wishlistBook.id) ? trashIcon : regularHeart} className="icon-style" />
                                                            </span>
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
        </>
    );
};
