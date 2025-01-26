// Author Milan Vrbas <xvrbas01>

import React, { useEffect, useState } from "react";
import { getCamp, fetchFilteredActivities, fetchTeamScores, updateCamp } from "../api";

// COMPONENT IMPORT
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Header from "../components/Header/Header";
import ActivityHistory from '../components/ActivityHistory/ActivityHistory';
import Loading from '../components/Loading/Loading';
import { useNavigate } from "react-router-dom";

import '../css/MainPage.css';

import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const MainPage = () => {
    // State to manage camp data, loading state, error messages, team scores, filtered games, and selected options
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamScores, setTeamScores] = useState({});
    const [filteredGames, setFilteredGames] = useState([]); // Holds filtered games based on API call
    const weekDays = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"]; // Array for init the selectedDay
    const [selectedDay, setSelectedDay] = useState(weekDays[new Date().getDay()]); // Selected day for filtering activities
    const [selectedGameType, setSelectedGameType] = useState(""); // Selected game type for filtering activities
    const [selectedActivity, setSelectedActivity] = useState(null); // Holds selected activity details for modal
    const [isFetching, setIsFetching] = useState(false);
    const navigate = useNavigate();

    // Array representing the days of the camp week
    const campDays = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"];

    const [showModal, setShowModal] = useState(false);
    const [selectedDayOption, setSelectedDayOption] = useState("Všechny dny");

    const toggleModal = () => setShowModal(!showModal);

    // Fetch camp data and team scores
    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp(); // Fetch the camp data
                if (data) {
                    setCampData(data); // Store the camp data in state
                    
                    // Fetch filtered games after entering page
                    const games = await fetchFilteredActivities(
                        sessionStorage.getItem("camp_name"),
                        selectedDay,
                        selectedGameType
                    );
                    setFilteredGames(games);
                    
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
        if (!sessionStorage.getItem("camp_name")) {
            navigate("/");
        }
        fetchCampData();
    }, []);
    
    useEffect(() => {
        const fetchFilteredData = async () => {
            if (campData) {
                setIsFetching(true);
                try {
                    const games = await fetchFilteredActivities(
                        sessionStorage.getItem("camp_name"),
                        selectedDay,
                        selectedGameType
                    );
                    
                    setFilteredGames(games);
                } catch (err) {
                    setError("Error fetching filtered activities: " + err.message);
                } finally {
                    setIsFetching(false);
                }
            }
        };
        fetchFilteredData();
    }, [selectedDay, selectedGameType]);
    

    if (loading) return <Loading />;
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
        0: "Vlastní",
        1: "Méně bodovaná",
        2: "Více bodovaná",
        3: "Velmi bodovaná"
    };

    // Delete individual activity or team game and update points and filtered games
    const handleDelete = async () => {
        const updatedCampData = { ...campData };

        // Remove selected individual activity or team game
        if (selectedActivity.participants) {
            updatedCampData.individualActivities = updatedCampData.individualActivities.filter((activity) => activity.reason !== selectedActivity.reason);
        } 
        else {
            updatedCampData.teamGames = updatedCampData.teamGames.filter((game) => game.name !== selectedActivity.name);
        }

        // Update the camp data
        setCampData(updatedCampData);
        const campDataJSON = JSON.stringify(updatedCampData);

        try {
            // Update the camp first
            await updateCamp(campDataJSON);

            // Fetch the filtered activities after update completion
            const games = await fetchFilteredActivities(sessionStorage.getItem('camp_name'), selectedDay, selectedGameType);
            setFilteredGames(games);

            // Fetch the updated scores after activity removal
            const scores = await fetchTeamScores(sessionStorage.getItem('camp_name'));
            if (scores) {
                setTeamScores(scores);
            } 
            else {
                setError("Failed to calculate team scores.");
            }
        } 
        catch (err) {
            console.error("Error while deleting and updating the activity:", err);
            alert("Smazání aktivity se nezdařilo.");
        }

        closeModal(); // Close the modal once the update and fetch processes are completed
    };

    const getParticipantLabel = (count) => {
        if (count === 1) return "osoba";
        if (count >= 2 && count <= 4) return "osoby";
        return "osob";
    };    

    // Genetare graph based on CampData
    const generateGraphData = () => {
        if (!campData) return { labels: [], datasets: [] };
        
        const teamNames = campData.teams.map((team) => team.name);
    
        if (selectedDayOption === "Denní postup") {
            return {
                labels: campDays,
                datasets: campData.teams.map((team) => ({
                    label: team.name,
                    data: campDays.map((day) => teamScores[team.name]?.[day] || 0),
                    borderColor: team.color,
                    backgroundColor: team.color,
                    borderWidth: 2,
                    fill: false,
                })),
            };
        } else if (selectedDayOption === "Celkový postup") {
            return {
                labels: campDays,
                datasets: campData.teams.map((team) => {
                    let cumulativePoints = 0;
                    return {
                        label: team.name,
                        data: campDays.map((day) => {
                            cumulativePoints += teamScores[team.name]?.[day] || 0;
                            return cumulativePoints;
                        }),
                        borderColor: team.color,
                        backgroundColor: team.color,
                        borderWidth: 2,
                        fill: false,
                    };
                }),
            };
        } else {
            return {
                labels: teamNames,
                datasets: [{
                    label: selectedDayOption,
                    data: teamNames.map((teamName) =>
                        selectedDayOption === "Všechny dny"
                            ? Object.values(teamScores[teamName] || {}).reduce((sum, score) => sum + score, 0)
                            : teamScores[teamName]?.[selectedDayOption] || 0
                    ),
                    backgroundColor: campData.teams.map((team) => team.color),
                }],
            };
        }
    };
    
    const chartOptionsLine = {
        scales: {
            y: {
                ticks: {
                    stepSize: 1, // Pouze celá čísla
                    callback: function(value) {
                        return Number.isInteger(value) ? value : null;
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false, 
    };
    
    const chartOptionsBar = {
        ...chartOptionsLine,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const getContrastingTextColor = (backgroundColor) => {
        const color = backgroundColor.substring(1); // remove #
        const rgb = parseInt(color, 16); // hex value
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff; 
        const b = (rgb >> 0) & 0xff; 
        // calculate intensity
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? "black" : "white";
    };

    function hexToRgba(hex, alpha) {
        // Odstraní "#" na začátku, pokud existuje
        let cleanHex = hex.replace('#', '');
        
        // Rozdělení na jednotlivé složky
        let r = parseInt(cleanHex.substring(0, 2), 16);
        let g = parseInt(cleanHex.substring(2, 4), 16);
        let b = parseInt(cleanHex.substring(4, 6), 16);
    
        return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Použití s průhledností
    }
    
    

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
                                        <td key={teamIndex} style={{backgroundColor: hexToRgba(team.color, 0.15)}}>
                                            {/* Display the score for each team on the given day */}
                                            {teamScores[team.name][day] || 0}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="total-row">
                                <td ><strong>Celkem</strong></td>
                                {campData.teams.map((team, teamIndex) => (
                                    <td key={teamIndex} style={{backgroundColor: hexToRgba(team.color, 0.35)}}>
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

            <div className="graph-container">
                <button className="graph-button" onClick={toggleModal}>
                    Zobrazit grafy
                </button>
            </div>

            
            {showModal && (
                <div className="modal-graph">
                    <div className="modal-content-graph">
                        <h3 className="game-type">Grafové zobrazení bodů</h3>
                        <label htmlFor="day-select">Vyberte graf</label>
                        <select
                            id="day-select"
                            value={selectedDayOption}
                            onChange={(e) => setSelectedDayOption(e.target.value)}
                        >
                            <option value="Všechny dny">Všechny dny</option>
                            <option value="Denní postup">Denní postup</option>
                            <option value="Celkový postup">Celkový postup</option>
                            {campDays.map((day) => (
                                <option key={day} value={day}>
                                    {day}
                                </option>
                            ))}
                        </select>
                        <div className="chart">
                        {selectedDayOption === "Denní postup" || selectedDayOption === "Celkový postup" ? (
                            <Line data={generateGraphData()} options={chartOptionsLine} />
                        ) : (
                            <Bar data={generateGraphData()} options={chartOptionsBar} />
                        )}

                        </div>
                        <button className="close-modal-graph" onClick={toggleModal}>
                            Zavřít
                        </button>
                    </div>
                </div>
            )}

            <Heading text="Historie aktivit" level={1} className="nadpish1" />
            
            <div>
                <div className="selectors-container">
                    <form>
                        <label htmlFor="day-select">Vyberte den:</label>
                        <select
                            id="day-select"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                        >
                            <option value="">Všechny dny</option>
                            {campDays.map((day, index) => (
                                <option key={index} value={day}>{day}</option>
                            ))}
                        </select>
                    </form>
                    <form>
                        <label htmlFor="game-type-select">Vyberte typ hry:</label>
                        <select
                            id="game-type-select"
                            value={selectedGameType}
                            onChange={(e) => setSelectedGameType(e.target.value)}
                        >
                            <option value="">Vše</option>
                            <option value="individual">Individuální</option>
                            <option value="team">Týmová</option>
                        </select>
                    </form>
                </div>
                
                {isFetching ? (
                    <div className="spinner"></div>
                ) : (
                    <div className={`games-list ${isFetching ? 'loading' : ''}`}>
                        {filteredGames.map((game, index) => (
                            <div
                                key={index}
                                className="game-item"
                                onClick={() => handleGameClick(game)}
                            >
                                <span className="game-name">
                                    {game.reason || game.name}
                                </span>
                                <span className="participant-count">
                                    {game.participants 
                                        ? (game.participants[0] === "odd" || game.participants[0] === "even" 
                                            ? (game.participants[0] === "odd" ? "Lichá" : "Sudá") 
                                            : `${game.participants.length} ${getParticipantLabel(game.participants.length)}`)
                                        : gameTypeMapping[game.gameTypeId]}
                                </span>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Render modal with activity details if an activity is selected */}
            {selectedActivity && (
                <ActivityHistory 
                    selectedActivity={selectedActivity} 
                    campData={campData} 
                    closeModal={closeModal}
                    handleDelete={handleDelete}
                />
            )}

        </div>
    );
};

export default MainPage;
