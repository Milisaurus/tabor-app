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
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const campData = await getCamp();
                if (campData) {
                    setCampData(campData);
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

    const handlePointChange = (gameTypeIndex, pointIndex, newValue) => {
        const updatedCampData = { ...campData };
        updatedCampData.gameTypes[gameTypeIndex].point_scheme[pointIndex] = Number(newValue);
        setCampData(updatedCampData);
    };

    const saveChanges = async () => {
        try {
            await updateCamp(campData);
            alert("Změny byly úspěšně uloženy.");
        } catch (err) {
            alert("Chyba při ukládání: " + err.message);
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!campData) return <div>No camp data available.</div>;

    return (
        <div className="edit-game-type-points-container">
            <Header goBackLink="/main-page" />
            <NavbarButtons />
            <Heading text="Editace bodových schémat" level={1} className="nadpish1" />
            <div className="game-types-list">
                {campData.gameTypes.map((gameType, gameTypeIndex) => (
                    <div key={gameTypeIndex} className="game-type-section">
                        <h2>{gameType.type}</h2>
                        <div className="point-scheme">
                            {gameType.point_scheme.map((points, pointIndex) => (
                                <input
                                    key={pointIndex}
                                    type="number"
                                    value={points}
                                    onChange={(e) => handlePointChange(gameTypeIndex, pointIndex, e.target.value)}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={saveChanges} className="save-button">Uložit změny</button>
        </div>
    );
};

export default EditGameTypePointsPage;
