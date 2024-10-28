import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/home.css";

export const Books = () => {
    const { store, actions } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        actions.getBooks();
    }, []);

    const filteredBooks = store.books?.filter(book =>
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className="container">
                <h1 className="m-5">Books</h1>
                <Link to="/addbook" className="btn btn-primary mb-3">Añadir un nuevo libro</Link>
                
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Buscar por título"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <div className="row flex-row flex-nowrap" style={{ overflowX: "auto" }}>
                    {filteredBooks && filteredBooks.map((book, index) => (
                        <div key={index} className="col-md-4">
                            <div className="card" style={{ width: '18rem' }}>
                                <img
                                    src={book.cover}
                                    alt={book.titulo}
                                    className="card-img-top"
                                    style={{ width: '300px', height: '300px' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{book.titulo}</h5>
                                    <p className="card-text">
                                        <strong>Autor:</strong> {book.autor} <br />
                                        <strong>Cantidad de Páginas:</strong> {book.cantidad_paginas} <br />
                                        <strong>Género:</strong> {book.genero} <br />
                                        <strong>Año Publicado:</strong> {book.year}
                                    </p>
                                    <Link to={`/editbook/${book.id}`} className="btn btn-warning">Editar</Link>
                                    <button
                                        className="btn btn-danger ms-2"
                                        onClick={() => actions.deleteBook(book.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
