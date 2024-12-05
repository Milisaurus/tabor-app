import React, { useState, useEffect } from "react";
import { getCamp, updateCamp } from "../api";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import SelectDay from "../components/selectDay/selectDay";

import "../css/TeamPointsPage.css"

const TeamPoints = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [day, setDay] = useState("Pondělí");
    const [gameName, setGameName] = useState("");
    const [gameType, setGameType] = useState("Vlastní");
    const [teams, setTeams] = useState([]);

    const handleGameTypeChange = (e) => {
        const selectedType = e.target.value;
        setGameType(selectedType);
        const gameTypeData = campData.gameTypes.find((type) => type.type === selectedType);
        if (gameTypeData) {
            const { point_scheme } = gameTypeData;
            updateTeamPointsBasedOnPositions(point_scheme);
        }
    };

    const updateTeamPointsBasedOnPositions = (pointScheme) => {
        const updatedTeams = teams.map((team, index) => {
            let points = 0;
            if (index < pointScheme.length) {
                points = pointScheme[index];
            }
            return { ...team, points: points };
        });
        setTeams(updatedTeams);
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("dragIndex", index);
    };

    const handleDrop = (e, dropIndex) => {
        const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);
        const updatedTeams = [...teams];
        const draggedTeam = updatedTeams[dragIndex];
        updatedTeams.splice(dragIndex, 1);
        updatedTeams.splice(dropIndex, 0, draggedTeam);

        updatedTeams.forEach((team, idx) => {
            team.position = idx + 1;
        });

        setTeams(updatedTeams);
        updateTeamPointsBasedOnPositions(point_scheme);
    };

    const handleManualPointChange = (teamIndex, newPoints) => {
        const updatedTeams = [...teams];
        updatedTeams[teamIndex].points = newPoints;
        setTeams(updatedTeams);
        setGameType("Vlastní");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const gameData = {
            day,
            gameName,
            gameType,
            results: teams.map((team) => ({
                name: team.name,
                points: team.points,
            })),
        };

        try {
            await updateCamp({ ...campData, games: [...campData.games, gameData] });
            alert("Game results saved!");
        } catch (err) {
            console.error("Error saving game data:", err);
            alert("Failed to save game results.");
        }
    };

    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
                if (data) {
                    setCampData(data);
                    setTeams(data.teams.map((team, index) => ({ ...team, position: index + 1, points: 0 })));
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

    if (loading) return <h1>Načítání...</h1>;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return (
        <div className="team-points-page">
            <Header goBackLink="/main-page" editLink1="#" editLink2="#" showIcons="true" />
            <NavbarButtons />
            <Heading text="Vložení týmových bodů" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit} className="create-camp-container">
                <div>
                    <label>Typ hry</label>
                    <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} required placeholder="Název hry"/>
                </div>

                <SelectDay selectedDay={day} onDayChange={setDay} />

                <div>
                    <label>Typ hry</label>
                    <select value={gameType} onChange={handleGameTypeChange}>
                        <option value="Vlastní">Vlastní</option>
                        {campData.gameTypes.map((type, index) => (
                            <option key={index} value={type.type}>{type.type}</option>
                        ))
                        }
                    </select>
                </div>

                <div className="team-list">
                    {teams.map((team, index) => (
                        <div
                            key={team.name}
                            className="team-header"
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            <div className="team-position" style={{ backgroundColor: team.color }}>
                                {team.position}
                            </div>
                            <div className="team-name">{team.name}</div>
                            <div
                                className="team-points"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleManualPointChange(index, parseInt(e.target.textContent, 10))}
                            >
                                {team.points}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="submitbutton" type="submit">Potvrdit</button>
            </form>
        </div>
    );
};

export default TeamPoints;