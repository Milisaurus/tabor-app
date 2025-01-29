// Author Jan Juračka <xjurac07>

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import { getCamp, updateCamp } from "../api";
import SelectDay from "../components/selectDay/selectDay";
import TeamPointsTable from "../components/TeamPointsTable/TeamPointsTable";
import Loading from '../components/Loading/Loading';
import TeamPointsTableGame from "../components/TeamPointsTableGame/TeamPointsTableGame";

import "../css/EditGame.css"

const EditTeamGame = () => {
    const [campData, setCampData] = useState();     // camp data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const [selectedGame, setSelectedGame] = useState(); // game selected for editing
    const [editedGame, setEditedGame] =useState();      // edited version of selected game
    const navigate = useNavigate();
    const location = useLocation();
    const [useGamePoints, setGamePoints] = useState(false);

    // get name of edited game form URL querry
    const queryParams = new URLSearchParams(location.search);
    const gameNameFromUrl = queryParams.get("name");

    // Handle editing game
    const handleChange = (field, value) => {
        setEditedGame((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // fetch camp data
    useEffect(() => {
            const fetchCampData = async () => {
                try {
                    const data = await getCamp();
                    if (data) {
                        setCampData(data);
                        if (gameNameFromUrl) {
                            const game = data.teamGames.find(
                                (g) => g.name === gameNameFromUrl
                            );
                            setSelectedGame(game);
                            setEditedGame(game);
                        }
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

    // Handles submit, send data to server
    const handleSubmit = async (e) => {
        // prevent default values
        e.preventDefault();
        // Validate that the new game name does not conflict with other games (except the current one being edited)
        const isDuplicateName = campData.teamGames.some((game) => game.name === editedGame.name && game.name !== selectedGame.name);
        if (isDuplicateName) {
            alert("Název hry již existuje! Vyberte prosím jiný název.");
            return; // Stop the submission if duplicate name is found
        }        
        // switch selected game for edited version
        const updatedGames = campData.teamGames.map((game) => game.name === selectedGame.name ? editedGame : game);
        const updatedCampData = {...campData,teamGames: updatedGames,};
        // send JSON string to server
        try {
            await updateCamp(JSON.stringify(updatedCampData));
            navigate("/main-page");
        } catch (err) {
            console.error("Error updating game data:", err);
        }
    };

    if (loading) return <Loading />;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return(
        <div className="edit-team-games-page" onSubmit={handleSubmit}>
            <Header goBackLink="/main-page" editLink1={"/edit-teams"} editLink2="#" showIcons="true" />
            <NavbarButtons />
            <Heading text="Úprava týmové hry" level={1} className="nadpish1" />
            <form onSubmit={handleSubmit} className="edit-game-form">
                <div className="game-name-input">
                    <label>Název hry</label>
                    <input type="text" value={editedGame.name} onChange={(e) => handleChange("name", e.target.value)} required placeholder="Název hry" />
                </div>

                <SelectDay selectedDay={editedGame.day} onDayChange={(newDay) => handleChange("day", newDay)}/>

                <div className="checkbox-container-switch">
                    <label>
                        Použít herní body:
                        <input 
                            className="checkbox-switch"
                            type="checkbox" 
                            checked={useGamePoints} 
                            onChange={() => setGamePoints(!useGamePoints)}
                        />
                    </label>
                </div>

                {!useGamePoints ? (
                    <TeamPointsTable 
                    campData={campData} 
                    results={editedGame.results} 
                    setResults={(newTeams) => handleChange("results", newTeams)} 
                    gameTypeId={editedGame.gameTypeId} 
                    setGameTypeId={(newId) => handleChange("gameTypeId", newId)}/>
                ) : (
                    <TeamPointsTableGame 
                        campData={campData} 
                        results={editedGame.results} 
                        setResults={(newTeams) => handleChange("results", newTeams)} 
                        gameTypeId={editedGame.gameTypeId} 
                        setGameTypeId={(newId) => handleChange("gameTypeId", newId)}/>
                )}

                <button className="submitbutton" type="submit">Potvrdit</button>

            </form>
            <img src="/wave.svg" alt="Wave" />
        </div>
    )
}

export default EditTeamGame;