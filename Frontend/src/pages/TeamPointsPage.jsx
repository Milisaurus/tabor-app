// Author Jan Juračka <xjurac07>

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// COMPONENT IMPORT
import { getCamp, updateCamp } from "../api";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import SelectDay from "../components/selectDay/selectDay";
import TeamPointsTable from "../components/TeamPointsTable/TeamPointsTable";
import Loading from '../components/Loading/Loading';

import "../css/TeamPointsPage.css";

const TeamPoints = () => {
    const [campData, setCampData] = useState(null);  // camp data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const weekDays = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const [day, setDay]  = useState(weekDays[new Date().getDay()]);       // holds selected day
    const [gameName, setGameName] = useState("");    // holds name of the game
    const [gameTypeId, setGameTypeId] = useState(0); // holds type of the game, this is used for assigning points
    const [results, setResults] = useState([]);      // holds results of the game
    const [formError, setFormError] = useState("");
    const navigate = useNavigate();

    // fetch camp data
    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
                if (data) {
                    setCampData(data);
                    const initialResults = data.teams.map((team, index) => ({
                        points_awarded: 0,
                        position: index + 1,
                        team_name: team.name,
                    }));
                    setResults(initialResults); // sets initial positions and points to teams

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
    }, []);
    
    // Handles submit, sends data to server
    const handleSubmit = async (e) => {
        e.preventDefault() // prevent default values
        setFormError(""); // Reset error message

        // Check if the game name already exists in campData.teamGames
        const isDuplicateName = campData.teamGames.some((game) => game.name === gameName);
        if (isDuplicateName) {
            setFormError("Název hry již existuje! Vyberte prosím jiný název.");
            return; // Stop the submission
        }

        // Errors handling
        const positions = results.map(result => result.position);
        const maxPosition = Math.max(...positions);
        const missingPositions = [];

        for (let i = 1; i <= maxPosition; i++) {
            if (!positions.includes(i)) {
                missingPositions.push(i);
            }
        }

        if (missingPositions.length > 0) {
            setFormError(
                `Pozice nejsou správně rozděleny. Chybějící pozice: ${missingPositions.join(", ")}. Upravte prosím pořadí týmů.`
            );
            return;
        }

        const hasZeroPoints = results.some(result => result.points_awarded === 0);
        if (hasZeroPoints) {
            setFormError("Každý tým musí mít přidělené body! Zkontrolujte, že žádný tým nemá 0 bodů.");
            return;
        }

        // wrap new game into object
        const newTeamGame = {
            day,
            gameTypeId: gameTypeId,
            name: gameName,
            results: results.map((result) => ({
                points_awarded: result.points_awarded,
                position: result.position,
                team_name: result.team_name,
            })),
            timestamp: Date.now(),
        };

        // add new game into camp data
        campData["teamGames"].push(newTeamGame);

        // send JSON string to server
        try {
            await updateCamp(JSON.stringify(campData));
        } catch (err) {
            alert("Nepodařilo se odeslat požadavek");
            console.error("Error saving game data:", err);
            console.log(updatedCampDataJson);
        }

        navigate("/main-page");
    };

    if (loading) return <Loading />;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return (
        <div className="team-points-page">
            <Header goBackLink="/main-page" editLink1={"/edit-teams"} editLink2="#" showIcons="true" />
            <NavbarButtons />
            <Heading text="Vložení týmové hry" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit} className="team-points-form">
                <div className="game-name-input">
                <label>Název hry</label>
                    <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} required placeholder="Název hry" />
                </div>

                <SelectDay selectedDay={day} onDayChange={setDay} />

                 {/* Display error message if any */}
                 {formError && (
                    <div className="form-error" style={{ color: "red", marginTop: "1rem" }}>
                        {formError}
                    </div>
                )}

                <TeamPointsTable campData={campData} results={results} setResults={setResults} gameTypeId={gameTypeId} setGameTypeId={setGameTypeId}/>


                <button className="submitbutton" type="submit">Uložit</button>
            </form>
        </div>
    );
};

export default TeamPoints;