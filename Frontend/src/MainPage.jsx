import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";
import './css/MainPage.css';
import {getCamp} from "./api"

const MainPage = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const campDays = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"];

    // Fetch the camp data
    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
                if (data) {
                    setCampData(data);
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
                <h1 className="nadpis">Sledování bodového postupu</h1>
                <h3>{campData.campName}</h3>
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
                                {campData.teams.map((_, teamIndex) => (
                                    <td key={teamIndex}></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="total-row">
                            <td><strong>Celkem</strong></td>
                            {campData.teams.map((_, teamIndex) => (
                                <td key={teamIndex}></td>
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
