import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container d-flex justify-content-between">
                {/* Logo y pestaña Books */}
                <div className="d-flex align-items-center">
                    <Link to="/" className="navbar-brand">
                        <img
                            src="logo-url.png" // Reemplaza con la URL de tu logo
                            alt="Booksy Logo"
                            width="40"
                            height="40"
                            className="d-inline-block align-top"
                        />
                    </Link>
                    <Link to="/books" className="nav-link ml-2">
                        Books
                    </Link>
                </div>

                {/* Login y Sign Up */}
                <div className="d-flex align-items-center">
                    <Link to="/login">
                        <button className="btn btn-outline-primary mr-3">Login</button>
                    </Link>

                    <div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Signup
						</button>
						<ul className="dropdown-menu">
							<Link className="dropdown-item" to="/signup-reader">Como Lector</Link>
							<Link className="dropdown-item" to="/signup-critic">Como Crítico</Link>
						</ul>
					</div>
                </div>
            </div>
        </nav>
    );
};
