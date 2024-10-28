import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const CriticReviews = () => {
    const { store, actions } = useContext(Context);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            await actions.getReviews();
        };
        fetchReviews();
    }, []);

    useEffect(() => {
       
        const filteredReviews = store.reviews.filter((r) => r.id_critico === store.userId);
        setReviews(filteredReviews);
    }, [store.reviews, store.userId]);

    return (
        <div className="container">
            <h2>Mis Reseñas</h2>
            <ul className="list-group">
                {reviews.map((r) => (
                    <li key={r.id} className="list-group-item">
                        <strong>{r.id_critico}:</strong> {r.comentario}
                    </li>
                ))}
            </ul>
        </div>
    );
};
