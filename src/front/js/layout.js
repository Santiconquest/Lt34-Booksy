import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Books } from "./pages/books";
import AddBook from "./pages/addbook"; 
import EditBook from "./pages/editbook";
import injectContext from "./store/appContext";
import SignupCritico from "./pages/signupCritico";
import SignupLector from "./pages/signupLector";
import Lector from "./pages/lector";
import LoginCritico from "./pages/loginCritico";
import Categoria from "./pages/categoria";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    // Verificación del URL de backend
    if(!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<SignupCritico />} path="/signupCritico" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<LoginCritico />} path="/loginCritico" />
                        <Route element={<Books />} path="/books" /> 
                        <Route element={<AddBook />} path="/addbook" /> 
                        <Route element={<EditBook />} path="/editbook/:id" /> 
                        <Route element={<SignupLector />} path="/signupLector" /> 
                        <Route element={<Categoria />} path="/categoria" /> 
                        <Route element={<Lector />} path="/lector/:idLectorToEdit" />
                        <Route element={<h1>Not found!</h1>} path="*" /> 
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
