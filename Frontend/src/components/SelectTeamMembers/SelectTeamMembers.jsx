import React, { useState, useEffect } from "react";
import "./SelectTeamMembers.css";

const SelectCampMembers = ({ campData, participants, onSelectionChange, sudilichSelection, setSudilichSelection }) => {
    const [selectedChildren, setSelectedChildren] = useState(participants || []); // Holds names of selected participants
    const [expandedTeams, setExpandedTeams] = useState( // List of expanded content
        Object.fromEntries(campData.teams.map((team) => [team.name, true]))
    );
    const [showSudilich, setShowSudilich] = useState(true); // Control visibility of Sudí/Lišší selection

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
    const handleSudilichChange = (event) => {
        const { id, checked } = event.target;
        setSudilichSelection(prevState => ({
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
                                borderBottomLeftRadius: !isExpanded ? "8px" : "0px",
                                borderBottomRightRadius: !isExpanded ? "8px" : "0px",
                            }}
                        >
                            <span>{team.name}</span>
                            <label>
                            Vybrat všechny
                                <input type="checkbox" checked={allTeamSelected}
                                    onChange={(e) =>
                                        handleSelectAll(team.children, e.target.checked)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </label>
                        </div>

                        {/* Expandable content */}
                        {isExpanded && (
                            <div className="team-content">
                                {team.children.map((child) => (
                                    <div key={child} className="child-item">
                                        <span>{child}</span>
                                        <input
                                            type="checkbox"
                                            value={child}
                                            checked={selectedChildren.includes(child)}
                                            onChange={handleChange}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Sudí/Lišší Card */}
            <div className="team-container">
                <div
                    onClick={() => setShowSudilich(!showSudilich)}
                    className="team-header"
                    style={{
                        borderBottomLeftRadius: !showSudilich ? "8px" : "0px",
                        borderBottomRightRadius: !showSudilich ? "8px" : "0px",
                    }}
                >
                    <span>Sudí / Liší</span>
                </div>

                {/* Sudí / Lišší Content */}
                {showSudilich && (
                    <div className="team-content">
                        <div className="sudilich-selection">
                            <div className="child-item">
                                <span>Sudí</span>
                                <input
                                    type="checkbox"
                                    id="even"
                                    checked={sudilichSelection.even}
                                    onChange={handleSudilichChange}
                                />
                            </div>
                            <div className="child-item">
                                <span>Liší</span>
                                <input
                                    type="checkbox"
                                    id="odd"
                                    checked={sudilichSelection.odd}
                                    onChange={handleSudilichChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectCampMembers;
