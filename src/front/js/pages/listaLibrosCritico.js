import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/listalibroscritico.css";

export const ListaLibrosCritico = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState("genero");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAuthor, setSearchAuthor] = useState("");
    const [searchGenero, setSearchGenero] = useState("");

    useEffect(() => {
        actions.getBooks();
    }, []);

    if (!store.auth) {
        return (
            <div>
                <Link to="/">
                    <button className="btn btn-primary">Back home</button>
                </Link>
            </div>
        );
    }

    const filteredBooks = store.books.filter(book =>
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        book.autor.toLowerCase().includes(searchAuthor.toLowerCase()) &&
        book.genero.toLowerCase().includes(searchGenero.toLowerCase())
    );

    const groupBooks = (key) => {
        return filteredBooks.reduce((acc, book) => {
            const groupKey = book[key];
            if (!acc[groupKey]) {
                acc[groupKey] = [];
            }
            acc[groupKey].push(book);
            return acc;
        }, {});
    };

    const booksByGenero = groupBooks("genero");
    const booksByAutor = groupBooks("autor");

    const truncateText = (text, maxWords) => {
        const words = text.split(' ');
        if (words.length <= maxWords) return text;
        return words.slice(0, maxWords).join(' ') + '...';
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-3">
                    <div className="card card-bleed border-bottom shadow-light-lg ms-3">
                        <div className="card-body">
                            <h6 className="fw-bold text-uppercase mb-3">Filtro</h6>
                            <ul className="list text-gray-700 mb-6 card-list">
                                <li>
                                    <input
                                        type="checkbox"
                                        checked={activeTab === "genero"}
                                        onChange={() => setActiveTab("genero")}
                                    />{" "}
                                    Por Género
                                </li>
                                <li>
                                    <input
                                        type="checkbox"
                                        checked={activeTab === "autor"}
                                        onChange={() => setActiveTab("autor")}
                                    />{" "}
                                    Por Autor
                                </li>
                            </ul>

                            <h6 className="fw-bold text-uppercase mb-3">Buscar Por</h6>
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Título..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Autor..."
                                value={searchAuthor}
                                onChange={(e) => setSearchAuthor(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Género..."
                                value={searchGenero}
                                onChange={(e) => setSearchGenero(e.target.value)}
                            />

                            <h6 className="fw-bold text-uppercase mb-3 mt-3">Herramientas Inteligentes</h6>
                            <div className="d-flex justify-content-between">
                                <Link to="/chat" className="btn btn-warning">Chat Booksy</Link>
                                <Link to="/visionAPI" className="btn btn-warning">Escanear Libro</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-9">
  <div className="card card-bleed shadow-light-lg mb-6">
    <div className="card-body">
      <div className="row">
        {activeTab === "genero" &&
          Object.keys(booksByGenero).map((genero, index) => (
            <div key={index} className="col-md-6 mb-4">
              <h2>{genero}</h2>
              <div className="row flex-nowrap" style={{ overflowX: "auto" }}>
                {booksByGenero[genero].map((book, idx) => (
                  <div key={idx} className="card me-3" style={{ width: "18rem" }}>
                    <Link to={`/books/${book.id}`}>
                      <img
                        src={book.cover}
                        alt={book.titulo}
                        className="card-img-top"
                        style={{ height: "200px", objectFit: "contain" }}
                      />
                    </Link>
                    <div className="card-body">
                      <h5>{truncateText(book.titulo, 5)}</h5>
                      <p>
                        <strong>Autor:</strong> {truncateText(book.autor, 4)}<br />
                        <strong>Páginas:</strong> {book.cantidad_paginas}<br />
                        <strong>Año:</strong> {book.year}
                      </p>
                      <div className="d-flex justify-content-center">
                      <Link to={`/books/${book.id}`}>
                      <button className="readmore-btn">
                        <span className="book-wrapper">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="rgb(86, 69, 117)"
                            viewBox="0 0 126 75"
                            className="book"
                          >
                            <rect
                              strokeWidth="3"
                              stroke="#fff"
                              rx="7.5"
                              height="70"
                              width="121"
                              y="2.5"
                              x="2.5"
                            ></rect>
                            <line strokeWidth="3" stroke="#fff" y2="75" x2="63.5" x1="63.5"></line>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M25 20H50"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M101 20H76"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M16 30L50 30"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M110 30L76 30"
                            ></path>
                          </svg>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 65 75"
                            className="book-page"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M40 20H15"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M49 30L15 30"
                            ></path>
                            <path
                              strokeWidth="3"
                              stroke="#fff"
                              d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"
                            ></path>
                          </svg>
                        </span>
                        <span className="text">Leer Mas</span>
                      </button>
                      </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {activeTab === "autor" &&
          Object.keys(booksByAutor).map((autor, index) => (
            <div key={index} className="col-md-6 mb-4">
              <h2>{autor}</h2>
              <div className="row flex-nowrap" style={{ overflowX: "auto" }}>
                {booksByAutor[autor].map((book, idx) => (
                  <div key={idx} className="card me-3" style={{ width: "18rem" }}>
                    <img
                      src={book.cover}
                      alt={book.titulo}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "contain" }}
                    />
                    <div className="card-body">
                      <h5>{truncateText(book.titulo, 5)}</h5>
                      <p>
                        <strong>Género:</strong> {book.genero}<br />
                        <strong>Páginas:</strong> {book.cantidad_paginas}<br />
                        <strong>Año:</strong> {book.year}
                      </p>
                      <div className="d-flex justify-content-center">
                      <Link to={`/books/${book.id}`}>
                      <button className="readmore-btn">
                        <span className="book-wrapper">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="rgb(86, 69, 117)"
                            viewBox="0 0 126 75"
                            className="book"
                          >
                            <rect
                              strokeWidth="3"
                              stroke="#fff"
                              rx="7.5"
                              height="70"
                              width="121"
                              y="2.5"
                              x="2.5"
                            ></rect>
                            <line strokeWidth="3" stroke="#fff" y2="75" x2="63.5" x1="63.5"></line>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M25 20H50"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M101 20H76"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M16 30L50 30"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M110 30L76 30"
                            ></path>
                          </svg>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 65 75"
                            className="book-page"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M40 20H15"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeWidth="4"
                              stroke="#fff"
                              d="M49 30L15 30"
                            ></path>
                            <path
                              strokeWidth="3"
                              stroke="#fff"
                              d="M2.5 2.5H55C59.1421 2.5 62.5 5.85786 62.5 10V65C62.5 69.1421 59.1421 72.5 55 72.5H2.5V2.5Z"
                            ></path>
                          </svg>
                        </span>
                        <span className="text">Leer Mas</span>
                      </button>
                      </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
</div>

            </div>

            <Link to="/">
                <button className="btn btn-primary my-5">Back home</button>
            </Link>
        </div>
    );
};
