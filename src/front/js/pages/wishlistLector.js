import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import "../../styles/wishlistLector.css"; 

export const WishlistLector = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
       
    }, []);

    return (
        <div className="container">
            <h1 className="mt-5">Lista de Deseos del Lector</h1>
            {store.wishlist.length === 0 ? (
                <p>No hay libros en tu lista de deseos.</p>
            ) : (
                <div className="row">
                    {store.wishlist.map((wishlistId) => {
                        const wishlistBook = store.books.find(book => book.id === wishlistId);
                        return (
                            <div key={wishlistId} className="col-md-4 mb-4">
                                <div className="card">
                                    <img
                                        src={wishlistBook.cover}
                                        alt={wishlistBook.titulo}
                                        className="card-img-top"
                                        style={{ height: '300px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{wishlistBook.titulo}</h5>
                                        <p className="card-text">
                                            <strong>Autor:</strong> {wishlistBook.autor}
                                        </p>
                                        <Link to={`/bookdetails/${wishlistBook.id}`} className="btn btn-primary">Ver Detalles</Link>
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
