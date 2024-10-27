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
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const handleAddBook = () => {
        actions.addBook({
            ...newBook,
            cantidad_paginas: Number(newBook.cantidad_paginas),
            year: Number(newBook.year),
        });
        navigate("/books");
    };

    const fetchBookDetails = async (title) => {
        try {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}&key=AIzaSyBwjy42UMUJBiaTBw-cLmkxixGvX0iyMD4`);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const books = data.items.map(item => item.volumeInfo);
                setSuggestions(books.slice(0, 5)); 
            } else {
                setSuggestions([]); 
            }
        } catch (error) {
            console.log("Error fetching book details", error);
        }
    };

    const handleSuggestionClick = (book) => {
        setNewBook({
            ...newBook,
            titulo: book.title,
            autor: book.authors ? book.authors.join(", ") : "",
            cantidad_paginas: book.pageCount || "",
            genero: book.categories ? book.categories.join(", ") : "",
            year: book.publishedDate ? book.publishedDate.split("-")[0] : "",
            cover: book.imageLinks ? book.imageLinks.thumbnail : "",
        });
        setSuggestions([]); 
    };

    return (
        <div className="container">
            <h1>Añadir Libro</h1>
            <form>
                <div className="mb-3 position-relative">
                    <label htmlFor="titulo" className="form-label">Buscar Libro</label>
                    <input
                        type="text"
                        id="titulo"
                        className="form-control"
                        value={newBook.titulo}
                        onChange={e => {
                            setNewBook({ ...newBook, titulo: e.target.value });
                            fetchBookDetails(e.target.value); 
                        }}
                    />
                    {suggestions.length > 0 && (
                        <ul className="list-group position-absolute" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                            {suggestions.map((book, index) => (
                                <li key={index} className="list-group-item" onClick={() => handleSuggestionClick(book)}>
                                    {book.title}
                                </li>
                            ))}
                        </ul>
                    )}
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
