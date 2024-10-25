import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const BookDetailsCritic = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [bookData, setBookData] = useState(null);
    const [review, setReview] = useState(""); // Estado para la reseña
    const [reviews, setReviews] = useState([]); // Estado para las reseñas

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/book/${params.book_id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setBookData(data.book); // Asumiendo que la respuesta contiene un objeto `book`
                setReviews(data.reviews || []); // Asumiendo que la respuesta también contiene reseñas
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        };

        fetchBookData();
    }, [params.book_id]);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        
        // Aquí asegúrate de usar el email del usuario logueado
        const newReview = { 
            text: review, 
            userEmail: store.userEmail, // Usa el email del usuario logueado
            id: reviews.length + 1 
        };
       
        // Actualiza el estado local (en un caso real, también deberías enviar esto al backend)
        setReviews([...reviews, newReview]);
        setReview(""); // Limpiar el campo de la reseña
    };

    if (!bookData) return <p>Loading book details...</p>;

    return (
        <div className="jumbotron">
            <h1 className="display-4">{bookData.titulo}</h1>
            <p><strong>Autor:</strong> {bookData.autor}</p>
            <p><strong>Cantidad de Páginas:</strong> {bookData.cantidad_paginas}</p>
            <p><strong>Género:</strong> {bookData.genero}</p>
            <p><strong>Año Publicado:</strong> {bookData.year}</p>
            <img src={bookData.cover} alt={bookData.titulo} style={{ width: '300px', height: '300px' }} />
            <hr className="my-4" />

            {/* Formulario para agregar reseñas */}
            <form onSubmit={handleReviewSubmit}>
                <div className="mb-3">
                    <label htmlFor="review" className="form-label">Agregar una reseña</label>
                    <textarea
                        id="review"
                        className="form-control"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Enviar Reseña</button>
            </form>

            {/* Mostrar reseñas */}
            <h2 className="mt-4">Reseñas</h2>
            <ul className="list-group">
                {reviews.map((r) => (
                    <li key={r.id} className="list-group-item">
                        <strong>{r.userEmail}:</strong> {r.text}
                    </li>
                ))}
            </ul>

            <Link to="/">
                <span className="btn btn-primary btn-lg" role="button">
                    Back home
                </span>
            </Link>
        </div>
    );
};


