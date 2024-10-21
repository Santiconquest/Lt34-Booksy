import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
    const { actions } = useContext(Context);
    const [newBook, setNewBook] = useState({
        titulo: "",
        autor: "",
        cantidad_paginas: "",
        genero: "",
        year: "",
        cover: ""
    });
    const navigate = useNavigate();

    const handleAddBook = () => {
        actions.addBook({
            ...newBook,
            cantidad_paginas: Number(newBook.cantidad_paginas),
            year: Number(newBook.year),
        });
        navigate("/books");
    };

    return (
        <div className="container">
            <h1>Añadir Libro</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                        type="text"
                        id="titulo"
                        className="form-control"
                        value={newBook.titulo}
                        onChange={e => setNewBook({ ...newBook, titulo: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="autor" className="form-label">Autor</label>
                    <input
                        type="text"
                        id="autor"
                        className="form-control"
                        value={newBook.autor}
                        onChange={e => setNewBook({ ...newBook, autor: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad_paginas" className="form-label">Cantidad de Páginas</label>
                    <input
                        type="number"
                        id="cantidad_paginas"
                        className="form-control"
                        value={newBook.cantidad_paginas}
                        onChange={e => setNewBook({ ...newBook, cantidad_paginas: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="genero" className="form-label">Género</label>
                    <input
                        type="text"
                        id="genero"
                        className="form-control"
                        value={newBook.genero}
                        onChange={e => setNewBook({ ...newBook, genero: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Año Publicado</label>
                    <input
                        type="number"
                        id="year"
                        className="form-control"
                        value={newBook.year}
                        onChange={e => setNewBook({ ...newBook, year: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cover" className="form-label">URL de la Imagen</label>
                    <input
                        type="text"
                        id="cover"
                        className="form-control"
                        value={newBook.cover}
                        onChange={e => setNewBook({ ...newBook, cover: e.target.value })}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleAddBook}>
                    Añadir Libro
                </button>
            </form>
        </div>
    );
};

export default AddBook;
