import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa'; // Importando los íconos
import "../../styles/bookDetail.css";
import { NavbarContenido } from "../component/navbarContenido.js";
import { Footer } from "../component/footer.js";

export const BookDetail = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const [book, setBook] = useState(null);
    const [description, setDescription] = useState("");
    const [reviews, setReviews] = useState([]);
    const [infoLink, setInfoLink] = useState(""); 
    const location = useLocation(); 
    const key= "AIzaSyBwjy42UMUJBiaTBw-cLmkxixGvX0iyMD4"

    useEffect(() => {
        const foundBook = store.books.find((b) => b.id === parseInt(id));
        if (foundBook) {
            setBook(foundBook);
            fetchBookDescription(foundBook.titulo);
            fetchBookReviews(foundBook.id);
            fetchBookPurchaseLink(foundBook.titulo); 
        }
    }, [id, store.books]);

    const fetchBookDescription = async (title) => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${key}`);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const bookDetails = data.items[0].volumeInfo;
                setDescription(bookDetails.description || "Descripción no disponible");
            } else {
                setDescription("Descripción no disponible");
            }
        } catch (error) {
            console.log("Error fetching book description", error);
            setDescription("Descripción no disponible");
        }
    };

    const fetchBookReviews = async (bookId) => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/reviews?book_id=${bookId}`);
            if (!response.ok) throw new Error("Error fetching reviews");
            const data = await response.json();
            setReviews(data); 
        } catch (error) {
            console.log("Error fetching reviews", error);
        }
    };
    
    const fetchBookPurchaseLink = async (title) => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=AIzaSyBwjy42UMUJBiaTBw-cLmkxixGvX0iyMD4`);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const bookDetails = data.items[0].volumeInfo;
                setInfoLink(bookDetails.infoLink || ""); 
            }
        } catch (error) {
            console.log("Error fetching purchase link", error);
        }
    };

    const handleAddToFavorites = () => {
        if (book) {
            actions.toggleFavorite(book.id);
        }
    };

    const handleAddToWishlist = () => {
        if (book) {
            actions.toggleWishlist(book.id);
        }
    };

    if (!book) {
        return <div>Cargando...</div>;
    }

    return (
        <>
        <NavbarContenido/>
            <div className="container page-container">
          <div className="row" style={{ width: '100%' }}>
              <div className="col-12 col-md-3" >

              <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
                <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body text-start" style={{ paddingLeft: '20px', paddingTop: "8px" }}>

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
                <div className="card-body text-start" style={{ paddingLeft: '20px', paddingTop: "8px" }}>

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


                <div className="book-detail-container">
                
                <div className="book-detail-content">
                    <img 
                        src={book.cover} 
                        alt={book.titulo} 
                        className="img-fluid mt-2 ms-3" 
                    />
                    <div className="text-start">
                        <h2>{book.titulo}</h2>
                        <p><strong>Autor:</strong> {book.autor}</p>
                        <p><strong>Género:</strong> {book.genero}</p>
                        <p><strong>Cantidad de Páginas:</strong> {book.cantidad_paginas}</p>
                        <p><strong>Año Publicado:</strong> {book.year}</p>
                        <p><strong>Descripción:</strong> {description || "No disponible"}</p>
                        
                        {/* Botón de compra */}
                        <button className="buttonBuy">
                            <svg viewBox="0 0 16 16" className="bi bi-cart-check" height="24" width="24" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                                <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"></path>
                                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                            </svg>
                            {infoLink && (
                                <a href={infoLink} target="_blank" rel="noopener noreferrer" className="texto">
                                Comprar
                                </a>
                            )}
                        </button>
                    </div>
                </div>

                <h5 className="mt-4 text-start">Reseñas</h5>
                <ul className="list-group">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <li key={review.id} className="list-group-item">
                                <strong>{review.id_critico}:</strong> {review.comentario}
                            </li>
                        ))
                    ) : (
                        <li className="list-group-item">No hay reseñas disponibles.</li>
                    )}
                </ul>
            </div>
            
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
