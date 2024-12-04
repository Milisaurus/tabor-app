import React from "react";
import "./TeamForm.css"

const TeamForm = ({ index, team, currentChildIndex, handleTeamChange, handleChildChange, handleChildFormChange }) => {
    return (
        <div className="team-form">
            <h3>Tým {index + 1}</h3>
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
                {["#FF0000", "#0000FF", "#008000", "#FFFF00", "#000000", "#8B4513", "#FFA500", "#800080"].map((color) => (
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
                    <option value="" disabled hidden>Počet dětí</option>
                    <option value="1">DEBUG ONLY 1</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                </select>
            </div>

            {/* Children form generation */}
            {team.childrenCount > 0 && (
                <div className="child-navigation">
                    <button
                        className="arrow-btn"
                        type="button"
                        onClick={() => handleChildFormChange(index, "prev")}
                        disabled={currentChildIndex === 0}
                    >
                        &lt;
                    </button>

                    <div className="child-form">
                        <label htmlFor={`child-${index}-${currentChildIndex}`}>Jméno {currentChildIndex + 1}. dítěte:</label>
                        <input
                            type="text"
                            id={`child-${index}-${currentChildIndex}`}
                            value={team.children[currentChildIndex]}
                            onChange={(e) => handleChildChange(index, currentChildIndex, e)}
                            placeholder="Jméno"
                            required
                        />
                    </div>

                    <button
                        className="arrow-btn"
                        type="button"
                        onClick={() => handleChildFormChange(index, "next")}
                        disabled={currentChildIndex === team.childrenCount - 1}
                    >
                        &gt;
                    </button>
                </div>
            )}
        </div>
    );
};

export default TeamForm;
