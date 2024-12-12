// Author Milan Vrbas <xvrbas01>

import React, { useEffect, useState } from "react";
import { getCamp, fetchFilteredActivities, fetchTeamScores } from "../api";

// COMPONENT IMPORT
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Header from "../components/Header/Header";
import ActivityHistory from '../components/ActivityHistory/ActivityHistory';

import '../css/MainPage.css';

const MainPage = () => {
    // State to manage camp data, loading state, error messages, team scores, filtered games, and selected options
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamScores, setTeamScores] = useState({});
    const [filteredGames, setFilteredGames] = useState([]); // Holds filtered games based on API call
    const [selectedDay, setSelectedDay] = useState(""); // Selected day for filtering activities
    const [selectedGameType, setSelectedGameType] = useState(""); // Selected game type for filtering activities
    const [selectedActivity, setSelectedActivity] = useState(null); // Holds selected activity details for modal

    // Array representing the days of the camp week
    const campDays = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"];

    // Set the default selected day based on today's day
    useEffect(() => {
        const todayIndex = new Date().getDay();
        setSelectedDay(campDays[todayIndex + 1]);
    }, []);

    // Fetch camp data and team scores
    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp(); // Fetch the camp data
                if (data) {
                    setCampData(data); // Store the camp data in state
                    // Fetch the team scores
                    const scores = await fetchTeamScores(sessionStorage.getItem('camp_name'));
                    if (scores) {
                        setTeamScores(scores); // Store the team scores in state
                    } else {
                        setError("Failed to calculate team scores.");
                    }
                } else {
                    setError("Camp data not found.");
                }
            } 
            catch (err) {
                setError("Error loading camp data: " + err.message);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchCampData();
    }, []);

    // Fetch filtered games whenever filters change
    useEffect(() => {
        const fetchFilteredData = async () => {
            if (campData) {
                try {
                    // Fetch filtered games
                    const games = await fetchFilteredActivities(sessionStorage.getItem('camp_name'), selectedDay, selectedGameType);
                    setFilteredGames(games); // Store the filtered games in state
                } catch (err) {
                    setError("Error fetching filtered activities: " + err.message);
                }
            }
        };
        fetchFilteredData();
    }, [campData, selectedDay, selectedGameType]);

    // Error handling
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!campData) return <div>No camp data available.</div>;

    // Handle click on a game to display its details in a modal
    const handleGameClick = (game) => {
        setSelectedActivity(game);
    };

    // Close the modal by setting selectedActivity to null
    const closeModal = () => {
        setSelectedActivity(null);
    };

    // Mapping for game types to display the corresponding name
    const gameTypeMapping = {
        1: "Méně bodovaná",
        2: "Více bodovaná",
        3: "Velmi bodovaná",
        4: "Vlastní",
    };

    return (
        <div className="main-page-container">
            <Header goBackLink="/" editLink1={"/edit-teams"} editLink2={"#"} />
            <NavbarButtons />
            <div>
                <Heading text="Sledování bodového postupu" level={1} className="nadpish1" />
                <h3 className="nadpish3">{campData.campName}</h3>
                <div className="camp-results-table-container">
                    <table className="camp-results-table">
                        <thead>
                            <tr className="header-row">
                                <th>Den</th>
                                {/* Render team names as table headers */}
                                {campData.teams.map((team, index) => (
                                    <th key={index}>{team.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Loop through each day and render team scores for each day */}
                            {campDays.map((day, index) => (
                                <tr key={index}>
                                    <td><strong>{day}</strong></td>
                                    {campData.teams.map((team, teamIndex) => (
                                        <td key={teamIndex}>
                                            {/* Display the score for each team on the given day */}
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
                                        {Object.values(teamScores[team.name]).reduce((sum, score) => sum + score, 0)}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <br></br>

            <Heading text="Historie aktivit" level={1} className="nadpish1" />
            
            <div className="selectors-container">
                {/* Day selection dropdown */}
                <form>
                    <label htmlFor="day-select">Vyberte den:</label>
                    <select
                        id="day-select"
                        name="day"
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value)} // Update selected day
                    >
                        {campDays.map((day, index) => (
                            <option key={index} value={day}>
                                {day}
                            </option>
                        ))}
                    </select>
                </form>
                
                {/* Game type selection dropdown */}
                <form>
                    <label htmlFor="game-type-select">Vyberte typ hry:</label>
                    <select
                        id="game-type-select"
                        name="game-type"
                        value={selectedGameType}
                        onChange={(e) => setSelectedGameType(e.target.value)} // Update selected game type
                    >
                        <option value="">Vše</option>
                        <option value="individual">Individuální</option>
                        <option value="team">Týmová</option>
                    </select>
                </form>
            </div>

            <div className="games-list">
                {filteredGames.map((game, index) => (
                    <div 
                        key={index} 
                        className="game-item" 
                        onClick={() => handleGameClick(game)}
                    >
                        <span className="game-name">
                            {game.reason || game.name} {/* Display the game name */}
                        </span>
                        <span className="participant-count">
                            {game.participants ? 
                            `${game.participants.length} osob` // Display participant count
                            : 
                            gameTypeMapping[game.gameTypeId]} {/* Display game type if no participants */}
                        </span>
                    </div>
                ))}
            </div>

            {/* Render modal with activity details if an activity is selected */}
            {selectedActivity && (
                <ActivityHistory 
                    selectedActivity={selectedActivity} 
                    campData={campData} 
                    closeModal={closeModal} 
                />
            )}

            <img src="/wave.svg" alt="Wave" className="wave-svg"/>
        </div>
    );
};

export default MainPage;
