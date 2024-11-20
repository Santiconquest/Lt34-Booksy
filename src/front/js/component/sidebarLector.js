import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";

import "../../styles/readersListOfBooks.css";



export const SidebarLector = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState("genero");
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAuthor, setSearchAuthor] = useState(""); 
    const [searchGenero, setSearchGenero] = useState(""); 

    useEffect(() => {
        actions.getBooks();
    }, []);

    const filteredBooks = store.books.filter(book =>
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        book.autor.toLowerCase().includes(searchAuthor.toLowerCase()) && 
        book.genero.toLowerCase().includes(searchGenero.toLowerCase())
    );

    return (
        <>

        
       <div className="container page-container">
        <div className="row" style={{ width: '100%' }}>
            <div className="col-12 col-md-3" >
                <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">

                  
                  <h6 className="fw-bold text-uppercase mb-3">
                    Filtro
                  </h6>

                 
                  <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">
                    <Link
                        to="#"
                        className={`nav-link ${activeTab === "genero" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(activeTab === "genero" ? "" : "genero");
                        }}
                        >
                        Por Género
                        </Link>
                        <Link
                        to="#"
                        className={`nav-link ${activeTab === "autor" ? "active" : ""}`}
                        onClick={(e) => {
                            e.preventDefault();
                            setActiveTab(activeTab === "autor" ? "" : "autor");
                        }}
                        >
                        Por Autor
                        </Link>
                    </nav>
                </div>               
                    
                    


                  
                  <h6 className="fw-bold text-uppercase mb-4 mt-2">
                    Buscar Por
                  </h6>

                  
                  <ul className="card-list list text-gray-700 mb-0">
                    <li className="list-item">
                        <input
                        type="text"
                        className="form-control me-2 input mb-1"
                        placeholder="Título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ flex: 1 }} 
                    />
                    </li>
                    <li className="list-item">
                        <input
                        type="text"
                        className="form-control me-2 input mb-1"
                        placeholder="Autor..."
                        value={searchAuthor}
                        onChange={(e) => setSearchAuthor(e.target.value)}
                        style={{ flex: 1 }} 
                    />
                    </li>
                    <li className="list-item">
                        <input
                        type="text"
                        className="form-control input"
                        placeholder="Género..."
                        value={searchGenero}
                        onChange={(e) => setSearchGenero(e.target.value)}
                        style={{ flex: 1 }} 
                    />
                    </li>
                  </ul>

                </div>
              </div>

            </div>

            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">

                <h6 className="fw-bold text-uppercase mb-3 mt-4">
                     Mi Biblioteca
                </h6>

                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">            
                       
                        <Link to="/favoritosLector" className="nav-item nav-link">
                            Favoritos
                        </Link>
                        <Link to="/wishlistLector" className="nav-item nav-link">
                            Wishlist
                        </Link>
                    </nav>
                </div>
                </div>
              </div>

            </div>
            <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
              <div className="collapse d-md-block" id="sidenavCollapse">
                <div className="card-body">

                <h6 className="fw-bold text-uppercase mb-3 mt-4">
                    Herramientas Booksy
                </h6>

                <div className="row card-list list text-gray-700 mb-0">
                    <nav className="nav flex-column">
                        <Link to="/chat" className="nav-item nav-link">
                            ChatScribe
                        </Link>
                        <Link to="/visionAPI" className="nav-item nav-link">
                            ScanBook
                        </Link>
                        <Link to="/bookRecommendations" className="nav-item nav-link">
                            Sugerencias AI
                        </Link>
                    </nav>    
                </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        </div>

                </>
    );
};
