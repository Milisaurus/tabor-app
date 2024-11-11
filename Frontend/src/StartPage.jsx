import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/StartPage.css";

const StartPage = () => {
    const [existingCamps, setExistingCamps] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchCamps = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/get-camps");
            const data = await response.json();
            setExistingCamps(data);
            setShowModal(true); // Show modal after fetching camps
        } catch (error) {
            console.error("Chyba při načítání táborů:", error);
        }
    };

    const handleSelectCamp = (camp) => {
        // Close modal and navigate to MainPage with the selected camp
        setShowModal(false);
        navigate("/main-page", { state: { camp } });
    };

    return (
        <div className="start-page">
            <h1>tabor.app</h1>
            <hr />
            <h2>Vítejte v táborovém organizátoru bodů!</h2>
            
            <div className="background-wrapper">
                <p>Nejprve potřebujeme získat soubor s daty tábora:</p>
                <Link to="/create-camp">
                    <button className="linkbutton">Vytvořit nový</button>
                </Link>
                <button className="linkbutton" onClick={fetchCamps}>Vybrat existující</button>
            </div>

            {/* Modal for selecting a camp */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Vyberte existující tábor</h3>
                        <ul>
                            {existingCamps.map((camp, index) => (
                                <li key={index} onClick={() => handleSelectCamp(camp)}>
                                    {camp.campName}
                                </li>
                            ))}
                        </ul>
                        <button className="linkbutton" onClick={() => setShowModal(false)}>Zavřít</button>
                    </div>
                </div>
            )}
            <img src="/wave.svg" alt="Wave" className="wave-svg"/>
        </div>
    );
};

export default StartPage;
