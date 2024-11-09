import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faTrash as trashIcon } from '@fortawesome/free-solid-svg-icons';
import "../../styles/readersListOfBooks.css";
import { faBookmark as solidBookmark } from '@fortawesome/free-solid-svg-icons'; 
import { faBookmark as regularBookmark } from '@fortawesome/free-regular-svg-icons'; 

export const ReadersListOfBooks = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState("genero");
    const [showFavorites, setShowFavorites] = useState(false); 
    const [showWishlist, setShowWishlist] = useState(false); 
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAuthor, setSearchAuthor] = useState(""); 
    const [searchGenero, setSearchGenero] = useState(""); 

    useEffect(() => {
        actions.getBooks();
    }, []);

    const filteredBooks = store.books.filter(book =>
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        book.autor.toLowerCase().includes(searchAuthor.toLowerCase()) && 
        book.genero.toLowerCase().includes(searchGenero.toLowerCase())
    );

    const groupBooks = (key) => {
        return filteredBooks.reduce((acc, book) => {
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

    const handleWishlistToggle = (bookId) => {
        actions.toggleWishlist(bookId); 
    };

    const handleToggleFavorites = () => {
        setShowFavorites(prevState => !prevState);
    };

    const handleToggleWishlist = () => {
        setShowWishlist(prevState => !prevState);
    };

    const getRecentItems = (items) => {
        return items
            .map(itemId => store.books.find(book => book.id === itemId)) 
            .filter(Boolean) 
            .sort((a, b) => new Date(b.fechaAgregado) - new Date(a.fechaAgregado)) 
            .slice(0, 3); 
    };

    const truncateText = (text, maxWords) => {
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    };

    return (
        <div className="container">
            <h1 className="m-5">Booksy</h1>

            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar por título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1 }} 
                />
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar por autor..."
                    value={searchAuthor}
                    onChange={(e) => setSearchAuthor(e.target.value)}
                    style={{ flex: 1 }} 
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por género..."
                    value={searchGenero}
                    onChange={(e) => setSearchGenero(e.target.value)}
                    style={{ flex: 1 }} 
                />
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === "genero" ? "active" : ""}`} onClick={() => setActiveTab("genero")}>
                    Por Género
                </button>
                <button className={`tab ${activeTab === "autor" ? "active" : ""}`} onClick={() => setActiveTab("autor")}>
                    Por Autor
                </button>
            </div>

            <div className="d-flex justify-content-start mb-3">
                <div className="favorites-dropdown me-2">
                    <button className="btn btn-primary" onClick={handleToggleFavorites}>Favoritos</button>
                    {showFavorites && (
                        <div className="dropdown-content p-3">
                            {store.favorites.length === 0 ? (
                                <p>No hay elementos que mostrar</p>
                            ) : (
                                <div>
                                    <div className="row">
                                        {getRecentItems(store.favorites).map((favoriteBook) => (
                                            <div key={favoriteBook.id} className="col-12 mb-2">
                                                <div className="card">
                                                    <div className="card-body d-flex justify-content-between align-items-center">
                                                        <Link to={`/bookdetails/${favoriteBook.id}`} className="card-title mb-0 text-decoration-none text-dark">
                                                            {truncateText(favoriteBook.titulo, 5)} 
                                                        </Link>
                                                        <span 
                                                            onClick={() => actions.toggleFavorite(favoriteBook.id)} 
                                                            className="remove-favorite-icon"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <FontAwesomeIcon icon={trashIcon} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to="/favoritosLector" className="btn btn-secondary mt-2">Ver todos</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="wishlist-dropdown me-2">
                    <button className="btn btn-success" onClick={handleToggleWishlist}>Wishlist</button>
                    {showWishlist && (
                        <div className="dropdown-content p-3">
                            {store.wishlist.length === 0 ? (
                                <p>No hay elementos en la wishlist</p>
                            ) : (
                                <div>
                                    <div className="row">
                                        {getRecentItems(store.wishlist).map((wishlistBook) => (
                                            <div key={wishlistBook.id} className="col-12 mb-2">
                                                <div className="card">
                                                    <div className="card-body d-flex justify-content-between align-items-center">
                                                        <Link to={`/bookdetails/${wishlistBook.id}`} className="card-title mb-0 text-decoration-none text-dark">
                                                            {truncateText(wishlistBook.titulo, 5)} 
                                                        </Link>
                                                        <span 
                                                            onClick={() => actions.toggleWishlist(wishlistBook.id)} 
                                                            className="remove-wishlist-icon"
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <FontAwesomeIcon icon={trashIcon} />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Link to="/wishlistLector" className="btn btn-secondary mt-2">Ver todos</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                
                <Link to="/bookRecommendations" className="btn btn-warning">
                    Booksy AI
                </Link>
                <Link to="/visionAPI" className="btn btn-dark">
                    BooksyQuest
                </Link>
            </div>

            <div className="row">
                {activeTab === "genero" && Object.keys(booksByGenero).map((genero, index) => (
                    <div key={index} className="col-md-6">
                        <h2>{genero}</h2>
                        <div className="row flex-row flex-nowrap" style={{ overflowX: "auto" }}>
                            {booksByGenero[genero].map((book, idx) => (
                                <div key={idx} className="card" style={{ width: '18rem', marginRight: '1rem' }}>
                                    <Link to={`/bookdetails/${book.id}`} className="card-title mb-0 text-decoration-none text-dark">
                                        <img
                                            src={book.cover}
                                            alt={book.titulo}
                                            className="card-img-top"
                                            style={{ width: '100%', height: '200px', objectFit: 'contain' }} 
                                        />
                                    </Link>
                                    <div className="card-body">
                                    <Link to={`/bookdetails/${book.id}`} className="card-title mb-0 text-decoration-none text-dark">
                                        <h5 className="card-title" style={{ marginBottom: '5px', height: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncateText(book.titulo, 5)}</h5>
                                    </Link>
                                        <p className="card-text">
                                            <strong>Autor:</strong> {truncateText(book.autor, 4)}<br />
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
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{truncateText(book.titulo, 5)}</h5> 
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
