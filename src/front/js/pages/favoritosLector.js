import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../../styles/favoritosLector.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faTrash as trashIcon } from '@fortawesome/free-solid-svg-icons';
import { faEye as eyeIcon } from '@fortawesome/free-solid-svg-icons';

export const FavoritosLector = () => {
    const { store, actions } = useContext(Context);
    const location = useLocation();

    useEffect(() => {
        actions.getBooks();
    }, [actions]);

    const handleFavoriteToggle = (bookId) => {
        actions.toggleFavorite(bookId); 
    };

    const truncateTitle = (title, maxLength) => {
        return title.length > maxLength ? title.slice(0, maxLength) + '...' : title;
    };

    return (
        <div className="container page-container">
            <div className="row" style={{ width: '100%' }}>
                {/* Sidebar Izquierdo */}
                <div className="col-12 col-md-3">
                    <div className="card mb-3 border-bottom shadow-light-lg me-5">
                        <div className="collapse d-md-block">
                            <div className="card-body">
                                <h6 className="fw-bold text-uppercase mb-3 mt-2">Mi Biblioteca</h6>
                                <nav className="nav flex-column">
                                    <Link to="/readersListOfBooks" className="nav-item nav-link">Lista de Libros</Link>
                                    <Link to="/favoritosLector" className={`nav-item nav-link ${location.pathname === "/favoritosLector" ? "active" : ""}`}>Favoritos</Link>
                                    <Link to="/wishlistLector" className="nav-item nav-link">Wishlist</Link>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="card mb-3 border-bottom shadow-light-lg me-5">
                        <div className="collapse d-md-block">
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

                {/* Sección Principal de Favoritos */}
                <div className="col-12 col-md-9">
                    <div className="card shadow-light-lg mb-6 me-0 ms-3">
                        <div className="card-body">
                            <div className="text mb-4">
                                <h5 className="recomm-title">Favoritos</h5>
                            </div>
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
                                            <div key={favoriteId} className="col-md-3 mb-1">
                                                <div className="d-flex flex-column justify-content-between" style={{ height: '334px' }}>
                                                    <img
                                                        src={favoriteBook.cover}
                                                        alt={favoriteBook.titulo}
                                                        className="card-img-top"
                                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                                    />
                                                    <div className="card-body text-center">
                                                        <h5 className="card-title mb-1" style={{ height: '30px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{truncateTitle(favoriteBook.titulo, 40)}</h5>
                                                        <p className="card-text mb-2" style={{ height: '35px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{truncateTitle(favoriteBook.autor, 20)}</p>
                                                        <div className="d-flex justify-content-center">
                                                            <Link to={`/bookdetails/${favoriteBook.id}`} className="icon-link">
                                                                <FontAwesomeIcon icon={eyeIcon} className="icon-style eye" />
                                                            </Link>
                                                            <span 
                                                                onClick={() => handleFavoriteToggle(favoriteBook.id)} 
                                                                className="trash-icon ms-3"
                                                            >
                                                                <FontAwesomeIcon icon={store.favorites.includes(favoriteBook.id) ? trashIcon : regularHeart} className="icon-style" />
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
    );
};
