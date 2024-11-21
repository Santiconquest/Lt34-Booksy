import React, { useEffect } from "react";
import Typed from "typed.js";
import equipmente from "../../img/homeImage/equipment.jpg";
import {Navbar} from "./navbar.js"

const EquipmentPage = () => {
  useEffect(() => {
    const typed = new Typed('.element', {
      strings: ["Jose Eduardo Jaramillo.", "Santiago Barreiro.", "Ana Raquel Perez."],
      typeSpeed: 25,  // Ajusta la velocidad de tipeo
      backSpeed: 15,  // Ajusta la velocidad de borrado
      backDelay: 2500, // Tiempo de espera antes de borrar el texto
      startDelay: 500, // Tiempo de espera antes de que comience
      loop: true,  // Esto hace que el ciclo de escritura se repita
      showCursor: true,  // Opcional: para mostrar el cursor titilante
    });

    return () => {
      typed.destroy();  
    };
  }, []); 

  return (
    <>
    <Navbar />
      <div
        className="container d-flex flex-column justify-content-center align-items-center"
        style={{ height: "50vh", background: "withe" }}
      >
       <h1 style={{ color: 'black', fontFamily: 'Roboto', fontSize: '5rem' }}>Team</h1>
       <p className="text-center" style={{ fontStyle: 'italic', color: '#555', fontFamily: 'Roboto', fontSize: '1.25rem', width: '50%', margin: '20px auto' }}>
        Te invitamos a conocer al equipo que ha dado vida a Booksy, los cuales han hecho posible esta plataforma para los amantes de los libros.
      </p>


      </div>

      <div className="container d-flex justify-content-center align-items-center" style={{ width: "100%", backgroundColor: "white" }}>
        <div className="row w-100 align-items-center" style={{ display: 'flex', flexDirection: 'row' }}>
          {/* Contenedor para la imagen */}
          <div className="col-md-6 d-flex justify-content-center" style={{ width: "50%" }}>
            <img
              src={equipmente}
              className="card-img-left rounded"
              alt="Equipo Booksy"
              style={{ width: "100%", borderRadius: "150px" }} 
            />
          </div>
          
          {/* Contenedor para el texto */}
          <div className="col-md-6 d-flex flex-column justify-content-center">
            <h3 style={{ color: '#423c3c', fontFamily: 'Merriweather', fontSize: '3rem' }}>Team Booksy:</h3>
            <span className="element m-5" style={{ width: "100%", color: 'rgb(58 100 123)', fontFamily: 'Merriweather', fontSize: '2rem' }}></span>
          </div>
        </div>
      </div>


    </>
  );
};

export default EquipmentPage;


