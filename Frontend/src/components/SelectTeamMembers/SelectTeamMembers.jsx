import React, { useState, useEffect } from "react";
import "./SelectTeamMembers.css";

const SelectCampMembers = ({ campData, participants, onSelectionChange }) => {
    const [selectedChildren, setSelectedChildren] = useState(participants || []);
    const [expandedTeams, setExpandedTeams] = useState(
        Object.fromEntries(campData.teams.map((team) => [team.name, true]))
    );

    useEffect(() => {
        onSelectionChange(participants);
    }, [selectedChildren]);

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
                const isExpanded = expandedTeams[team.name]; // Check if team is expanded
                return (
                    <div key={team.name} className="team-container">
                        {/* Team Header */}
                        <div
                            onClick={() => toggleTeam(team.name)}
                            className="team-header"
                            style={{
                                borderBottomLeftRadius: !isExpanded ? "8px" : "0px",
                                borderBottomRightRadius: !isExpanded ? "8px" : "0px"
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

                        {/* Expandable Content */}
                        {isExpanded && (
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