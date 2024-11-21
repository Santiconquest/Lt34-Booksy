import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NavbarContenido } from "../component/navbarContenido.js";
import { Footer } from "../component/footer.js";


export const CriticReviews = () => {
    const { store, actions } = useContext(Context);
    const [reviews, setReviews] = useState([]);
    const [editingReviewId, setEditingReviewId] = useState(null); 
    const [editedComment, setEditedComment] = useState(""); 

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

    const handleDeleteReview = async (reviewId) => {
        const deleted = await actions.deleteReview(reviewId); 
        if (deleted) {
            setReviews(reviews.filter((r) => r.id !== reviewId));
        } else {
            console.error("Error al eliminar la reseña.");
        }
    };

    const handleEditClick = (review) => {
        setEditingReviewId(review.id); 
        setEditedComment(review.comentario); 
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const updatedReview = { comentario: editedComment };
    
        const edited = await actions.editReview(updatedReview, editingReviewId);
        if (edited) {
            setEditingReviewId(null); 
            setEditedComment(""); 
        } else {
            console.error("Error al editar la reseña.");
        }
    };
    
    return (
        <>
        <NavbarContenido/>
        <div className="container page-container">
        <div className="row" style={{ width: '100%' }}>
            <div className="col-12 col-md-3" >

            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">


                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column" style={{minHeight:"70"}}>            
                        <Link to="/listaLibrosCritico" className="nav-item nav-link">
                            Lista de Libros
                        </Link>
                    </nav>
                </div>
                </div>
              </div>

            </div>
          </div>



          <div className="col-12 col-md-9">
            <div className="card card-bleed shadow-light-lg mb-6 me-0 ms-3">
              <div className="card-body">
              <div className="">
                <div className="text mb-4">
                    <h5 className="recomm-title">Mis Reseñas</h5>
                </div>
                {editingReviewId ? ( 
                    <form onSubmit={handleEditSubmit} className="mb-4">
                        <div className="input-group">
                            <textarea
                                className="form-control"
                                value={editedComment}
                                onChange={(e) => setEditedComment(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn btn-success">Guardar</button>
                            <button type="button" className="btn btn-secondary" onClick={() => setEditingReviewId(null)}>Cancelar</button>
                        </div>
                    </form>
                ) : (
                    <ul className="list-group">
    {reviews.map((r) => (
        <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                <strong>{r.id_critico}:</strong> {r.comentario}
            </div>
            <div>
                <button 
                    className="btn btn-success btn-sm mr-2" 
                    onClick={() => handleEditClick(r)} 
                >
                    <FontAwesomeIcon icon={faPen} />
                </button>
                <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => handleDeleteReview(r.id)} 
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </div>
        </li>
    ))}
</ul>

                )}
                <Link to="/listaLibrosCritico">
                    <span className="btn btn-primary btn-lg my-5" role="button">
                        Back to list
                    </span>
                </Link>
            </div>
              </div>

              
              </div>
            </div>
          </div>
        </div>
            <Footer/>
        </>
    );
};

