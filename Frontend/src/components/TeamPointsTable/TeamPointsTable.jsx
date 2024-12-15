// Author Jan Juračka <xjurac07>

import React, { useEffect, useState } from 'react';
import "./TeamPointsTable.css"

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [dropCount, setDropCount] = useState(0); // Count to refresh the table

    // Give each team number of points acording to points scheme of selected game type
    useEffect(() => {
        // unless it's set to "Vlastní"
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
    }, [gameTypeId, dropCount]); // Refresh the table with gameType changed or after team drag

    // Handle the Drag
    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("dragIndex", index);
    };

    // Handle Drop
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

        // Refresh the table
        setDropCount(dropCount + 1);
    };

    // Handle manual change of the points by user
    const handleManualPointChange = (resultIndex, newPoints) => {
        const updatedResults = [...results];
        updatedResults[resultIndex].points_awarded = newPoints;
        setResults(updatedResults);
        // set point scheme to "Vlastní"
        setGameTypeId(0);
    };

    // Get color of the team from camp data
    const getTeamColor = (teamName) => {
        const team = campData.teams.find((t) => t.name === teamName);
        return team ? team.color : '';
    };

    return (
        <div className='team-table-container'>
            {/* Game type select */}
            <div className='select-game-type'>
                <label>Typ hry</label>
                <select value={gameTypeId} onChange={(e) => setGameTypeId(parseInt(e.target.value, 10))}>
                    <option value={0}>Vlastní</option>
                    {campData.gameTypes.map((type, index) => (
                        <option key={index} value={index + 1}>{type.type}</option>
                    ))}
                </select>
            </div>

            {/* Team Points Table */}
            <label>Upravte pozice týmů přetažením</label>
            <table className="team-table">
                <thead>
                    <tr>
                        <th>Umístění</th>
                        <th>Tým</th>
                        <th>Body</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((result, index) => (
                        // Row
                        <tr
                            key={result.team_name}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            {/* Position */}
                            <td className="team-position">{result.position}</td>
                            {/* Name of the team with its colour as background */}
                            <td className="team-info" >
                                <div className="team-name" style={{ backgroundColor: getTeamColor(result.team_name) }}>
                                    <span className="name">{result.team_name}</span>
                                </div>
                            </td>
                            {/* Points */}
                            <td>
                                <input
                                    type="number"
                                    className="points-input"
                                    value={result.points_awarded}
                                    onChange={(e) => handleManualPointChange(index, parseFloat(e.target.value) || 0)}
                                    min={0}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TeamPointsTable;