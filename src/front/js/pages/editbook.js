import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useParams, useNavigate } from "react-router-dom";

const EditBook = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams(); 
    const [book, setBook] = useState({
        titulo: "",
        autor: "",
        cantidad_paginas: "",
        genero: "",
        year: "",
        cover: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        const currentBook = store.books.find(b => b.id === parseInt(id));
        if (currentBook) {
            setBook(currentBook);
        }
    }, [id, store.books]);

    const handleEditBook = () => {
        actions.updateBook(book.id, {
            ...book,
            cantidad_paginas: Number(book.cantidad_paginas),
            year: Number(book.year),
        });
        navigate("/books");
    };

    if (!book) return <div>Cargando...</div>; 

    return (
        <div className="container">
            <h1>Editar Libro</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="titulo" className="form-label">Título</label>
                    <input
                        type="text"
                        id="titulo"
                        className="form-control"
                        value={book.titulo}
                        onChange={e => setBook({ ...book, titulo: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="autor" className="form-label">Autor</label>
                    <input
                        type="text"
                        id="autor"
                        className="form-control"
                        value={book.autor}
                        onChange={e => setBook({ ...book, autor: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cantidad_paginas" className="form-label">Cantidad de Páginas</label>
                    <input
                        type="number"
                        id="cantidad_paginas"
                        className="form-control"
                        value={book.cantidad_paginas}
                        onChange={e => setBook({ ...book, cantidad_paginas: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="genero" className="form-label">Género</label>
                    <input
                        type="text"
                        id="genero"
                        className="form-control"
                        value={book.genero}
                        onChange={e => setBook({ ...book, genero: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="year" className="form-label">Año Publicado</label>
                    <input
                        type="number"
                        id="year"
                        className="form-control"
                        value={book.year}
                        onChange={e => setBook({ ...book, year: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cover" className="form-label">URL de la Imagen</label>
                    <input
                        type="text"
                        id="cover"
                        className="form-control"
                        value={book.cover}
                        onChange={e => setBook({ ...book, cover: e.target.value })}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={handleEditBook}>
                    Actualizar Libro
                </button>
            </form>
        </div>
    );
};

export default EditBook;
