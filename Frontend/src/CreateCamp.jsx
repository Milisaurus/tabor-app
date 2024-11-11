import React, { useState } from "react";
import "./css/CreateCamp.css"
import {createCamp} from "./api"

const CreateCamp = () => {
    const [campName, setCampName] = useState("");
    const [teamCount, setTeamCount] = useState("");
    const [teams, setTeams] = useState([]);
    const [currentChildIndexes, setCurrentChildIndexes] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Hold inputs after submitting 

        // Combine all data into a single string
        const allData = {
            campName,
            teamCount,
            teams: teams.map(team => ({
                name: team.name,
                color: team.color,
                leader1: team.leader1,
                leader2: team.leader2,
                childrenCount: team.childrenCount,
                children: team.children
            })),
            teamGames: [],
            individualActivities: [],
            gameTypes: [
                {
                    type: "Méně bodovaná",
                    point_scheme: {
                        "1st_place": 10,
                        "2nd_place": 5,
                        "3rd_place": 3
                    }
                },
                {
                    type: "Více bodovaná",
                    point_scheme: {
                        "1st_place": 30,
                        "2nd_place": 20,
                        "3rd_place": 10
                    }
                },
                {
                    type: "Velmi bodovaná",
                    point_scheme: {
                        "1st_place": 50,
                        "2nd_place": 30,
                        "3rd_place": 20
                    }
                }
            ]
        };

    const allDataString = JSON.stringify(allData);

    // Log the structured data
    console.log("Všechna data:", allData);
    console.log("Spojená data jako řetězec:", allDataString);
    createCamp(allDataString);
    } 


    const handleCampNameChange = (e) => {
        setCampName(e.target.value);
    };

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
        setTeams(newTeams)

        // Initialize child index for each team
        setCurrentChildIndexes(new Array(count).fill(0));
    }

    const handleTeamChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTeams = [...teams];
        updatedTeams[index][name] = value;

        // If children count changes, generate empty strings
        if (name === "childrenCount" && value !== "") {
            const children = Array.from({ length: parseInt(value) }, () => "");
            updatedTeams[index].children = children;
        }

        if (currentChildIndexes[index] >= parseInt(value)) {
            currentChildIndexes[index] = parseInt(value) - 1;
        }

        setTeams(updatedTeams);
        setCurrentChildIndexes([...currentChildIndexes]);
    };

    // Change children name
    const handleChildChange = (teamIndex, childIndex, e) => {
        const { value } = e.target;
        const updatedTeams = [...teams];
        updatedTeams[teamIndex].children[childIndex] = value;

        setTeams(updatedTeams);
    };

    // Arrows swipe handler
    const handleChildFormChange = (teamIndex, direction) => {
        const updatedIndexes = [...currentChildIndexes];
        // Move between children
        if (direction === "next" && updatedIndexes[teamIndex] < teams[teamIndex].children.length - 1) {
            updatedIndexes[teamIndex] = updatedIndexes[teamIndex] + 1;
        } 
        else if (direction === "prev" && updatedIndexes[teamIndex] > 0) {
            updatedIndexes[teamIndex] = updatedIndexes[teamIndex] - 1;
        }
        setCurrentChildIndexes(updatedIndexes);
    };

    // Return page
    return (
        <div className="create-camp-container">
            <h1>tabor.app</h1>
            <hr />
            <h2>Tvorba tábora</h2>
            {/* Create forms */}
            <form onSubmit={handleSubmit}>
                {/* Camp name */}
                <div>
                    <label htmlFor="campName">Název tábora:</label>
                    <input 
                        type="text"
                        id="campName"
                        value={campName}
                        onChange={handleCampNameChange}
                        required
                        placeholder="Název"
                    />
                </div>

                {/* Teams count */}
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
                        <option value="1">DEBUG ONLY 1</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>

                {/* Generate team forms for every team */}
                {teams.map((team, index) => (
                    <div key={index} className="team-form">
                        <h3>Tým {index + 1}</h3>

                        {/* Team name */}
                        <div>
                            <label htmlFor={`teamName-${index}`}>Název týmu:</label>
                            <input
                                type="text"
                                id={`teamName-${index}`}
                                name="name"
                                value={team.name}
                                onChange={(e) => handleTeamChange(index, e)}
                                required
                                placeholder="Název"
                            />
                        </div>

                        {/* Team leader 1 */}
                        <div>
                            <label htmlFor={`leader1-${index}`}>Jméno 1. vedoucího:</label>
                            <input
                                type="text"
                                id={`leader1-${index}`}
                                name="leader1"
                                value={team.leader1}
                                onChange={(e) => handleTeamChange(index, e)}
                                required
                                placeholder="Jméno"
                            />
                        </div>

                        {/* Team leader 2 */}
                        <div>
                            <label htmlFor={`leader2-${index}`}>Jméno 2. vedoucího:</label>
                            <input
                                type="text"
                                id={`leader2-${index}`}
                                name="leader2"
                                value={team.leader2}
                                onChange={(e) => handleTeamChange(index, e)}
                                required
                                placeholder="Jméno"
                            />
                        </div>

                        {/* Team color */}
                        <label htmlFor="teamColor">Barva týmu:</label>
                        <div className="color-picker">
                            {/* Červená     Modrá     Zelená     Žlutá      Černá      Hnědá       Bílá     Fialová*/}
                            {["#FF0000", "#0000FF", "#008000", "#FFFF00", "#000000", "#8B4513", "#FFFFFF", "#800080"].map((color) => (
                                <div
                                key={color}
                                className={`current-color ${team.color === color ? "selected" : ""}`}
                                style={{ backgroundColor: color }}
                                onClick={() => handleTeamChange(index, { target: { name: 'color', value: color } })}
                                />
                            ))}
                        </div>

                        {/* Children count */}
                        <div className="children-count">
                            <label htmlFor={`childrenCount-${index}`}>Počet dětí v týmu:</label>
                            <select
                                id={`childrenCount-${index}`}
                                name="childrenCount"
                                value={team.childrenCount}
                                onChange={(e) => handleTeamChange(index, e)}
                                required
                            >
                                <option value="" disabled hidden>
                                    Počet dětí
                                </option>
                                <option value="1">DEBUG ONLY 1</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                            </select>
                        </div>

                        {/* Children form generation for current child index */}
                        {team.childrenCount > 0 && ( // generate only if childrenCount is specified
                            <div className="child-navigation">
                                <button
                                    className="arrow-btn"
                                    type="button"   // This is mandatory, otherwise every input is
                                                    // required (i don't really know why)
                                    onClick={() => handleChildFormChange(index, "prev")}
                                    disabled={currentChildIndexes[index] === 0}
                                > &lt; 
                                </button>

                                {/* Show only the current child's form */}
                                <div className="child-form">
                                    <div className="child-name-container">
                                        <label htmlFor={`childName-${index}-${currentChildIndexes[index]}`}>
                                            Jméno {currentChildIndexes[index] + 1}. dítěte:
                                        </label>
                                        <input
                                            type="text"
                                            id={`childName-${index}-${currentChildIndexes[index]}`}
                                            name={`children-${index}-${currentChildIndexes[index]}`}
                                            value={team.children[currentChildIndexes[index]]}
                                            onChange={(e) => handleChildChange(index, currentChildIndexes[index], e)}
                                            required
                                            placeholder={`${currentChildIndexes[index] + 1}. jméno`}
                                        />
                                    </div>
                                </div>
                                <button
                                        className="arrow-btn"
                                        type="button"   // This is mandatory, otherwise every input is
                                                        // required (i don't really know why)
                                        onClick={() => handleChildFormChange(index, "next")}
                                        disabled={currentChildIndexes[index] === team.children.length - 1}
                                    > &gt; 
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                
                {/* Submit button */}
                <button className="submitbutton" type="submit">Vytvořit</button>
            </form>

            <img src="/wave.svg" alt="Wave" className="wave-svg"/>
        </div>
    );
};

export default CreateCamp;
