import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useParams } from "react-router-dom";
import "../../styles/home.css";

const AutorDetail = () => {
    const { store, actions } = useContext(Context);
    const {autorName}=useParams()
    useEffect(() => {
        actions.getAutorDetails(autorName);

    }, []);
    console.log(store.autorDetail)
    return (
        <div>
            <div className="container">
                <h1 className="m-5">Autor</h1>
                <div className="row g-3">
                    <div className="col-md-4">
                        <p><strong>Name:</strong>{store.autorDetail?.name}<br /></p>
                        <p><strong>Birth Date:</strong>{store.autorDetail?.birth_date} <br /></p>
                        <p><strong>Top subjects:</strong>{store.autorDetail?.top_subjects}<br /></p>
                        <p><strong>Death date:</strong>{store.autorDetail?.death_date}<br /></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutorDetail