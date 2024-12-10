import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCamp, fetchCamps } from "../api";

// COMPONENT IMPORT
import Header from "../components/Header/Header";
import Heading from "../components/Heading/Heading";

import "../css/StartPage.css";

const StartPage = () => {
    const [existingCamps, setExistingCamps] = useState([]);
    const [showNewCampModal, setShowNewCampModal] = useState(false);
    const [newCampName, setNewCampName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleFetchCamps = async () => {
        try {
            const data = await fetchCamps();
            setExistingCamps(data);
            setShowModal(true);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCreateNewCamp = async () => {
        if (!newCampName) {
            alert("Zadejte název tábora!");
            return;
        }

        try {
            const result = await createCamp(newCampName);
            sessionStorage.setItem("camp_name", newCampName);
            navigate("/create-camp");
            setShowNewCampModal(false);
        } catch (error) {
            alert(error.message);
        }
    };

    const closeNewCampModal = () => {
        setShowNewCampModal(false);
        setNewCampName("");
    };

    return (
        <div className="start-page">
            <Header goBackLink="/" editLink1={"#"} editLink2={"#"} showIconsLeft={false} showIconsRight={false} />

            <Heading text="Vítejte v táborovém organizátoru bodů!" level={1} className="nadpish1" />

            <div className="background-wrapper">
                <p>Nejprve potřebujeme získat soubor s daty tábora:</p>
                <button className="linkbutton" onClick={() => setShowNewCampModal(true)}>
                    Vytvořit nový tábor
                </button>
                <button className="linkbutton" onClick={handleFetchCamps}>
                    Vybrat existující
                </button>
            </div>

            {/* Modal window for creating new camp */}
            {showNewCampModal && (
                <div className="modal">
                    <div className="modal-content">
                        <Heading text="Vytvořit nový tábor" level={3} className="nadpish1" />
                        <input
                            type="text"
                            placeholder="Zadejte název nového tábora"
                            value={newCampName}
                            onChange={(e) => setNewCampName(e.target.value)}
                            className="camp-name-input"
                        />
                        <div className="modal-buttons">
                            <button className="linkbuttonSmall" onClick={handleCreateNewCamp}>
                                Vytvořit
                            </button>
                            <button className="linkbuttonSmall" onClick={closeNewCampModal}>
                                Zrušit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal windows for existing camps*/}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Vyberte existující tábor</h3>
                        <ul>
                            {existingCamps.map((camp, index) => (
                                <li key={index} onClick={() => {
                                    sessionStorage.setItem("camp_name", camp.campName);
                                    navigate("/main-page");
                                }}>
                                    {camp.campName}
                                </li>
                            ))}
                        </ul>
                        <button className="linkbutton" onClick={() => setShowModal(false)}>
                            Zavřít
                        </button>
                    </div>
                </div>
            )}

            <img src="/wave.svg" alt="Wave" className="wave-svg" />
        </div>
    );
};

export default StartPage;
