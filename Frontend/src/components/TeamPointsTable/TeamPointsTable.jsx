import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, gameTypeId, setGameTypeId }) => {
    const [positions, setPositions] = useState(
        Array(campData.teams.length).fill(null).map(() => []) // Empty positions
    );
    const [unassignedTeams, setUnassignedTeams] = useState([...campData.teams]);
    const [gamePoints, setGamePoints] = useState([]);

    // Set points for teams based on selected game type
    useEffect(() => {
        if (gameTypeId === 0) return;

        const gameTypeData = campData.gameTypes[gameTypeId - 1];
        if (!gameTypeData) return;

        const { point_scheme } = gameTypeData;
        const updatedTeams = campData.teams.map((team, index) => {
            const points = index < point_scheme.length ? point_scheme[index] : 0;
            return { ...team, points_awarded: points };
        });
        setGamePoints(updatedTeams);
    }, [gameTypeId, campData]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const updatedPositions = [...positions];
        const updatedUnassigned = [...unassignedTeams];

        // Dragging from the pool to a position
        if (source.droppableId === "pool" && destination.droppableId.startsWith("pos-")) {
            const destIndex = parseInt(destination.droppableId.split("-")[1], 10);
            const [movedTeam] = updatedUnassigned.splice(source.index, 1);
            updatedPositions[destIndex].splice(destination.index, 0, movedTeam);
        }

        // Dragging between positions
        else if (source.droppableId.startsWith("pos-") && destination.droppableId.startsWith("pos-")) {
            const sourceIndex = parseInt(source.droppableId.split("-")[1], 10);
            const destIndex = parseInt(destination.droppableId.split("-")[1], 10);
            const [movedTeam] = updatedPositions[sourceIndex].splice(source.index, 1);
            updatedPositions[destIndex].splice(destination.index, 0, movedTeam);
        }

        // Dragging back from a position to the pool
        else if (source.droppableId.startsWith("pos-") && destination.droppableId === "pool") {
            const sourceIndex = parseInt(source.droppableId.split("-")[1], 10);
            const [movedTeam] = updatedPositions[sourceIndex].splice(source.index, 1);
            updatedUnassigned.splice(destination.index, 0, movedTeam);
        }

        setPositions(updatedPositions);
        setUnassignedTeams(updatedUnassigned);
    };

    return (
        <div className="team-points-table">
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
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Pool for unassigned teams */}
                <div className="team-pool">
                    <h3>Nepřiřazené týmy</h3>
                    <Droppable droppableId="pool">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="pool-container"
                            >
                                {unassignedTeams.map((team, index) => (
                                    <Draggable key={team.name} draggableId={team.name} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="team-card"
                                                style={{ backgroundColor: team.color }}
                                            >
                                                {team.name} - {gamePoints.find((item) => item.name === team.name)?.points_awarded || 0} bodů
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                {/* Position Slots */}
                <div className="positions-container">
                    {positions.map((teams, posIndex) => (
                        <Droppable droppableId={`pos-${posIndex}`} key={`pos-${posIndex}`}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="position-slot"
                                >
                                    <div className="position-label">{posIndex + 1}.</div>
                                    {teams.map((team, index) => (
                                        <Draggable key={team.name} draggableId={team.name} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="team-card"
                                                    style={{
                                                        backgroundColor: team.color,
                                                    }}
                                                >
                                                    {team.name} - {gamePoints.find((item) => item.name === team.name)?.points_awarded || 0} bodů
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default TeamPointsTable;
