import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCamp, fetchCamps } from "../api";

// COMPONENT IMPORT
import Header from "../components/Header/Header";
import Heading from "../components/Heading/Heading";

import "../css/StartPage.css";

const StartPage = () => {
    const [existingCamps, setExistingCamps] = useState([]); // List of existing camps
    const [showNewCampModal, setShowNewCampModal] = useState(false); // State to toggle the "Create new camp" modal
    const [newCampName, setNewCampName] = useState(""); // Store the new camp name
    const [showModal, setShowModal] = useState(false); // State to toggle the modal displaying existing camps
    const navigate = useNavigate();

    // Fetch existing camps from the API
    const handleFetchCamps = async () => {
        try {
            const data = await fetchCamps();
            setExistingCamps(data);
            setShowModal(true);
        } catch (error) {
            alert(error.message);
        }
    };

    // Create a new camp
    const handleCreateNewCamp = async () => {
        if (!newCampName) {
            alert("Zadejte název tábora!"); // Alert if camp name is empty
            return;
        }

        try {
            await createCamp(newCampName); // Call the API to create the new camp
            sessionStorage.setItem("camp_name", newCampName); // Store the camp name in session storage
            navigate("/create-camp");
            setShowNewCampModal(false);
        } 
        catch (error) {
            alert(error.message);
        }
    };

     // Close the "Create new camp" modal
    const closeNewCampModal = () => {
        setShowNewCampModal(false);
        setNewCampName("");
    };

    return (
        <div className="start-page">
            <Header goBackLink="/" showIconsLeft={false} showIconsRight={false} />
            <Heading text="Vítejte v táborovém organizátoru bodů!" level={1} className="nadpish1" />

            <div className="background-wrapper">
                <p>Nejprve potřebujeme získat soubor s daty tábora:</p>
                {/* Button to show modal for creating a new camp */}
                <button className="linkbutton" onClick={() => setShowNewCampModal(true)}>
                    Vytvořit nový tábor
                </button>
                {/* Button to fetch and select an existing camp */}
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
                            {/* List existing camps, click to select */}
                            {existingCamps.map((camp, index) => (
                                <li key={index} onClick={() => {
                                    // Store the selected camp name
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

        </div>
    );
};

export default StartPage;
