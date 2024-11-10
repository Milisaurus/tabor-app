import React from "react";
import { Link } from "react-router-dom";
import "./css/StartPage.css"; // assuming you're using a CSS file for styles

const StartPage = () => (
    <div className="start-page">
        <h1>tabor.app</h1>
        <hr />
        <h2>Vítejte v táborovém organizátoru bodů!</h2>
        
        {/* Wrapper for the background */}
        <div className="background-wrapper">
            <p>Nejprve potřebujeme získat soubor s daty tábora:</p>
            <Link to="/create-camp">
                <button className="linkbutton">Vytvořit nový</button>
            </Link>
            <button className="linkbutton">Vybrat existující</button>
        </div>
        <img src="/wave.svg" alt="Wave" className="wave-svg"/>
    </div>
);

export default StartPage;
