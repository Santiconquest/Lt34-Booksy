
import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
    const navigate = useNavigate()
	const { store, actions } = useContext(Context);
	function handleLogoutCritico(){
		actions.logoutCritico()
		navigate("/loginCritico")
	}
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container d-flex justify-content-between">
                <div className="d-flex align-items-center">
                    <Link to="/" className="navbar-brand">
                        <img
                            src="logo-url.png" 
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

                <div className="d-flex align-items-center">
                    {store.auth ? (
                        <>
                            <button onClick={handleLogoutCritico} className="btn btn-primary">Logout</button>
                            <Link to="/verReviewCritico">
                            <button className="btn btn-primary">My Reviews</button> 
                            </Link>
                        </>
                    ) : (
                        <Link to="/login">
                            <div className="dropdown">
						<button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Login
						</button>
						<ul className="dropdown-menu">
							<Link className="dropdown-item" to="/loginLector">Como Lector</Link>
							<Link className="dropdown-item" to="/loginCritico">Como Crítico</Link>
						</ul>
					</div>
                        </Link>
                    )}

                    <div className="dropdown">
						<button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Signup
						</button>
						<ul className="dropdown-menu">
							<Link className="dropdown-item" to="/signupLector">Como Lector</Link>
							<Link className="dropdown-item" to="/signupCritico">Como Crítico</Link>
						</ul>
					</div>
                </div>
            </div>
        </nav>
    );
};