import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/favoritosLector.css"; // Asegúrate de tener un archivo CSS para estilos

export const FavoritosLector = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        // Puedes cargar datos aquí si es necesario
    }, []);

    return (
        <div className="container">
            <h1 className="mt-5">Favoritos del Lector</h1>
            {store.favorites.length === 0 ? (
                <p>No hay libros en tus favoritos.</p>
            ) : (
                <div className="row">
                    {store.favorites.map((favoriteId) => {
                        const favoriteBook = store.books.find(book => book.id === favoriteId);
                        return (
                            <div key={favoriteId} className="col-md-4 mb-4">
                                <div className="card">
                                    <img
                                        src={favoriteBook.cover}
                                        alt={favoriteBook.titulo}
                                        className="card-img-top"
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{favoriteBook.titulo}</h5>
                                        <p className="card-text">
                                            <strong>Autor:</strong> {favoriteBook.autor}
                                        </p>
                                        <Link to={`/bookdetails/${favoriteBook.id}`} className="btn btn-primary">Ver Detalles</Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};