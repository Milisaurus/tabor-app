import React, { useState } from "react";
import "./SelectTeamMembers.css";

const SelectCampMembers = ({ campData, onSelectionChange }) => {
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [expandedTeams, setExpandedTeams] = useState(
        Object.fromEntries(campData.teams.map((team) => [team.name, true]))
    );

    const toggleTeam = (teamName) => {
        setExpandedTeams((prev) => ({
            ...prev,
            [teamName]: !prev[teamName],
        }));
    };

    const handleChange = (event) => {
        const { value, checked } = event.target;
        const updatedSelection = checked
            ? [...selectedChildren, value]
            : selectedChildren.filter((child) => child !== value);

        setSelectedChildren(updatedSelection);
        onSelectionChange(updatedSelection);
    };

    const handleSelectAll = (teamChildren, isChecked) => {
        const updatedSelection = isChecked
            ? [...new Set([...selectedChildren, ...teamChildren])]
            : selectedChildren.filter((child) => !teamChildren.includes(child));

        setSelectedChildren(updatedSelection);
        onSelectionChange(updatedSelection);
    };

    return (
        <div className="member_selector">
            {campData.teams.map((team) => {
                const allTeamSelected = team.children.every((child) =>
                    selectedChildren.includes(child)
                );
                return (
                    <div key={team.name} className="team-container">
                        {/* Team Header */}
                        <div
                            onClick={() => toggleTeam(team.name)}
                            className="team-header"
                            style={{ backgroundColor: team.color }}
                        >
                            <span>{team.name}</span>
                            <label>
                                Select all
                                <input type="checkbox" checked={allTeamSelected}
                                    onChange={(e) =>
                                        handleSelectAll(team.children, e.target.checked)
                                    }
                                    onClick={(e) => e.stopPropagation()} // Prevent toggle on checkbox click
                                />
                            </label>
                        </div>

                        {/* Expandable Content */}
                        {expandedTeams[team.name] && (
                            <div className="team-content">
                                {team.children.map((child) => (
                                    <div key={child} className="child-item">
                                        <span>{child}</span>
                                        <input type="checkbox" value={child} checked={selectedChildren.includes(child)} onChange={handleChange}/>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default SelectCampMembers;