import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";
import './css/MainPage.css';

const MainPage = () => {
    const location = useLocation();
    const { camp } = location.state || {}; // Load data from previous site
    const [campData, setCampData] = useState(null);

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
            <h1>{campData.campName}</h1>
            <h2>Počet týmů: {campData.teams.length}</h2>

            <h3>Seznam týmů:</h3>
            <ul>
                {campData.teams.map((team, index) => (
                    <li key={index}>
                        <h4>{team.name}</h4>
                        <p>Vedoucí 1: {team.leader1}</p>
                        <p>Vedoucí 2: {team.leader2}</p>
                        <p className="team-color" style={{ backgroundColor: team.color }}>
                            Barva: {team.color}
                        </p>
                        <h5>Seznam dětí:</h5>
                        <ul className="children">
                            {team.children.map((child, idx) => (
                                <li key={idx}>{child}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MainPage;
