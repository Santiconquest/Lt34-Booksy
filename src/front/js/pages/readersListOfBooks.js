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
import { NavbarContenido } from "../component/navbarContenido.js";
import { Footer } from "../component/footer.js";


export const ReadersListOfBooks = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState("genero");
    const [showFavorites, setShowFavorites] = useState(false); 
    const [hover, setHover] = useState(false);
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

    const handleMouseEnter = () => {
        setHover(true);
      };
    
      const handleMouseLeave = () => {
        setHover(false);
      };

      const getRecentItems = (items) => {
        return items
            .map(itemId => store.books.find(book => book.id === itemId))  
            .filter(Boolean)  
            .reverse()  
            .slice(0, 3);  
    };
    

    const truncateText = (text, maxWords) => {
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    };

    return (
        <>
        <NavbarContenido/>
        
       <div className="container page-container">
        <div className="row" style={{ width: '100%' }}>
            <div className="col-12 col-md-3" >
                <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">

                  
                  <h6 className="fw-bold text-uppercase mb-3">
                    Filtro
                  </h6>

                 
                  <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">
                    <Link
                        to="#"
                        className={`nav-link ${activeTab === "genero" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(activeTab === "genero" ? "" : "genero");
                        }}
                        >
                        Por Género
                        </Link>
                        <Link
                        to="#"
                        className={`nav-link ${activeTab === "autor" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(activeTab === "autor" ? "" : "autor");
                        }}
                        >
                        Por Autor
                        </Link>
                    </nav>
                </div>               
                    
                    


                  
                  <h6 className="fw-bold text-uppercase mb-4 mt-2">
                    Buscar Por
                  </h6>

                  
                  <ul className="card-list list text-gray-700 mb-0">
                    <li className="list-item">
                        <input
                        type="text"
                        className="form-control me-2 input mb-1"
                        placeholder="Título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1 }} 
                    />
                    </li>
                    <li className="list-item">
                        <input
                        type="text"
                        className="form-control me-2 input mb-1"
                        placeholder="Autor..."
                        value={searchAuthor}
                        onChange={(e) => setSearchAuthor(e.target.value)}
                        style={{ flex: 1 }} 
                    />
                    </li>
                    <li className="list-item">
                        <input
                        type="text"
                        className="form-control input"
                        placeholder="Género..."
                        value={searchGenero}
                        onChange={(e) => setSearchGenero(e.target.value)}
                        style={{ flex: 1 }} 
                    />
                    </li>
                  </ul>

                </div>
              </div>

            </div>

            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">

                <h6 className="fw-bold text-uppercase mb-3 mt-1">
                     Mi Biblioteca
                </h6>

                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">            
                       
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

                <h6 className="fw-bold text-uppercase mb-3 mt-1">
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
                        <Link to="/bookRecommendations" className="nav-item nav-link">
                            Sugerencias AI
                        </Link>
                    </nav>    
                </div>
                </div>
              </div>

            </div>
          </div>
          <div className="col-12 col-md-9">

            
          <div className="card card-bleed shadow-light-lg mb-6 me-0 ms-3  ">
            <div className="card-body pt-0 mt-2">
                <div className="row">
                {activeTab === "genero" && Object.keys(booksByGenero).map((genero, index) => (
                    <div key={index} className="col-12">
                    <div className="text-start mb-4">
                        <h5 className="mb-4 mt-2 recomm-title">{truncateText(genero, 4)}</h5>
                    </div>
                    <div className="row flex-row flex-nowrap" style={{ overflowX: "auto" }}>
                        {booksByGenero[genero].map((book, idx) => (
                        <div key={idx} className="tarjeta-libro me-0" style={{ width: '15rem', marginRight: '1rem' }}>
                        <Link to={`/bookdetails/${book.id}`} className="card-title mb-0 text-decoration-none text-dark">
                            <img
                                src={book.cover}
                                alt={book.titulo}
                                className="card-img-top"
                                style={{ width: '100%', height: '280px', objectFit: 'contain' }}
                            />
                        </Link>
                        <div className="card-body">
                            <Link to={`/bookdetails/${book.id}`} className="card-title mb-0 text-decoration-none text-dark text-start">
                                <div className={`ticker-wrapper ${book.titulo.length > 20 ? 'animate-ticker' : ''}`}>
                                <h5 className="card-title mb-0"><strong> {book.titulo}</strong></h5>
                                </div>
                            </Link>
                            <p className="card-text text-start" style={{ marginBottom: '0' }}>
                                 {truncateText(book.autor, 6)}<br />
                                <strong></strong> {book.year}
                            </p>
                            <div className="text-end">
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
                    </div>
                    
                        ))}
                    </div>
                    </div>
                ))}

                {activeTab === "autor" && Object.keys(booksByAutor).map((autor, index) => (
                    <div key={index} className="col-12">
                    <div className="text-start mb-4">
                        <h5 className="mb-4 mt-2 recomm-title">{truncateText(autor, 6)}</h5>
                    </div>
                    <div className="row flex-row flex-nowrap" style={{ overflowX: "auto" }}>
                        {booksByAutor[autor].map((book, idx) => (
                        <div key={idx} className="tarjeta-libro me-0" style={{ width: '15rem', marginRight: '1rem' }}>
                        <Link to={`/bookdetails/${book.id}`} className="card-title mb-0 text-decoration-none text-dark">
                            <img
                                src={book.cover}
                                alt={book.titulo}
                                className="card-img-top"
                                style={{ width: '100%', height: '280px', objectFit: 'contain' }}
                            />
                        </Link>
                        <div className="card-body">
                            <Link to={`/bookdetails/${book.id}`} className="card-title mb-0 text-decoration-none text-dark text-start">
                                <div className={`ticker-wrapper ${book.titulo.length > 20 ? 'animate-ticker' : ''}`}>
                                    <h5 className="card-title mb-0" style={{ marginBottom: '5px', height: '30px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        <strong>{book.titulo}</strong>
                                    </h5>
                                </div>
                            </Link>
                            <p className="card-text text-start mb-0" style={{ marginBottom: '0' }}>
                                {truncateText(book.genero, 3)}<br />
                                <strong></strong> {book.year}
                            </p>
                            <div className="text-end">
                                <span onClick={() => handleFavoriteToggle(book.id)} className="favorite-icon">
                                    <FontAwesomeIcon icon={store.favorites.includes(book.id) ? solidHeart : regularHeart} />
                                </span>
                                <span onClick={() => handleWishlistToggle(book.id)} className="wishlist-icon ms-2">
                                    <FontAwesomeIcon icon={store.wishlist.includes(book.id) ? solidBookmark : regularBookmark} />
                                </span>
                            </div>
                        </div>
                    </div>
                    
                        ))}
                    </div>
                    </div>
                ))}
                </div>
  

              </div>
            </div>


          </div>
        </div>
        </div>
        <Footer/>
                </>
    );
};
