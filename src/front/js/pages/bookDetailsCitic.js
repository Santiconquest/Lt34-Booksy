import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const BookDetailsCritic = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [bookData, setBookData] = useState(null);
    const [review, setReview] = useState(""); 
<<<<<<< HEAD
    const [reviews, setReviews] = useState(store.reviews);

    useEffect(() => {
        const fetchReviews = async () => {
            await actions.getReviews();
        };
        fetchReviews();
    }, []);

  

    useEffect(() => {
        setReviews(store.reviews);
    }, [store.reviews]);
=======
    const [reviews, setReviews] = useState([]); 
>>>>>>> develop

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/book/${params.book_id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
<<<<<<< HEAD
                setBookData(data.book);
=======
                setBookData(data.book); 
                setReviews(data.reviews || []); 
>>>>>>> develop
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        };

        fetchBookData();
    }, [params.book_id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
<<<<<<< HEAD
        const newReview = await actions.addReview(store.userId, params.book_id, review);
        if (newReview) {
            setReviews([...reviews, newReview]); 
            setReview("");
        } else {
            console.error("Error al agregar la reseña.");
        }
=======

        const newReview = { 
            text: review, 
            userEmail: store.userEmail, 
            id: reviews.length + 1 
        };
       
        
        setReviews([...reviews, newReview]);
        setReview(""); 
>>>>>>> develop
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

<<<<<<< HEAD
=======
           
>>>>>>> develop
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

<<<<<<< HEAD
=======
           
>>>>>>> develop
            <h2 className="mt-4">Reseñas</h2>
            <ul className="list-group">
                {reviews.map((r) => (
                    <li key={`${r.id}-email`} className="list-group-item">
                        <strong>{r.id_critico}:</strong> {r.comentario}
                    </li>
                ))}
            </ul>

            <Link to="/listaLibrosCritico">
                <span className="btn btn-primary btn-lg" role="button">
                    Back to list
                </span>
            </Link>
        </div>
    );
};





