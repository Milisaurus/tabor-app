import React from "react";
import "./TeamFormEdit.css";

import Heading from "../Heading/Heading";

const TeamFormEdit = ({ 
    index, 
    team, 
    handleTeamChange, 
    handleChildChange, 
    handleAddChild, 
    handleRemoveChild 
}) => {
    return (
        <div className="team-form">
            {/* Team Name */}
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

            {/* Team Leaders */}
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

            {/* Team Color */}
            <label htmlFor="teamColor">Barva týmu:</label>
            <div className="color-picker">
                {/* Červená,   Modrá,     Zelená,    Zlatá,     Černá,     Hnědá,     Oranžová,  Fialová. */}
                {["#FF0000", "#0000FF", "#008000", "#FFCC00", "#000000", "#8B4513", "#FFA500", "#800080"].map((color) => (
                    <div
                        key={color}
                        className={`current-color ${team.color === color ? "selected" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleTeamChange(index, { target: { name: "color", value: color } })}
                    />
                ))}
            </div>

            {/* Children Management */}
            <Heading text="Úprava informací o týmech" level={4} className="nadpish1" />
            <div className="children-list">
                {team.children.map((child, childIndex) => (
                    <div key={childIndex} className="child-item">
                        <input
                            type="text"
                            value={child}
                            onChange={(e) => handleChildChange(childIndex, e)}
                            placeholder={`Dítě ${childIndex + 1}`}
                            required
                        />
                        <img
                            src="/recycle-bin.png"
                            alt="Odebrat dítě"
                            className="icon remove-child-icon"
                            onClick={() => handleRemoveChild(childIndex)}
                        />
                    </div>
                ))}
            </div>

            <div className="add-child-container">
                <img
                    src="/plus.png"
                    alt="Přidat dítě"
                    className="icon add-child-icon"
                    onClick={handleAddChild}
                />
            </div>
        </div>
    );
};

export default TeamFormEdit;
