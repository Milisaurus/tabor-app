import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";
import './css/MainPage.css';

const MainPage = () => {
    const location = useLocation();
    const { camp } = location.state || {}; // Load data from previous site
    const [campData, setCampData] = useState(null);

    const campDays = ["Sobota", "Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek"];

    useEffect(() => {
        if (camp) {
            const fetchCampData = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/api/get-camp-data/${camp.campName}`);
                    if (response.ok) {
                        const data = await response.json();
                        setCampData(data); 
                    } else {
                        console.error("Tábor nenalezen");
                    }
                } catch (error) {
                    console.error("Chyba při načítání dat tábora:", error);
                }
            };

            fetchCampData();
        }
    }, [camp]);

    if (!campData) return <div>Loading...</div>;

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
