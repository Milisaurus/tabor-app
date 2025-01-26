import React, { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData }) => {
    // Stav pro pozice týmů
    const [positions, setPositions] = useState(
        Array(campData.teams.length).fill(null).map(() => []) // Prázdné pozice
    );
    // Stav pro "pool" týmů (nepřiřazené týmy)
    const [unassignedTeams, setUnassignedTeams] = useState([...campData.teams]);

    const handleDragEnd = useCallback((result) => {
        const { source, destination } = result;
        
        if (!destination) return; // Do nothing if item is dropped outside the valid area
    
        const updatedPositions = [...positions];
        const updatedUnassigned = [...unassignedTeams];
    
        try {
            if (source.droppableId === "pool" && destination.droppableId.startsWith("pos-")) {
                const destIndex = parseInt(destination.droppableId.split("-")[1], 10);
                const [movedTeam] = updatedUnassigned.splice(source.index, 1);
                updatedPositions[destIndex].splice(destination.index, 0, movedTeam);
            } 
            else if (source.droppableId.startsWith("pos-") && destination.droppableId.startsWith("pos-")) {
                const sourceIndex = parseInt(source.droppableId.split("-")[1], 10);
                const destIndex = parseInt(destination.droppableId.split("-")[1], 10);
                const [movedTeam] = updatedPositions[sourceIndex].splice(source.index, 1);
                updatedPositions[destIndex].splice(destination.index, 0, movedTeam);
            } 
            else if (source.droppableId.startsWith("pos-") && destination.droppableId === "pool") {
                const sourceIndex = parseInt(source.droppableId.split("-")[1], 10);
                const [movedTeam] = updatedPositions[sourceIndex].splice(source.index, 1);
                updatedUnassigned.splice(destination.index, 0, movedTeam);
            }
    
            setPositions(updatedPositions);
            setUnassignedTeams(updatedUnassigned);
        } catch (error) {
            console.error('Error in handleDragEnd:', error);
        }
    }, [positions, unassignedTeams]);
    

    return (
        <div className="team-points-table">
            <DragDropContext onDragEnd={handleDragEnd}>
                {/* Pool pro nepřiřazené týmy */}
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
                                                {team.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>

                {/* Poziční sloty */}
                <div className="positions-container">
                    {positions.map((teams, posIndex) => (
                        <Droppable droppableId={`pos-${posIndex}`} key={`pos-${posIndex}`}>
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`position-slot ${snapshot.isDraggingOver ? 'highlight' : ''}`}
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
                                                {team.name}
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
