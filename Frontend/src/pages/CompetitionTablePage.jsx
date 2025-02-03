import React, { useState, useEffect } from "react";
import { getCamp } from "../api";
import { useNavigate } from "react-router-dom";

import Loading from '../components/Loading/Loading';
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Header from "../components/Header/Header";

import "../css/CompetitionTablePage.css"; // Připojení CSS

const CompetitionTablePage = () => {
    const [teams, setTeams] = useState([]);
    const [matchResults, setMatchResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [campData, setCampData] = useState(null);
    const [error, setError] = useState(null);
    const [schedule, setSchedule] = useState([]);  // Stav pro zápasový plán
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // Stav pro aktuální zápas
    const [isScheduleGenerated, setIsScheduleGenerated] = useState(false); // Stav pro kontrolu, zda byl plán generován
    const navigate = useNavigate();
    const [teamWins, setTeamWins] = useState({});

    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const campData = await getCamp();
                if (campData) {
                    setCampData(campData);
                    setTeams(campData.teams);
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

    // Fisher-Yates (Knuth) shuffle algorithm
    const shuffleTeams = (teams) => {
        const shuffledTeams = [...teams];
        for (let i = shuffledTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
        }
        return shuffledTeams;
    };

    // Funkce pro generování zápasového plánu
    const generateSchedule = () => {
        // Shuffle the teams before proceeding
        const shuffledTeams = shuffleTeams(teams);

        let matches = [];
        for (let i = 0; i < shuffledTeams.length; i++) {
            for (let j = i + 1; j < shuffledTeams.length; j++) {
                matches.push([shuffledTeams[i].name, shuffledTeams[j].name]);
            }
        }

        // Logika pro zajištění, že žádný tým nehraje dvakrát po sobě
        let orderedMatches = [];
        let remainingMatches = [...matches];
        let lastPlayedTeams = [];

        while (remainingMatches.length > 0) {
            let match = remainingMatches.shift();
            if (!lastPlayedTeams.includes(match[0]) && !lastPlayedTeams.includes(match[1])) {
                orderedMatches.push(match);
                lastPlayedTeams = match;
            } else {
                remainingMatches.push(match); // Přesunout nevyhovující zápas zpět na konec seznamu
            }
        }

        setSchedule(orderedMatches);
        setCurrentMatchIndex(0);
        setIsScheduleGenerated(true);
    };

    const calculateResults = () => {
        let wins = {};
        teams.forEach(team => {
            wins[team.name] = 0;
        });

        Object.values(matchResults).forEach(winner => {
            if (winner) wins[winner]++;
        });

        setTeamWins(wins);
    };

    const handleResultClick = (team1, team2) => {
        setMatchResults(prev => {
            const key = `${team1}-${team2}`;
            const currentWinner = prev[key];
            
            let newWinner;
            if (currentWinner === team1) {
                newWinner = team2; 
            } else if (currentWinner === team2) {
                newWinner = null; 
            } else {
                newWinner = team1; 
            }
    
            return { ...prev, [key]: newWinner }; 
        });
        calculateResults();
    };

    const showNextMatch = () => {
        setCurrentMatchIndex(prevIndex => {
            if (schedule.length > 0 && prevIndex < schedule.length - 1) {
                return prevIndex + 1;
            }
            return prevIndex;  // Pokud jsme na posledním zápase, už neinkrementovat
        });
    };
    
    const showPreviousMatch = () => {
        setCurrentMatchIndex(prevIndex => {
            if (schedule.length > 0 && prevIndex > 0) {
                return prevIndex - 1;
            }
            return prevIndex;  // Pokud jsme na prvním zápase, neinkrementovat
        });
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!campData) return <div>No camp data available.</div>;

    return (
        <div className="container-competition-table">
            <Header goBackLink="/main-page" editLink1={"/edit-teams"} editLink2={"#"} />
            <NavbarButtons />
            <Heading text="Soutěžní tabulka" level={1} className="nadpish1" />
    
            {/* Tlačítko pro generování zápasů */}
            <button onClick={generateSchedule} className="graph-button gen-button">
                Generovat zápasy
            </button>
    
            {isScheduleGenerated && (
                <div className="schedule-container">
                    <h3 className="current-match">Aktuální zápas:</h3>
                    <div className="match-navigation">
                        <button
                            onClick={showPreviousMatch}
                            className="arrow-btn"
                            disabled={currentMatchIndex === 0 || schedule.length === 0}
                        >
                            &lt;
                        </button>
                        {schedule.length > 0 && teams.length > 0 && currentMatchIndex < schedule.length && (
                            <p> {currentMatchIndex + 1}.
                                {' '}
                                <span style={{ color: teams.find(team => team.name === schedule[currentMatchIndex][0]).color }}>
                                    {schedule[currentMatchIndex][0]}
                                </span>
                                {' '}
                                vs
                                {' '}
                                <span style={{ color: teams.find(team => team.name === schedule[currentMatchIndex][1]).color }}>
                                    {schedule[currentMatchIndex][1]}
                                </span>
                            </p>
                        )}

                        <button
                            onClick={showNextMatch}
                            className="arrow-btn"
                            disabled={currentMatchIndex === schedule.length - 1 || schedule.length === 0}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}
    
            <table className="table-competition-table">
                <thead>
                    <tr>
                        <th className="header-competition-table"></th>
                        {teams.map(team => (
                            <th key={team.name} className="header-competition-table" style={{ color: team.color }}>
                                {team.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team1, rowIndex) => (
                        <tr key={team1.name}>
                            <td className="row-header-competition-table" style={{ color: team1.color }}>
                                {team1.name}
                            </td>
                            {teams.map((team2, colIndex) => {
                                const isAboveDiagonal = rowIndex < colIndex;
                                const isSameTeam = team1.name === team2.name;
                                const matchKey = `${team1.name}-${team2.name}`;
                                const matchResult = matchResults[matchKey];
    
                                const handleClick = isSameTeam || isAboveDiagonal ? () => {} : () => handleResultClick(team1.name, team2.name);
    
                                // Zjištění, zda se jedná o aktuální zápas
                                const isCurrentMatch =
                                    (schedule[currentMatchIndex] && schedule[currentMatchIndex][0] === team1.name &&
                                        schedule[currentMatchIndex][1] === team2.name) ||
                                    (schedule[currentMatchIndex] && schedule[currentMatchIndex][1] === team1.name &&
                                        schedule[currentMatchIndex][0] === team2.name);
    
                                return (
                                    <td
                                        key={matchKey}
                                        className={`cell-competition-table ${matchResult === team1.name ? "winner-competition-table" : ""}`}
                                        style={{
                                            backgroundColor:
                                                matchResult === team1.name
                                                    ? team1.color
                                                    : matchResult === team2.name
                                                    ? team2.color
                                                    : isSameTeam
                                                    ? "#f0f0f0"
                                                    : isAboveDiagonal
                                                    ? "#f0f0f0"
                                                    : isCurrentMatch
                                                    ? "#ffff99" 
                                                    : "white"
                                        }}
                                        onClick={handleClick}
                                    >
                                        {isSameTeam ? "" : ""}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Výsledky týmů */}
            <div className="results-competition-table">
                <h3>Výsledky:</h3>
                <ul>
                    {teams
                        .map((team) => {
                            const wins = Object.values(matchResults).filter(winner => winner === team.name).length;
                            return { team, wins }; // Return both team and wins in an object
                        })
                        .sort((a, b) => b.wins - a.wins) // Sort teams by wins in descending order
                        .map(({ team, wins }) => ( // Destructure the object to get team and wins
                            <li key={team.name}>
                                <span className="team-name" style={{ color: team.color }}>
                                    {team.name}
                                </span>
                                <span className="wins">{wins} výher</span>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
};

export default CompetitionTablePage;
