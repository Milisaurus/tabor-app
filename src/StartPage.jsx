import React from "react";
import { Link } from "react-router-dom";

const StartPage = () => (
    <div>
        <h1>tabor.app</h1>
        <h3>Vítejte v táborovém organizátoru bodů!</h3>
        Nejprve potřebujeme získat soubor s daty: <br />
        <Link to="/create-camp">
            <button>Vytvoření tábora</button>
        </Link>

        <button>Vybrání existujícího tábora</button>
    </div>
);

export default StartPage;