import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCamp, updateCamp } from "../api";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import SelectDay from "../components/selectDay/selectDay";
import TeamPointsTable from "../components/TeamPointsTable/TeamPointsTable";

import "../css/TeamPointsPage.css";

const TeamPoints = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const weekDays = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const [day, setDay] = useState(weekDays[new Date().getDay()]);
    const [gameName, setGameName] = useState("");
    const [gameTypeId, setGameTypeId] = useState(0);
    const [results, setResults] = useState([]);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newTeamGame = {
            day,
            gameTypeId: gameTypeId,
            name: gameName,
            results: results.map((result) => ({
                points_awarded: result.points_awarded,
                position: result.position,
                team_name: result.team_name,
            })),
        };
        campData["teamGames"].push(newTeamGame);
        const updatedCampDataJson = JSON.stringify(campData);

        try {
            await updateCamp(updatedCampDataJson);
        } catch (err) {
            console.error("Error saving game data:", err);
            console.log(updatedCampDataJson);
        }
        navigate("/main-page");
    };

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
                    setResults(initialResults);  // Set the results state

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
                <label>Název hry</label>
                    <input
                        type="text"
                        value={gameName}
                        onChange={(e) => setGameName(e.target.value)}
                        required
                        placeholder="Název hry"
                    />
                </div>

                <SelectDay selectedDay={day} onDayChange={setDay} />

                <div style={{width: "100%"}}>
                    <TeamPointsTable
                        campData={campData}
                        results={results}
                        setResults={setResults}
                        gameTypeId={gameTypeId}
                        setGameTypeId={setGameTypeId}
                    />
                </div>

                <button className="submitbutton" type="submit">Potvrdit</button>
            </form>
            <img src="/wave.svg" alt="Wave" />
        </div>
    );
};

export default TeamPoints;