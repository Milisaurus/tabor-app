import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateCamp, addGameTypes } from "../api";

// COMPONENT IMPORT
import TeamForm from "../components/TeamForm/TeamForm";
import Heading from "../components/Heading/Heading";
import Header from "../components/Header/Header"
import Loading from '../components/Loading/Loading';

import "../css/CreateCamp.css";

const CreateCamp = () => {
    const [teamCount, setTeamCount] = useState(""); // Store the number of teams
    const [teams, setTeams] = useState([]); // Store the teams data
    const [currentChildIndexes, setCurrentChildIndexes] = useState([]); // Store current child index for each team
    const [errorMessage, setErrorMessage] = useState(""); // Store error
    // List of all available colors
    const colorNames = {
        "#FF0000": "červená",
        "#0000FF": "modrá",
        "#008000": "zelená",
        "#FFCC00": "žlutá",
        "#000000": "černá",
        "#8B4513": "hnědá",
        "#FFA500": "oranžová",
        "#800080": "fialová",
    };
    const navigate = useNavigate();
    
    // Check if camp name is available in session storage
    useEffect(() => {
        const storedCampName = sessionStorage.getItem("camp_name");
        if (!storedCampName) {
            alert("Nebyly nalezeny informace o táboru.");
        }
      }, []);

    // Handle form submission to update the camp and add game types
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if team colors are unique
        const colorSet = new Set();
        for (let i = 0; i < teams.length; i++) {
            if (colorSet.has(teams[i].color)) {
                // Translate hex color represation to color name
                const colorName = colorNames[teams[i].color] || teams[i].color;
                setErrorMessage(
                    `Barva týmu "${teams[i].name}" (${colorName}) už je použita. Zvolte jinou barvu.`
                );
                return; // Alert user and do nothing
            }
            colorSet.add(teams[i].color);
        }
        // Clear error message
        setErrorMessage("");

        // Store camp data
        const allData = {
            campName: sessionStorage.getItem("camp_name"),
            teamCount,
            teams: teams.map((team) => ({
                name: team.name,
                color: team.color,
                leader1: team.leader1,
                leader2: team.leader2,
                childrenCount: team.childrenCount,
                children: team.children,
            })),
        };

        // Update the camp data and add game types
        await updateCamp(JSON.stringify(allData));
        await addGameTypes(allData.campName);

        navigate("/main-page");
    };

    // Handle changes in the number of teams
    const handleTeamCountChange = (e) => {
        const count = parseInt(e.target.value);
        setTeamCount(count);
        const newTeams = Array.from({ length: count }, () => ({
            name: "",
            color: "",
            leader1: "",
            leader2: "",
            childrenCount: "",
            children: [],
        }));
        setTeams(newTeams);
        setCurrentChildIndexes(new Array(count).fill(0)); // Set initial child index for each team
    };

    // Handle changes to team data (name, color, ...)
    const handleTeamChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTeams = [...teams];
        
        updatedTeams[index][name] = value;

         // If children count changes, adjust the children array
        if (name === "childrenCount" && value !== "") {
            updatedTeams[index].children = Array.from({ length: parseInt(value) }, () => "");
        }

        // Adjust the current child index based on children count
        if (currentChildIndexes[index] >= parseInt(value)) {
            currentChildIndexes[index] = parseInt(value) - 1;
        }

        setTeams(updatedTeams);
        setCurrentChildIndexes([...currentChildIndexes]);
    };

    // Handle changes to individual child data
    const handleChildChange = (teamIndex, childIndex, e) => {
        const { value } = e.target;
        const updatedTeams = [...teams];
        updatedTeams[teamIndex].children[childIndex] = value;
        setTeams(updatedTeams);
    };

    // Handle child form navigation (next/previous child)
    const handleChildFormChange = (teamIndex, direction) => {
        const updatedIndexes = [...currentChildIndexes];
        if (direction === "next" && updatedIndexes[teamIndex] < teams[teamIndex].children.length - 1) {
            updatedIndexes[teamIndex]++;
        } else if (direction === "prev" && updatedIndexes[teamIndex] > 0) {
            updatedIndexes[teamIndex]--;
        }
        setCurrentChildIndexes(updatedIndexes);
    };

    return (
        <div className="create-camp-container">
            
            <Header goBackLink="/" showIconsRight={false}/>
            <Heading text="Tvorba Tábora" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit}>
                {/* Team count dropdown */}
                <div>
                    <label htmlFor="teamCount">Počet týmů:</label>
                    <select
                        id="teamCount"
                        value={teamCount}
                        onChange={handleTeamCountChange}
                        required
                    >
                        <option value="" disabled hidden>
                            Počet týmů
                        </option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>

                {/* Render a TeamForm component for each team */}
                {teams.map((team, index) => (
                    <TeamForm
                        key={index}
                        index={index}
                        team={team}
                        currentChildIndex={currentChildIndexes[index]}
                        handleTeamChange={handleTeamChange}
                        handleChildChange={handleChildChange}
                        handleChildFormChange={handleChildFormChange}
                    />
                ))}
                <button className="linkbutton" type="submit">Vytvořit</button>
            </form>
            {errorMessage && (
            <div style={{ color: "red", marginTop: "10px" }}>
                {errorMessage}
            </div>
            )}
        </div>
    );
};

export default CreateCamp;
