import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getCamp } from "../api";

// COMPONENT IMPORT
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Header from "../components/Header/Header";

import '../css/MainPage.css';

const MainPage = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamScores, setTeamScores] = useState({});
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedGameType, setSelectedGameType] = useState("");
    const [selectedActivity, setSelectedActivity] = useState(null); // State for selected activity
                                                                    // Modal window pop-up

    const campDays = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"];

    // Set day drop-down menu to today
    useEffect(() => {
        const todayIndex = new Date().getDay();
        setSelectedDay(campDays[todayIndex]);
    }, []);

    // Executures when entering this page (this component)
    useEffect(() => {
        // Fetch the camp data 
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
                // Success, update camp data and calculate team score
                if (data) {
                    setCampData(data);
                    calculateTeamScores(data);
                } else {
                    setError("Camp data not found.");
                }
            } catch (err) {
                setError("Error loading camp data: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCampData();
    }, []);

    // Calculate team score based on given data (parses the input file)
    const calculateTeamScores = (data) => {
        const scores = {};

        // Initialize empty score structure
        data.teams.forEach((team) => {
            // reduce - for every item, do an operation
            scores[team.name] = campDays.reduce((teamScores, day) => {
                teamScores[day] = 0; // for every day, team starts with 0
                return teamScores;
            }, {});
        });

        // Calculate scores based on individualActivities
        data.individualActivities.forEach((activity) => {
            const { day, points, participants } = activity;

            participants.forEach((participant) => {
                // Find the team of the participant and add points
                data.teams.forEach((team) => {
                    if (team.children.includes(participant)) {
                        scores[team.name][day] += points;
                    }
                });
            });
        });

        setTeamScores(scores);
    };

    // Rendering, says if something went wrong
    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;

    if (!campData) return <div>No camp data available.</div>;

    // Filter games based on selected day and game type
    const filteredGames = selectedGameType === "individual"
        ? campData?.individualActivities.filter(activity => activity.day === selectedDay)
        : selectedGameType === "team"
            ? campData?.teamGames.filter(game => game.day === selectedDay)
            : [];

    const handleGameClick = (game) => {
        setSelectedActivity(game);
    };

    const closeModal = () => {
        setSelectedActivity(null);
    }

    return (
        <div className="main-page-container">
            <Header goBackLink="/" editLink1={"#"} editLink2={"#"}/>
            <NavbarButtons />
            <div>
                <Heading text="Sledování bodového postupu" level={1} className="nadpish1" />
                <h3 className="nadpish3">{campData.campName}</h3>
                <div className="camp-results-table-container">
                    <table className="camp-results-table">
                        <thead>
                            <tr className="header-row">
                                <th>Den</th>
                                {campData.teams.map((team, index) => (
                                    <th key={index}>{team.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {campDays.map((day, index) => (
                                <tr key={index}>
                                    <td><strong>{day}</strong></td>
                                    {campData.teams.map((team, teamIndex) => (
                                        <td key={teamIndex}>
                                            {teamScores[team.name][day] || 0}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td><strong>Celkem</strong></td>
                                {campData.teams.map((team, teamIndex) => (
                                    <td key={teamIndex}>
                                        {/* Calculate the sum, take values for every day and sum it */}
                                        {Object.values(teamScores[team.name]).reduce((sum, score) => 
                                            sum + score, 0)}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <br></br>

            {/* Activity history, TODO make it as component */}
            <Heading text="Historie aktivit" level={1} className="nadpish1" />
            
            <div className="selectors-container">
                <form>
                    <label htmlFor="day-select">Vyberte den:</label>
                    <select
                        id="day-select"
                        name="day"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        {campDays.map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </form>

                <form>
                    <label htmlFor="game-type-select">Vyberte typ hry:</label>
                    <select
                        id="game-type-select"
                        name="game-type"
                        value={selectedGameType}
                        onChange={(e) => setSelectedGameType(e.target.value)}
                    >
                        <option value="" disabled hidden>
                            Typ hry
                        </option>
                        <option value="individual">Individuální</option>
                        <option value="team">Týmová</option>
                    </select>
                </form>
            </div>

            <div className="games-list">
                {campData[selectedGameType === "individual" ? 
                    "individualActivities" : "teamGames"].filter((game) => 
                    game.day === selectedDay).map((game, index) => (
                        <div key={index} className="game-item" onClick={() => handleGameClick(game)}>
                            <span className="game-name">{game.reason}</span>
                            <span className="participant-count">{game.participants.length} osob</span>
                        </div>
                    ))}
            </div>

            {selectedActivity && (
                <div className="game-detail-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <Link to="#">
                                <img src="/edit-points-button.png" alt="Edit" className="modal-icon-left" />
                            </Link>
                            <h2 className="detail-hry">Detail hry</h2>
                            <Link to="#">
                                <img src="/recycle-bin.png" alt="Delete" className="modal-icon-right" />
                            </Link>
                        </div>
                        <h3 className="game-type">{selectedActivity.reason} 
                            ({selectedActivity.type === "individual" ? "Individuální" : "Týmová"})
                        </h3>
                        <p className="detail-hry">{selectedActivity.day}</p>
                        <hr />
                        <p><strong>Počet bodů:</strong> {selectedActivity.points}</p>
                        <table className="participant-table">
                            <thead>
                                <tr>
                                    <th>Tým</th>
                                    <th>Jméno</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedActivity.participants.map((participant, index) => {
                                    const team = campData.teams.find(team => team.children.includes(participant));
                                    const teamColor = team?.color || "#000"; // Default black color

                                    return (
                                        <tr key={index} style={{ color: teamColor }}>
                                            <td>{team?.name}</td>
                                            <td>{participant}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>

                        </table>
                        <button className="close-modal" onClick={closeModal}>Zavřít</button>
                    </div>
                </div>
            )}

            <img src="/wave.svg" alt="Wave" className="wave-svg"/>
        </div>
    );
};

export default MainPage;
