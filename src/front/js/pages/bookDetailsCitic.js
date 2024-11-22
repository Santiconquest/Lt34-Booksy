import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/bookDetailsCritic.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash as trashIcon } from '@fortawesome/free-solid-svg-icons';
import { faPen as penIcon } from '@fortawesome/free-solid-svg-icons'; // Para el lápiz
import { NavbarContenido } from "../component/navbarContenido.js";
import { Footer } from "../component/footer.js";



export const BookDetailsCritic = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [bookData, setBookData] = useState(null);
    const [infoLink, setInfoLink] = useState(""); 
    const [review, setReview] = useState("");
    const [reviews, setReviews] = useState(store.reviews);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [editedComment, setEditedComment] = useState("");
    const location = useLocation(); 
    const [users, setUsers] = useState([]);

    const fetchCritic = async () => {
        try {
            const response = await fetch(`${process.env.BACKEND_URL}/api/critico`);
            const data = await response.json();
            console.log(data);
    

            const extractedUsers = data.map(user => ({
                id: user.id,
                name: user.nombre
            }));
    
            console.log(extractedUsers); 
            setUsers(extractedUsers);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };
    
      
      useEffect(() => {
        fetchCritic();
      }, []);

      const getCriticName = (id) => {
        const critic = users.find(user => user.id === id);
        return critic ? critic.name : "Crítico desconocido";
    };

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

    if (!bookData) return <p>Cargando detalles del libro...</p>;

    return (
        <>
        <NavbarContenido />
        <div className="container page-container">
            <div className="row" style={{ width: '100%' }}>
                <div className="col-12 col-md-3">
                    <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5" style={{ paddingLeft: '12px', paddingTop: '12px', paddingBottom: "0px" }}>
                        <div className="collapse d-md-block" id="sidenavCollapse">
                            <div className="card-body">
                                <div className="row card-list list text-gray-700 mb-0">
                                    <nav className="nav flex-column" style={{ minHeight: "70" }}>
                                        <Link to="/listaLibrosCritico" className="nav-item nav-link">
                                            Lista de Libros
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
                                <div className="book-detail-container ms-2 text-start">
                                    <div className="book-detail-content">
                                        <img 
                                            src={bookData.cover} 
                                            alt={bookData.titulo} 
                                            className="img-fluid" 
                                        />
                                        <div>
                                            <h2>{bookData.titulo}</h2>
                                            <p><strong>Autor:</strong> {bookData.autor}</p>
                                            <p><strong>Cantidad de Páginas:</strong> {bookData.cantidad_paginas}</p>
                                            <p><strong>Género:</strong> {bookData.genero}</p>
                                            <p><strong>Año Publicado:</strong> {bookData.year}</p>
    
                                            {infoLink && (
                                                <button className="buttonBuy mb-4">
                                                    <svg viewBox="0 0 16 16" className="bi bi-cart-check" height="24" width="24" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                                                        <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"></path>
                                                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                                                    </svg>
                                                    {infoLink && (
                                                        <a href={infoLink} target="_blank" rel="noopener noreferrer" className="text">
                                                            Comprar
                                                        </a>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
    
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="review" className="form-label"><h5>Agregar una reseña</h5></label>
                                            <textarea
                                                id="review"
                                                className="form-control "
                                                value={review}
                                                onChange={(e) => setReview(e.target.value)}
                                                required
                                                style={{ maxWidth: "700px" }}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-success">Enviar Reseña</button>
                                    </form>
    
                                    <h5 className="mt-4">Reseñas</h5>
                                    <ul className="list-group " style={{ maxWidth: "700px" }}>
                                        {reviews.map((r) => {
                                            const criticName = users.find(user => user.id === r.id_critico)?.name || "Crítico desconocido";
    
                                            return (
                                                <li key={r.id} className="list-group-item">
                                                    <strong>{criticName}:</strong> {editingReviewId === r.id ? (
                                                        <form onSubmit={handleEditSubmit}  >
                                                            <textarea
                                                                value={editedComment}
                                                                onChange={(e) => setEditedComment(e.target.value)}
                                                                required
                                                                style={{ maxWidth: "700px", width: "600px" }}
                                                                
                                                            />
                                                            <button type="submit" className="btn btn-success btn-sm me-2" >Guardar</button>
                                                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingReviewId(null)}>Cancelar</button>
                                                        </form>
                                                    ) : (
                                                        <span>{r.comentario}</span>
                                                    )}
                                                    <div className="float-end">
                                                        {editingReviewId !== r.id && (
                                                            <>
                                                                <button className="btn btn-secondary btn-sm me-2" onClick={() => handleEditClick(r)}>
                                                                    <FontAwesomeIcon icon={penIcon} /> 
                                                                </button>
                                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteReview(r.id)}>
                                                                    <FontAwesomeIcon icon={trashIcon} /> 
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
    
                                    <Link to="/listaLibrosCritico">
                                        <span className="btn btn-primary btn mt-3" role="button">
                                            Volver a la lista
                                        </span>
                                    </Link>
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
