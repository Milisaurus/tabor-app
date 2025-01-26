import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [positions, setPositions] = useState(results.map((_, index) => index + 1)); // Inicializace pozic

    useEffect(() => {
        if (gameTypeId === 0) return;

        const updateResultsBasedOnPositions = (gameTypeId) => {
            const gameTypeData = campData.gameTypes[gameTypeId - 1];
            if (!gameTypeData) return;

            const { point_scheme, everyone_else } = gameTypeData;
            const updatedResults = results.map((result, index) => {
                const position = positions.indexOf(index + 1);
                const points = position < point_scheme.length ? point_scheme[position] : everyone_else;
                return { ...result, points_awarded: points };
            });

            setResults(updatedResults);
        };

        if (gameTypeId !== null && gameTypeId !== 0) {
            updateResultsBasedOnPositions(gameTypeId);
        }
    }, [gameTypeId, positions]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const updatedPositions = Array.from(positions);
        const [movedPosition] = updatedPositions.splice(result.source.index, 1);
        updatedPositions.splice(result.destination.index, 0, movedPosition);

        setPositions(updatedPositions);
    };

    const handleManualPointChange = (index, newPoints) => {
        const updatedResults = [...results];
        updatedResults[index].points_awarded = newPoints;
        setResults(updatedResults);
        setGameTypeId(0);
    };

    const getTeamColor = (teamName) => {
        const team = campData.teams.find((t) => t.name === teamName);
        return team ? team.color : "";
    };

    return (
        <div className="team-table-container">
            <div className="select-game-type">
                <label>Typ hry</label>
                <select value={gameTypeId} onChange={(e) => setGameTypeId(parseInt(e.target.value, 10))}>
                    <option value={0}>Vlastní</option>
                    {campData.gameTypes.map((type, index) => (
                        <option key={index} value={index + 1}>
                            {type.type}
                        </option>
                    ))}
                </select>
            </div>

            <div className="team-drag-label">
                <label>Upravte pořadí týmů přetažením</label>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="teamList">
                    {(provided) => (
                        <ul className="team-list" ref={provided.innerRef} {...provided.droppableProps}>
                            {positions.map((pos, index) => {
                                const teamIndex = pos - 1;
                                const team = results[teamIndex];

                                return (
                                    <Draggable key={team.team_name} draggableId={team.team_name} index={index}>
                                        {(provided) => (
                                            <li
                                                className="team-item"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                {/* Position */}
                                                <div className="team-position">{index + 1}.</div>

                                                {/* Team name */}
                                                <div
                                                    className="team-name"
                                                    style={{ backgroundColor: getTeamColor(team.team_name) }}
                                                >
                                                    {team.team_name}
                                                </div>

                                                {/* Points */}
                                                <div>
                                                    <input
                                                        type="number"
                                                        className="points-input"
                                                        value={team.points_awarded}
                                                        onChange={(e) =>
                                                            handleManualPointChange(teamIndex, parseFloat(e.target.value) || 0)
                                                        }
                                                        min={0}
                                                    />
                                                </div>
                                            </li>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default TeamPointsTable;
