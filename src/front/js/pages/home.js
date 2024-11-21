import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import booksyImage from "../../img/booksy.jpg"; // Importa la imagen
import "../../styles/home.css";

import connecImage from "../../img/homeImage/connectPeople.png";
import buscarImage from "../../img/homeImage/buscar.jpg";
import likeImage from "../../img/homeImage/likeList.png";
import reviewImage from "../../img/homeImage/reviews.jpg";
import IAImage from "../../img/homeImage/IA.png";
import chatImage from "../../img/homeImage/chat.png";
import scanImage from "../../img/homeImage/scam.png";
import criticImage from "../../img/homeImage/critic.jpg";
import profeImage from "../../img/homeImage/profecional.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar.js";
import { Footer } from "../component/footer.js";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [imageMove, setImageMove] = useState(false); 

  const handleImageClick = () => {
    setImageMove(!imageMove); 
  };

  return (
    <>
    <Navbar/>
      <div className="header-home d-flex justify-content-between align-items-center" style={{ height: "600px" }}>
        <div className="text-container m-5">
            <h1 style={{ color: 'gray' }}>Welcome to <strong>Booksy</strong></h1>
            <h3>"Encuentra, conecta, y descubre. Todo sobre libros en un solo lugar."</h3>
            <div className="d-flex my-5 justify-content-center" style={{ width: "100%" }}>
              <div className="dropdown me-4">
                  <button
                      style={{ backgroundColor: "rgb(54 97 255)", color: "white", border: "none", padding: "12px 24px", fontSize: "18px" }}
                      className="btn btn-lg dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                  >
                      Login
                  </button>
                  <ul className="dropdown-menu">
                      <li>
                          <Link className="dropdown-item" to="/loginLector">
                              Como Lector
                          </Link>
                      </li>
                      <li>
                          <Link className="dropdown-item" to="/loginCritico">
                              Como Crítico
                          </Link>
                      </li>
                      <li>
                          <Link className="dropdown-item" to="/loginAdmin">
                              Como Administrador
                          </Link>
                      </li>
                  </ul>
              </div>

              <div className="dropdown">
                  <button
                      style={{ backgroundColor: "rgb(54 97 255)", color: "white", border: "none", padding: "12px 24px", fontSize: "18px" }}
                      className="btn btn-lg dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                  >
                      Signup
                  </button>
                  <ul className="dropdown-menu">
                      <li>
                          <Link className="dropdown-item" to="/signupLector">
                              Como Lector
                          </Link>
                      </li>
                      <li>
                          <Link className="dropdown-item" to="/signupCritico">
                              Como Crítico
                          </Link>
                      </li>
                  </ul>
              </div>
          </div>

  
        </div>
        <div className="image-container" onClick={handleImageClick} style={{ cursor: "pointer" }}>
          <img 
            src={connecImage} 
            alt="Conectar personas" 
            style={{ 
              width: "700px", 
              height: "auto", 
              transition: "transform 0.3s ease", 
              transform: imageMove ? "translateX(20px)" : "translateX(0)" 
            }} 
          />
        </div>
      </div>

      <div className="container-fluid text-center " style={{ paddingLeft: "0", paddingRight: "0" }}>
        {/* Fila 1: Primeros dos cuadros */}
        <div className="row mb-4" style={{ width: "100%", marginLeft: "0", marginRight: "0", marginTop: "10px",
          backgroundColor: "white", 
          borderTop: "1px solid gray", 
          borderBottom: "1px solid gray",
          overflow: "hidden",
         }}>
          <div className="col-md-6 d-flex justify-content-center">
            <div 
              className="card d-flex flex-row align-items-center" 
              style={{
                width: "80%",
                borderTop: "1px solid gray", 
                borderBottom: "1px solid gray", 
                borderRadius: "15px", 
                overflow: "hidden", 
                marginTop: "30px"
              }}
            >
              <img 
                src={buscarImage} 
                className="card-img-left" 
                alt="Búsqueda de libros" 
                style={{ width: "50%" }} 
              />
              <div 
                className="card-body d-flex align-items-center justify-content-center" 
                style={{ width: "50%" }}
              >
                <div>
                  <h5 className="card-title">Búsqueda de Libros</h5>
                  <p className="card-text">
                    Encuentra tus libros favoritos por título, autor o género.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-center">
            <div 
              className="card d-flex flex-row align-items-center" 
              style={{
                width: "80%",
                borderTop: "1px solid gray", 
                borderBottom: "1px solid gray", 
                borderRadius: "15px", 
                overflow: "hidden", 
                marginTop: "30px"
              }}
            >
              <img 
                src={likeImage} 
                className="card-img-left" 
                alt="Favoritos y Wishlist" 
                style={{ width: "50%" }} 
              />
              <div 
                className="card-body d-flex align-items-center justify-content-center" 
                style={{ width: "50%" }}
              >
                <div>
                  <h5 className="card-title">Favoritos y Wishlist</h5>
                  <p className="card-text">
                    Guarda tus libros favoritos y crea una lista de deseos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Fila 2: Últimos dos cuadros */}
        <div className="row mb-4" style={{ width: "100%", marginLeft: "0", marginRight: "0" }}>
          <div className="col-md-12 d-flex justify-content-center">
            <div className="card d-flex flex-row align-items-center" style={{ width: "80%" }}>
              <img src={reviewImage} className="card-img-left" alt="Reseñas de críticos" style={{ width: "50%" }} />
              <div className="card-body d-flex align-items-center justify-content-center" style={{ width: "50%" }}>
                <div>
                  <h5 className="card-title">Reseñas de Críticos Profesionales</h5>
                  <p className="card-text">
                    Lee reseñas detalladas y opiniones de críticos expertos sobre los libros más populares.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 d-flex justify-content-center">
            <div className="card d-flex flex-row-reverse align-items-center" style={{ width: "80%", height: "350px" }}>
              <img src={chatImage} className="card-img-left" alt="Chat entre usuarios" style={{ width: "40%" }} />
              <div className="card-body d-flex align-items-center justify-content-center" style={{ width: "50%" }}>
                <div>
                  <h5 className="card-title">Chat entre Usuarios</h5>
                  <p className="card-text">
                    Conéctate y comparte opiniones con otros lectores en nuestra comunidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fila 3: Nuevos cuadros */}
        <div className="container-fluid text-center mt-5 section-blue" style={{
          width: "100%",
          marginLeft: "0",
          marginRight: "0", 
          paddingBottom: "50px" 
        }}>
          <div className="col-md-12 d-flex justify-content-center mb-4">
            <div className="card d-flex flex-row align-items-center" style={{ width: "80%" }}>
              <img src={IAImage} className="card-img-left" alt="Interacción con IA" style={{ width: "50%" }} />
              <div className="card-body d-flex align-items-center justify-content-center" style={{ width: "50%" }}>
                <div>
                  <h5 className="card-title">Interactúa con IA sobre Libros</h5>
                  <p className="card-text">
                    Consulta recomendaciones y aprende más sobre tus libros favoritos con la ayuda de nuestra IA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fila 4: Tres cuadros con bordes redondeados */}
          <div className="row text-center mt-2" style={{ width: "100%" }}>
            <div className="col-md-4 d-flex justify-content-center mb-2"> 
              <div className="card d-flex flex-row align-items-center" style={{ width: "90%", borderRadius: "15px", overflow: "hidden", height: "270px" }}>
                <img src={scanImage} className="card-img-left" alt="Escaneo de libros" style={{ width: "50%", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }} />
                <div className="card-body d-flex align-items-center justify-content-center" style={{ width: "50%", borderTopRightRadius: "15px", borderBottomRightRadius: "15px" }}>
                  <div>
                    <h5 className="card-title">Escanea Parte de tu Libro</h5>
                    <p className="card-text">
                      Escanea un fragmento de texto y encuentra el libro al instante en nuestra base de datos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 d-flex justify-content-center mb-2"> 
              <div className="card d-flex flex-row align-items-center" style={{ width: "90%", borderRadius: "15px", overflow: "hidden" }}>
                <img src={profeImage} className="card-img-left" alt="Cuenta exclusiva para críticos" style={{ width: "50%", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }} />
                <div className="card-body d-flex align-items-center justify-content-center" style={{ width: "50%", borderTopRightRadius: "15px", borderBottomRightRadius: "15px" }}>
                  <div>
                    <h5 className="card-title">Cuenta Exclusiva para Críticos</h5>
                    <p className="card-text">
                      ¿Eres un crítico profesional? Crea una cuenta especial que te permita acceder a herramientas avanzadas para críticos.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 d-flex justify-content-center mb-2"> 
              <div className="card d-flex flex-row align-items-center" style={{ width: "90%", borderRadius: "15px", overflow: "hidden", height: "270px" }}>
                <img src={criticImage} className="card-img-left" alt="Reseñas de libros" style={{ width: "50%", borderTopLeftRadius: "15px", borderBottomLeftRadius: "15px" }} />
                <div className="card-body d-flex align-items-center justify-content-center" style={{ width: "50%", borderTopRightRadius: "15px", borderBottomRightRadius: "15px" }}>
                  <div>
                    <h5 className="card-title">Haz Reseñas de Libros</h5>
                    <p className="card-text">
                      Como crítico, tienes la oportunidad de escribir reseñas detalladas sobre los libros que lees y compartir tu perspectiva.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


      <div className="contact-section text-center py-5">
        <h2>Contáctanos</h2>
        <p>¿Tienes preguntas o necesitas ayuda? Estamos aquí para ayudarte.</p>

        <div className="contact-info mt-4">
          <p><strong>Correo:</strong> soporte@booksy.com</p>
          <p><strong>Teléfono:</strong> +123 456 7890</p>
        </div>

        <div className="social-icons mt-3">
          <a href="https://facebook.com/booksy" target="_blank">Facebook</a> | 
          <a href="https://twitter.com/booksy" target="_blank">Twitter</a> | 
          <a href="https://instagram.com/booksy" target="_blank">Instagram</a>
        </div>
      </div>
    </>
  );
};



