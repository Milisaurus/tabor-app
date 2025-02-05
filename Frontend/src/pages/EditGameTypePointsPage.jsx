import React, { useState, useEffect } from "react";
import { getCamp, updateCamp } from "../api";
import { useNavigate } from "react-router-dom";

import Loading from "../components/Loading/Loading";
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Header from "../components/Header/Header";

import "../css/EditGameTypePointsPage.css";

const EditGameTypePointsPage = () => {
    const [loading, setLoading] = useState(true);
    const [campData, setCampData] = useState(null);
    const [originalCampData, setOriginalCampData] = useState(null); 
    const [error, setError] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newGameTypeName, setNewGameTypeName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const campData = await getCamp();
                if (campData) {
                    setCampData(campData);
                    setOriginalCampData(JSON.stringify(campData)); 
                } else {
                    setError("Camp data not found.");
                }
            } catch (err) {
                setError("Error loading camp data: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (!sessionStorage.getItem("camp_name")) {
            navigate("/");
        }
        fetchCampData();
    }, [navigate]);

    const handleDoubleClick = (index, currentName) => {
        setEditingIndex(index);
        setNewGameTypeName(currentName);
    };

    const handleNameChange = (event) => {
        setNewGameTypeName(event.target.value);
    };

    const handleNameBlur = (gameTypeIndex) => {
        if (newGameTypeName.trim() === "") {
            setEditingIndex(null);
            return;
        }

        const updatedCampData = { ...campData };
        updatedCampData.gameTypes[gameTypeIndex].type = newGameTypeName;
        setCampData(updatedCampData);
        setEditingIndex(null);
    };


    const handlePointChange = (gameTypeIndex, pointIndex, newValue) => {
        const updatedCampData = { ...campData };
        updatedCampData.gameTypes[gameTypeIndex].point_scheme[pointIndex] = Number(newValue);
        setCampData(updatedCampData);
    };

    const addNewGameType = () => {
        if (!campData) return;
        
        const newGameType = {
            type: "Nový typ hry",
            point_scheme: new Array(campData.teamCount).fill(1), // Naplní pole jedničkami dle počtu týmů
        };

        setCampData({
            ...campData,
            gameTypes: [...campData.gameTypes, newGameType],
        });
    };

    const saveChanges = async () => {
        if (JSON.stringify(campData) === originalCampData) {
            alert("Žádné změny nebyly provedeny.");
            return;
        }

        try {
            await updateCamp(JSON.stringify(campData));
            navigate("/main-page");
        } catch (err) {
            console.error("Chyba při ukládání:", err);
            alert("Chyba při ukládání: " + err.message);
        }
    };

    const handleDeleteGameType = (gameTypeIndex) => {
        const updatedCampData = { ...campData };
        updatedCampData.gameTypes.splice(gameTypeIndex, 1); // Odstraní bodovací typ na daném indexu
        setCampData(updatedCampData);
    };
    

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!campData) return <div>No camp data available.</div>;

    return (
        <div>
            <Header goBackLink="/main-page" />
            <NavbarButtons />
            <Heading text="Úpravy bodových schémat" level={1} className="nadpish1" />
            
            <div className="game-types-list">
                {campData.gameTypes.map((gameType, gameTypeIndex) => (
                   <div key={gameTypeIndex} className="game-type-section">
                    <h3 
                        onDoubleClick={() => gameTypeIndex >= 3 && handleDoubleClick(gameTypeIndex, gameType.type)}
                    >
                        {editingIndex === gameTypeIndex ? (
                            <input
                                type="text"
                                className="editable-input"
                                value={newGameTypeName}
                                onChange={handleNameChange}
                                onBlur={() => handleNameBlur(gameTypeIndex)}
                                autoFocus
                                maxLength="20"
                            />
                        ) : (
                            <>
                                {gameType.type}
                                {/* Only show delete icon for user-created game types (index >= 3) */}
                                {gameTypeIndex >= 3 && (
                                    <img 
                                        src="./recycle-bin.png" 
                                        alt="Delete" 
                                        className="delete-icon" 
                                        onClick={() => handleDeleteGameType(gameTypeIndex)}
                                    />
                                )}
                            </>
                        )}
                    </h3>
                    <div className="point-scheme">
                       {gameType.point_scheme.map((points, pointIndex) => (
                           <input
                               key={pointIndex}
                               min={1}
                               inputMode="decimal"
                               onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.]/g, ''); }}
                               type="number"
                               value={points}
                               onChange={(e) => handlePointChange(gameTypeIndex, pointIndex, e.target.value)}
                           />
                       ))}
                   </div>
               </div>
               
                ))}
                {/* Přidání nového bodového schématu */}
                <div className="add-game-type">
                    <img src="plus.png" alt="Přidat nový typ hry" onClick={addNewGameType} className="add-game-type-icon" />
                </div>
            </div>

            <div className="save-button-edit-schemes-container">
                <button onClick={saveChanges} className="save-button-edit-schemes">Uložit</button>
            </div>
        </div>
    );
};

export default EditGameTypePointsPage;
