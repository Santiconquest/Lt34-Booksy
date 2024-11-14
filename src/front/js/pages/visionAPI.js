import React, { useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import "../../styles/readersListOfBooks.css";

const VisionAPI = () => {
  const [image, setImage] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation(); 

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) return;

    const apiKey = 'AIzaSyBwjy42UMUJBiaTBw-cLmkxixGvX0iyMD4'; 
    const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const body = {
      requests: [
        {
          image: {
            content: image.split(',')[1], 
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(visionUrl, body);
      const detectedText = response.data.responses[0].fullTextAnnotation?.text;

      // Registro en la consola del texto detectado
      console.log('Texto Detectado:', detectedText || 'No se detectó texto');

      // Realizar búsqueda en Google
      if (detectedText) {
        await fetchSearchResults(detectedText);
      }
    } catch (error) {
      console.error('Error al llamar a Google Vision API:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data) {
        console.error('Detalles del error:', error.response.data);
      }
    }
  };

  const fetchSearchResults = async (query) => {
    const apiKey = 'AIzaSyBwjy42UMUJBiaTBw-cLmkxixGvX0iyMD4'; 
    const cx = '00c8f40cacd4e44a4'; 
    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(searchUrl);
      setSearchResults(response.data.items || []);
    } catch (error) {
      console.error('Error al llamar a la API de búsqueda personalizada de Google:', error);
    }
  };

  return (
    <>
      <div className="container page-container">
          <div className="row" style={{ width: '100%' }}>
              <div className="col-12 col-md-3" >

              <div className="card mb-3 card-bleed border-bottom border-bottom-md-0 shadow-light-lg me-5">
                <div className="collapse d-md-block" id="sidenavCollapse">
                  <div className="card-body">

                  <h6 className="fw-bold text-uppercase mb-3 mt-2">
                      Mi Biblioteca
                  </h6>

                  <div className="row card-list list text-gray-700 mb-0">
                      <nav className="nav flex-column">            
                          <Link to="/readersListOfBooks" className="nav-item nav-link">
                              Lista de Libros
                          </Link>
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

                  <h6 className="fw-bold text-uppercase mb-3 mt-2">
                      Herramientas Booksy
                  </h6>

                  <div className="row card-list list text-gray-700 mb-0">
                      <nav className="nav flex-column">
                          <Link to="/chat" className="nav-item nav-link">
                              ChatScribe
                          </Link>
                          <Link to="/visionAPI" className={`nav-item nav-link ${location.pathname === "/visionAPI" ? "active" : ""}`}>
                              ScanBook
                          </Link>
                          <Link 
                              to="/bookRecommendations" 
                              className={`nav-item nav-link ${location.pathname === "/bookRecommendations" ? "active" : ""}`} 
                          >
                              Sugerencias AI
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
                <div className="row">


                  <h1 className="text-center">ScanBook</h1>
                  <p className="text-center">
                  Sube una foto del libro de tu interés nosotros hacemos el resto =)
                  </p>
                  <form onSubmit={handleSubmit} className="text-center mb-4">
                    <div className="form-group">
                      <label className="btn btn-outline-primary">
                        Subir Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="d-none" 
                        />
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Enviar</button>
                  </form>
                  {searchResults.length > 0 && (
                    <div>
                      <h2 className="mb-4">Resultados de Búsqueda:</h2>
                      <ul className="list-group">
                        {searchResults.map((result) => (
                          <li className="list-group-item" key={result.link} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px' }}>
                            <a href={result.link} target="_blank" rel="noopener noreferrer" className="font-weight-bold text-dark">
                              {result.title}
                            </a>
                            <p className="mb-0 text-muted">{result.snippet}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                </div>


                </div>
              </div>
            </div>
      </div>

      
    </>
  );
};

export default VisionAPI;
