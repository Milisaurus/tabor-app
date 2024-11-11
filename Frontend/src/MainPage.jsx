import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";
import './css/MainPage.css';
import { getCamp } from "./api";

const MainPage = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [teamScores, setTeamScores] = useState({});

    const campDays = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"];

    // Fetch the camp data
    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
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

    const calculateTeamScores = (data) => {
        const scores = {};

        // Initialize empty score structure
        data.teams.forEach((team) => {
            scores[team.name] = campDays.reduce((acc, day) => {
                acc[day] = 0;
                return acc;
            }, {});
        });

        // Calculate scores based on individualActivities
        data.individualActivities.forEach((activity) => {
            const { day, points, participants } = activity;

            participants.forEach((participant) => {
                // Find the team of the participant
                data.teams.forEach((team) => {
                    if (team.children.includes(participant)) {
                        scores[team.name][day] += points;
                    }
                });
            });
        });

        setTeamScores(scores);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!campData) {
        return <div>No camp data available.</div>;
    }

    return (
        <div>
            <NavbarTitle goBackLink="/" editLink1={"#"} editLink2={"#"} />
            <NavbarButtons />
            <div>
                <h1 className="nadpish1">Sledování bodového postupu</h1>
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
                                        {Object.values(teamScores[team.name]).reduce((sum, score) => sum + score, 0)}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            <img src="/wave.svg" alt="Wave" className="wave-svg"/>
        </div>
    );
};

export default MainPage;
