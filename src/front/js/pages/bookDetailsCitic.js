import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const BookDetailsCritic = () => {
    const { store, actions } = useContext(Context);
    const params = useParams();
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
        const fetchBookData = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/book/${params.book_id}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setBookData(data.book); // Asumiendo que la respuesta contiene un objeto `book`
            } catch (error) {
                console.error("Error fetching book data:", error);
            }
        };

        fetchBookData();
    }, [params.book_id]);

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
            <Link to="/listaLibrosCritico">
                <span className="btn btn-primary btn-lg" role="button">
                    Back to List
                </span>
            </Link>
        </div>
    );
};

