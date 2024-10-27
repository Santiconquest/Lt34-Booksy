import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faTrash as trashIcon } from '@fortawesome/free-solid-svg-icons'; // Importar el icono de basurero
import "../../styles/readersListOfBooks.css";
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons'; 
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons'; 

export const ReadersListOfBooks = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState("genero");
    const [showFavorites, setShowFavorites] = useState(false); 

    useEffect(() => {
        actions.getBooks();
    }, []);

    const groupBooks = (key) => {
        return store.books.reduce((acc, book) => {
            const groupKey = book[key];
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(book);
            return acc;
        }, {});
    };

    const booksByGenero = groupBooks("genero");
    const booksByAutor = groupBooks("autor");

    const handleFavoriteToggle = (bookId) => {
        actions.toggleFavorite(bookId); 
    };

    const handleToggleFavorites = () => {
        setShowFavorites(prevState => !prevState);
    };

    return (
        <div className="container">
            <h1 className="m-5">Lista de Libros para Lectores</h1>
            <div className="tabs">
                <button className={`tab ${activeTab === "genero" ? "active" : ""}`} onClick={() => setActiveTab("genero")}>
                    Por Género
                </button>
                <button className={`tab ${activeTab === "autor" ? "active" : ""}`} onClick={() => setActiveTab("autor")}>
                    Por Autor
                </button>
            </div>

            <div className="favorites-dropdown">
    <button onClick={handleToggleFavorites} className="btn btn-primary">
        Favoritos
    </button>
    {showFavorites && (
        <div className="dropdown-content p-3">
            {store.favorites.length === 0 ? (
                <p>No hay elementos que mostrar</p>
            ) : (
                <div>
                    <div className="row">
                        {store.favorites.map((favoriteId) => {
                            const favoriteBook = store.books.find(book => book.id === favoriteId);
                            return (
                                <div key={favoriteId} className="col-12 mb-2">
                                    <div className="card">
                                        <div className="card-body d-flex justify-content-between align-items-center">
                                            <Link to={`/bookdetails/${favoriteBook.id}`} className="card-title mb-0 text-decoration-none text-dark">
                                                {favoriteBook.titulo}
                                            </Link>
                                            <span 
                                                onClick={() => actions.removeFavorite(favoriteId)} 
                                                className="remove-favorite-icon"
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <FontAwesomeIcon icon={trashIcon} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Link to="/favoritosLector" className="btn btn-secondary mt-2">Ver todos</Link>
                </div>
            )}
        </div>
    )}
</div>


            <div className="row">
                {activeTab === "genero" && Object.keys(booksByGenero).map((genero, index) => (
                    <div key={index} className="col-md-6">
                        <h2>{genero}</h2>
                        <div className="row flex-row flex-nowrap" style={{ overflowX: "auto" }}>
                            {booksByGenero[genero].map((book, idx) => (
                                <div key={idx} className="card" style={{ width: '18rem', marginRight: '1rem' }}>
                                    <img
                                        src={book.cover}
                                        alt={book.titulo}
                                        className="card-img-top"
                                        style={{ width: '300px', height: '300px' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{book.titulo}</h5>
                                        <p className="card-text">
                                            <strong>Autor:</strong> {book.autor} <br />
                                            <strong>Cantidad de Páginas:</strong> {book.cantidad_paginas} <br />
                                            <strong>Año Publicado:</strong> {book.year}
                                        </p>
                                        <span 
                                            onClick={() => handleFavoriteToggle(book.id)} 
                                            className="favorite-icon"
                                        >
                                            <FontAwesomeIcon icon={store.favorites.includes(book.id) ? solidHeart : regularHeart} />
                                        </span>
                                        <span 
                                            onClick={() => handleWishlistToggle(book.id)} 
                                            className="wishlist-icon ms-2"
                                        >
                                            <FontAwesomeIcon icon={store.wishlist.includes(book.id) ? solidBookmark : regularBookmark} />
                                        </span>

                                        <Link to={`/bookdetails/${book.id}`} className="btn btn-secondary ms-2">Más</Link>
                                    </div>
                                </div>
                            ))} 
                        </div>
                    </div>
                ))}

                {activeTab === "autor" && Object.keys(booksByAutor).map((autor, index) => (
                    <div key={index} className="col-md-6">
                        <h2>{autor}</h2>
                        <div className="row flex-row flex-nowrap" style={{ overflowX: "auto" }}>
                            {booksByAutor[autor].map((book, idx) => (
                                <div key={idx} className="card" style={{ width: '18rem', marginRight: '1rem' }}>
                                    <img
                                        src={book.cover}
                                        alt={book.titulo}
                                        className="card-img-top"
                                        style={{ width: '300px', height: '300px' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{book.titulo}</h5>
                                        <p className="card-text">
                                            <strong>Género:</strong> {book.genero} <br />
                                            <strong>Cantidad de Páginas:</strong> {book.cantidad_paginas} <br />
                                            <strong>Año Publicado:</strong> {book.year}
                                        </p>
                                        <span 
                                            onClick={() => handleFavoriteToggle(book.id)} 
                                            className="favorite-icon"
                                        >
                                            <FontAwesomeIcon icon={store.favorites.includes(book.id) ? solidHeart : regularHeart} />
                                        </span>
                                        <span 
                                            onClick={() => handleWishlistToggle(book.id)} 
                                            className="wishlist-icon ms-2"
                                        >
                                            <FontAwesomeIcon icon={store.wishlist.includes(book.id) ? solidBookmark : regularBookmark} />
                                        </span>

                                        <Link to={`/bookdetails/${book.id}`} className="btn btn-secondary ms-2">Más</Link>
                                    </div>
                                </div>
                            ))} 
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
