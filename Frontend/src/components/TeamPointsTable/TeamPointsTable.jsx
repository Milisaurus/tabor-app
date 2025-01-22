// Author Jan Juračka <xjurac07>

import React, { useEffect, useState } from 'react';
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [dropCount, setDropCount] = useState(0);

    // Update results based on game type
    useEffect(() => {
        if (gameTypeId === 0) return;

        const updateResultsBasedOnPositions = (gameTypeId) => {
            const gameTypeData = campData.gameTypes[gameTypeId - 1];
            if (!gameTypeData) return;

            const { point_scheme, everyone_else } = gameTypeData;
            const updatedResults = results.map((result, index) => {
                const points = index < point_scheme.length ? point_scheme[index] : everyone_else;
                return { ...result, points_awarded: points };
            });

            setResults(updatedResults);
        };

        if (gameTypeId !== null && gameTypeId !== 0) {
            updateResultsBasedOnPositions(gameTypeId);
        }
    }, [gameTypeId, dropCount]);

    // Drag-and-drop handlers
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("dragIndex", index);
    };

    const handleDrop = (e, dropIndex) => {
        const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);
        const updatedResults = [...results];
        const draggedResult = updatedResults[dragIndex];
        updatedResults.splice(dragIndex, 1);
        updatedResults.splice(dropIndex, 0, draggedResult);

        updatedResults.forEach((result, idx) => {
            result.position = idx + 1;
        });

        setResults(updatedResults);
        setDropCount(dropCount + 1);
    };

    const handleManualPointChange = (resultIndex, newPoints) => {
        const updatedResults = [...results];
        updatedResults[resultIndex].points_awarded = newPoints;
        setResults(updatedResults);
        setGameTypeId(0);
    };

    const getTeamColor = (teamName) => {
        const team = campData.teams.find((t) => t.name === teamName);
        return team ? team.color : '';
    };

    return (
        <div className="team-list-container">
            <div className="select-game-type">
                <label>Typ hry</label>
                <select value={gameTypeId} onChange={(e) => setGameTypeId(parseInt(e.target.value, 10))}>
                    <option value={0}>Vlastní</option>
                    {campData.gameTypes.map((type, index) => (
                        <option key={index} value={index + 1}>{type.type}</option>
                    ))}
                </select>
            </div>

            <label>Upravte pořadí týmů přetažením</label>

            {/* Drag-and-drop list */}
            <ul className="team-list">
                {results.map((result, index) => (
                    <li
                        key={result.team_name}
                        className="team-list-item"
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        <div className="team-info">
                            <span className="team-position">{result.position}.</span>
                            <div className="team-name" style={{ backgroundColor: getTeamColor(result.team_name) }}>
                                {result.team_name}
                            </div>
                        </div>
                        <input
                            type="number"
                            className="points-input"
                            value={result.points_awarded}
                            onChange={(e) => handleManualPointChange(index, parseFloat(e.target.value) || 0)}
                            min={0}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TeamPointsTable;
