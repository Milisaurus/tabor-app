import React, { useState, useEffect } from "react";
import "./SelectTeamMembers.css";

const SelectCampMembers = ({ campData, participants, onSelectionChange, oddEvenSelection, setoddEvenSelection }) => {
    const [selectedChildren, setSelectedChildren] = useState(participants || []); // Holds names of selected participants
    const [expandedTeams, setExpandedTeams] = useState( // List of expanded content
        Object.fromEntries(campData.teams.map((team) => [team.name, true]))
    );
    const [showoddEven, setShowoddEven] = useState(true); // Control visibility of Sudí/Lišší selection

    useEffect(() => {
        onSelectionChange(selectedChildren);
    }, [selectedChildren]);

    const toggleTeam = (teamName) => {
        setExpandedTeams((prev) => ({
            ...prev,
            [teamName]: !prev[teamName],
        }));
    };

    // Handle change of participants in teams
    const handleChange = (oddt) => {
        const { value, checked } = oddt.target;
        const updatedSelection = checked
            ? [...selectedChildren, value]
            : selectedChildren.filter((child) => child !== value);

        setSelectedChildren(updatedSelection);
        onSelectionChange(updatedSelection);
    };

    // Upravím ošetření change pro Sudí / Liší
    const handleoddEvenChange = (event) => {
        const { id, checked } = event.target;
        setoddEvenSelection(prevState => ({
            ...prevState,
            [id]: checked
        }));
    };

        // Handle select all check box in team header
        const handleSelectAll = (teamChildren, isChecked) => {
            const updatedSelection = isChecked
                ? [...new Set([...selectedChildren, ...teamChildren])]
                : selectedChildren.filter((child) => !teamChildren.includes(child));
    
            setSelectedChildren(updatedSelection);
            onSelectionChange(updatedSelection);
        };
    
        const getTextColor = (bgColor) => {
        if (!bgColor) return "#ffffff";
            
        // Převedeme HEX na RGB
        const hex = bgColor.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        // Vypočítáme jas barvy (luminance formula)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
        return brightness > 125 ? "#000000" : "#ffffff";
    };
        

    return (
        <div className="member_selector">
            {/* Teams */}
            {campData.teams.map((team) => {
                const allTeamSelected = team.children.every((child) =>
                    selectedChildren.includes(child)
                );
                const isExpanded = expandedTeams[team.name];
                return (
                    <div key={team.name} className="team-container">
                        <div
                            onClick={() => toggleTeam(team.name)}
                            className="team-header"
                            style={{
                                color: getTextColor(team.color),
                                borderBottomLeftRadius: !isExpanded ? "8px" : "0px",
                                borderBottomRightRadius: !isExpanded ? "8px" : "0px",
                                backgroundColor: team.color,
                            }}
                        >
                            <span>{team.name}</span>
                            <label>
                                Vybrat všechny
                                <input
                                    type="checkbox"
                                    className="custom-checkbox-select-all"
                                    checked={allTeamSelected}
                                    onChange={(e) =>
                                        handleSelectAll(team.children, e.target.checked)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    style={{
                                        "--team-color": team.color, // Použití barvy týmu
                                        "--checkbox-fill": getTextColor(team.color), // Určí barvu výplně checkboxu
                                    }}
                                />
                            </label>

                        </div>
                        {/* Expandable content */}
                        <div className={`team-content ${isExpanded ? "open" : ""}`}>
                        {team.children.map((child) => (
                            <div key={child} className="child-item">
                            <span>{child}</span>
                            <input
                                type="checkbox"
                                value={child}
                                className="custom-checkbox"
                                style={{
                                    "--team-color": team.color, // Použití CSS proměnné
                                    border: `2px solid ${team.color}`
                                }}
                                checked={selectedChildren.includes(child)}
                                onChange={handleChange}
                            />
                            </div>
                        ))}
                        </div>
                    </div>
                );
            })}

            {/* Sudí/Lišší Card */}
            <div className="team-container">
                <div
                    onClick={() => setShowoddEven(!showoddEven)}
                    className="team-header"
                    style={{
                        borderBottomLeftRadius: !showoddEven ? "8px" : "0px",
                        borderBottomRightRadius: !showoddEven ? "8px" : "0px",
                    }}
                >
                    <span>Sudí / Liší</span>
                </div>

                {/* Sudí / Lišší Content */}
                <div className={`team-content ${showoddEven ? "open" : ""}`}>
                    <div className="oddEven-selection">
                        <div className="child-item">
                            <span>Sudí</span>
                            <input
                                type="checkbox"
                                className="custom-checkbox-odd-even"
                                id="even"
                                checked={oddEvenSelection.even}
                                onChange={handleoddEvenChange}
                            />
                        </div>
                        <div className="child-item">
                            <span>Liší</span>
                            <input
                                type="checkbox"
                                id="odd"
                                className="custom-checkbox-odd-even"
                                checked={oddEvenSelection.odd}
                                onChange={handleoddEvenChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectCampMembers;
