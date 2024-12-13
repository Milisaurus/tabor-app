import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCamp, updateCamp } from "../api";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import SelectDay from "../components/selectDay/selectDay";

import "../css/TeamPointsPage.css";

const TeamPoints = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [day, setDay] = useState("Pondělí");
    const [gameName, setGameName] = useState("");
    const [gameTypeId, setGameTypeId] = useState(0);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    const handleGameTypeChange = (e) => {
        const selectedTypeId = parseInt(e.target.value, 10);
        setGameTypeId(selectedTypeId);

        if (!isNaN(selectedTypeId)) {
            updateTeamPointsBasedOnPositions(selectedTypeId);
        }
    };

    const updateTeamPointsBasedOnPositions = (gameTypeId) => {
        const gameTypeData = campData.gameTypes[gameTypeId];
        if (!gameTypeData) return;

        const { point_scheme, everyone_else } = gameTypeData;
        const updatedTeams = teams.map((team, index) => {
            const points = index < point_scheme.length ? point_scheme[index] : everyone_else;
            return { ...team, points };
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
    };

    const handleManualPointChange = (teamIndex, newPoints) => {
        const updatedTeams = [...teams];
        updatedTeams[teamIndex].points = newPoints;
        setTeams(updatedTeams);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTeamGame = {
            day,
            gameTypeId: gameTypeId + 1,
            name: gameName,
            results: teams.map((team) => ({
                points_awarded: team.points,
                position: team.position,
                team_name: team.name,
            })),
        };
        campData["teamGames"].push(newTeamGame);
        const updatedCampDataJson = JSON.stringify(campData);

        try {
            await updateCamp(updatedCampDataJson);
        } catch (err) {
            console.error("Error saving game data:", err);
            console.log(updatedCampData);
        }
        navigate("/main-page");
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
            <Header goBackLink="/main-page" editLink1={"/edit-teams"} editLink2="#" showIcons="true" />
            <NavbarButtons />
            <Heading text="Vložení týmových bodů" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit} className="team-points-form">
                <div>
                    <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} required placeholder="Název hry" />
                </div>

                <SelectDay selectedDay={day} onDayChange={setDay} />

                <div>
                    <label>Typ hry</label>
                    <select value={gameTypeId !== null ? gameTypeId : ""} onChange={handleGameTypeChange}>
                        {campData.gameTypes.map((type, index) => (
                            <option key={index} value={index}>
                                {type.type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Table Structure for Teams */}
                <label>Upravte pozice týmů přetažením</label>
                <table className="team-table">
                    <thead>
                        <tr>
                            <th>Umístění</th>
                            <th>Tým</th>
                            <th>Body</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team, index) => (
                            <tr
                                key={team.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                            >
                                <td className="team-position">{team.position}</td>
                                <td className="team-info">
                                    <div className="team-name" style={{ backgroundColor: team.color }}>
                                        <span className="name">{team.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="points-input"
                                        value={team.points}
                                        onChange={(e) => handleManualPointChange(index, parseFloat(e.target.value) || 0)}
                                        min={0}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button className="submitbutton" type="submit">
                    Potvrdit
                </button>
            </form>
        </div>
    );
};

export default TeamPoints;