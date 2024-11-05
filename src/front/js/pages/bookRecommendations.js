import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";

const BookRecommendations = () => {
    const { store, actions } = useContext(Context);

    const handleGetRecommendations = () => {
        actions.getRecommendations();
    };

    // Llama a la función para obtener recomendaciones cuando el componente se monta
    useEffect(() => {
        handleGetRecommendations();
    }, []); // La función se ejecuta solo una vez al montar el componente

    return (
        <div className="d-flex flex-column justify-content-start align-items-center vh-100 bg-light">
            <div className="text-center" style={{ maxWidth: '800px', margin: '20px auto' }}>
                <h1 className="display-4 mb-3 text-primary">Recomendación de Booksy</h1>
                <button 
                    className="btn btn-primary btn-lg shadow-lg mb-3" 
                    onClick={handleGetRecommendations}
                >
                    Obtener Recomendaciones
                </button>
                <div className="mt-3" style={{ minHeight: '100px' }}>
                    {store.recommendations.length > 0 ? (
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            <p className="text-dark">{store.recommendations[0]}</p>
                        </div>
                    ) : (
                        <div class="spinner-grow text-primary"  role="status">
                            <div class="spinner-border float-end" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookRecommendations;
