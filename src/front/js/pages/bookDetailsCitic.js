import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const BookDetailsCritic = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [bookData, setBookData] = useState(null);
    const [infoLink, setInfoLink] = useState(""); 
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState(store.reviews);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedComment, setEditedComment] = useState("");

    async function fetchBook(bookDataTitulo) {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookDataTitulo)}`);
            const data = await response.json();
    
            if (data.items && data.items.length > 0) {
                return data.items[0].volumeInfo; 
            } else {
                console.log('No se encontraron libros.');
                return null; 
            }
        } catch (error) {
            console.error('Error al buscar el libro:', error);
            return null; 
        }
    }

    useEffect(() => {
        const fetchReviews = async () => {
            await actions.getReviews(params.book_id);
        };
        fetchReviews();
    }, []);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/book/${params.book_id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setBookData(data.book);
                setReviews(store.reviews);

                
                if (data.book && data.book.titulo) {
                    const book = await fetchBook(data.book.titulo);
                    if (book) {
                        setInfoLink(book.infoLink); 
                        console.log(book)
                    }
                }
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        };

        fetchBookData();
    }, [params.book_id, store.reviews]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const newReview = await actions.addReview(store.userId, params.book_id, review);
        if (newReview) {
            actions.getReviews(params.book_id);
            setReview("");
        } else {
            console.error("Error al agregar la reseña.");
        }
    };

    const handleEditClick = (review) => {
        setEditingReviewId(review.id);
        setEditedComment(review.comentario);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const updatedReview = { comentario: editedComment };
        const edited = await actions.editReview(updatedReview, editingReviewId);
        if (edited) {
            actions.getReviews(params.book_id); 
            setEditingReviewId(null);
            setEditedComment("");
        } else {
            console.error("Error al editar la reseña.");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const deleted = await actions.deleteReview(reviewId);
        if (deleted) {
            actions.getReviews(params.book_id); 
        } else {
            console.error("Error al eliminar la reseña.");
        }
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

          
            {infoLink && (
                <a href={infoLink} target="_blank" rel="noopener noreferrer" className="btn btn-success mb-3">
                    Comprar Libro
                </a>
            )}

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

            <h2 className="mt-4">Reseñas</h2>
            <ul className="list-group">
                {reviews.map((r) => (
                    <li key={r.id} className="list-group-item">
                        <strong>{r.id_critico}:</strong> {editingReviewId === r.id ? (
                            <form onSubmit={handleEditSubmit}>
                                <textarea
                                    value={editedComment}
                                    onChange={(e) => setEditedComment(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-success btn-sm">Guardar</button>
                                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingReviewId(null)}>Cancelar</button>
                            </form>
                        ) : (
                            <span>{r.comentario}</span>
                        )}
                        <div className="float-end">
                            {editingReviewId !== r.id && (
                                <>
                                    <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(r)}>Editar</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(r.id)}>Eliminar</button>
                                </>
                            )}
                        </div>
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

