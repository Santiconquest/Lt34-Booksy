import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Link, useLocation } from "react-router-dom";
import "../../styles/bookDetail.css";
import { NavbarContenido } from "../component/navbarContenido.js";
import { Footer } from "../component/footer.js";

export const BookDetail = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const [book, setBook] = useState(null);
    const [description, setDescription] = useState("");
    const [reviews, setReviews] = useState([]);
    const [critics, setCritics] = useState([]);
    const [infoLink, setInfoLink] = useState(""); 
    const location = useLocation();
    const key = "AIzaSyBwjy42UMUJBiaTBw-cLmkxixGvX0iyMD4";

    useEffect(() => {
        const foundBook = store.books.find((b) => b.id === parseInt(id));
        if (foundBook) {
            setBook(foundBook);
            fetchBookDescription(foundBook.titulo);
            fetchBookReviews(foundBook.id);
            fetchBookPurchaseLink(foundBook.titulo); 
            fetchCritics();
        }
    }, [id, store.books]);

    const fetchBookDescription = async (title) => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${key}`);
            const data = await response.json();
            setDescription(data.items?.[0]?.volumeInfo?.description || "Descripción no disponible");
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

    const fetchCritics = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/critico`);
            if (!response.ok) throw new Error("Error fetching critics");
            const data = await response.json();
            setCritics(data);
        } catch (error) {
            console.error("Error fetching critics:", error);
        }
    };

    const fetchBookPurchaseLink = async (title) => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&key=${key}`);
            const data = await response.json();
            setInfoLink(data.items?.[0]?.volumeInfo?.infoLink || ""); 
        } catch (error) {
            console.log("Error fetching purchase link", error);
        }
    };

    const getCriticName = (id) => {
        const critic = critics.find((user) => user.id === id);
        return critic ? critic.nombre : "Crítico desconocido";
    };

    const handleAddToFavorites = () => {
        if (book) actions.toggleFavorite(book.id);
    };

    const handleAddToWishlist = () => {
        if (book) actions.toggleWishlist(book.id);
    };

    if (!book) {
        return <div>Cargando...</div>;
    }

    return (
        <>
            <NavbarContenido />
            <div className="container page-container">
                {/* Sidebar */}
                <div className="row" style={{ width: '100%' }}>
                    <div className="col-12 col-md-3">
                        {/* Sidebar content */}
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
                                                <p><strong>Descripción:</strong> {description}</p>
                                                <button className="buttonBuy">
                                                    <a href={infoLink} target="_blank" rel="noopener noreferrer" className="texto">
                                                        Comprar
                                                    </a>
                                                </button>
                                            </div>
                                        </div>
                                        <h5 className="mt-4 text-start">Reseñas</h5>
                                        <ul className="list-group">
                                            {reviews.length > 0 ? (
                                                reviews.map((review) => (
                                                    <li key={review.id} className="list-group-item">
                                                        <strong>{getCriticName(review.id_critico)}:</strong> {review.comentario}
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
            <Footer />
        </>
    );
};
