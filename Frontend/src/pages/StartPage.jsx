import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// COMPONENT IMPORT
import Header from "../components/Header/Header"
import Heading from "../components/Heading/Heading"

import "../css/StartPage.css";

const StartPage = () => {
    const [existingCamps, setExistingCamps] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const fetchCamps = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/get-camps");
            const data = await response.json();
            setExistingCamps(data);
            setShowModal(true);
        } catch (error) {
            console.error("Error loading camp names:", error);
        }
    };

    const handleSelectCamp = (camp) => {
        setShowModal(false);
        sessionStorage.setItem('camp_name', camp.campName);
        navigate("/main-page");
    };

    return (
        <div className="start-page">
            <Header goBackLink="/" editLink1={"#"} editLink2={"#"} 
                showIconsLeft={false} showIconsRight={false}/>

            <Heading text="Vítejte v táborovém organizátoru bodů!" level={1} className="nadpish1" />
            
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
