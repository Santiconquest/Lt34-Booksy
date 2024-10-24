import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";


import { Context } from "../store/appContext";

export const ListaLibrosCritico = () => {
	const { store, actions } = useContext(Context);

	if (store.auth == true) {
		 return (
			<div>
				<Link to="/">
					<button className="btn btn-primary">Back home</button>
				</Link>
			</div>
		 )


	} else {
		return (
			<div className="container">
				
				<h1>Lista de Libros</h1>
				<br />
				<Link to="/">
					<button className="btn btn-primary">Back home</button>
				</Link>
			</div>
		);
		
	}

};
