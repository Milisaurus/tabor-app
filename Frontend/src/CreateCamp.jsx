import React, { useState } from "react";
import "./css/CreateCamp.css"

const CreateCamp = () => {
    const [campName, setCampName] = useState("");
    const [teamCount, setTeamCount] = useState("");
    const [teams, setTeams] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Hold inputs after submitting 
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
            childenCount: 0,
            children: [],
        }));
        setTeams(newTeams)
    }

    const handleTeamChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTeams = [...teams];
        updatedTeams[index][name] = value;

        // If children count changes, generate empty strings
        if (name === "childrenCount") {
            const children = Array.from({ length: parseInt(value) }, () => "");
            updatedTeams[index].children = children;
        }

        setTeams(updatedTeams);
    };

    // Change children name
    const handleChildChange = (teamIndex, childIndex, e) => {
        const { value } = e.target;
        const updatedTeams = [...teams];
        updatedTeams[teamIndex].children[childIndex] = value;
        setTeams(updatedTeams);
    };


    return (
        <div className="create-camp-container">
            <h1>Tvorba tábora</h1>
            <hr />
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
                            <label htmlFor={`teamName-${index}`}>Název týmů:</label>
                            <input
                                type="text"
                                id={`teamName-${index}`}
                                value={team.name}
                                onChange={(e) => handleTeamChange(index, e)}
                                required
                                placeholder="Název"
                            />
                        </div>

                        {/* Team color */}
                        <div>
                            <label htmlFor={`teamColor-${index}`}>Barva týmu:</label>
                            <input
                                type="text"
                                id={`teamColor-${index}`}
                                name="color"
                                value={team.color}
                                onChange={(e) => handleTeamChange(index, e)}
                                required
                                placeholder="Barva"
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
                                value={team.leader1}
                                onChange={(e) => handleTeamChange(index, e)}
                                required
                                placeholder="Jméno"
                            />
                        </div>
                        {/* Children count */}
                        
                        <div>
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
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="6">7</option>
                                <option value="6">8</option>
                            </select>
                        </div>
                        {/* Children form generation for every children */}
                        {team.children.map((child, childIndex) => (
                            <div key={childIndex} className="child-form">
                                <label htmlFor={`childName-${index}-${childIndex}`}>
                                    Název dítěte {childIndex + 1}:
                                </label>
                                <input
                                    type="text"
                                    id={`childName-${index}-${childIndex}`}
                                    name={`children-${index}-${childIndex}`}
                                    value={child}
                                    onChange={(e) => handleChildChange(index, childIndex, e)}
                                    required
                                    placeholder={`${childIndex + 1}. jméno`}
                                />
                            </div>
                        ))}
                    </div>
                ))}
                {/* Submit button */}
                <button type="submit">Vytvořit</button>
            </form>
        </div>
    );
};

export default CreateCamp;
