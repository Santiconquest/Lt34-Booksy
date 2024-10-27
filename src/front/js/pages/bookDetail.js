import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/bookDetail.css";

export const BookDetail = () => {
    const { id } = useParams();
    const { store, actions } = useContext(Context);
    const [book, setBook] = useState(null);
    const [description, setDescription] = useState("");

    useEffect(() => {
        const foundBook = store.books.find((b) => b.id === parseInt(id));
        if (foundBook) {
            setBook(foundBook);
            fetchBookDescription(foundBook.titulo); // Llama a la función para obtener la descripción
        }
    }, [id, store.books]);

    const fetchBookDescription = async (title) => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}&key=AIzaSyBwjy42UMUJBiaTBw-cLmkxixGvX0iyMD4`);
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
        <div className="book-detail-container">
            <h1 className="mt-5">{book.titulo}</h1>
            <div className="book-detail-content">
                <img 
                    src={book.cover} 
                    alt={book.titulo} 
                    className="img-fluid" 
                />
                <div>
                    <h2>Detalles del Libro</h2>
                    <p><strong>Autor:</strong> {book.autor}</p>
                    <p><strong>Género:</strong> {book.genero}</p>
                    <p><strong>Cantidad de Páginas:</strong> {book.cantidad_paginas}</p>
                    <p><strong>Año Publicado:</strong> {book.year}</p>
                    <p><strong>Descripción:</strong> {description || "No disponible"}</p>
                    <button 
                        onClick={handleAddToFavorites} 
                        className="btn btn-primary mt-3 me-2"
                    >
                        {store.favorites.includes(book.id) ? "Quitar de Favoritos" : "Añadir a Favoritos"}
                    </button>
                    <button 
                        onClick={handleAddToWishlist} 
                        className="btn btn-secondary mt-3"
                    >
                        {store.wishlist.includes(book.id) ? "Quitar de Wishlist" : "Añadir a Wishlist"}
                    </button>
                </div>
            </div>
        </div>
    );
};
