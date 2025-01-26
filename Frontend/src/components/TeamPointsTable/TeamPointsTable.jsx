import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [rankZones, setRankZones] = useState({}); // Zóny pro jednotlivá pořadí

    useEffect(() => {
        // Inicializace zón s prázdnými pozicemi
        const initialZones = {};
        Array.from({ length: 5 }).forEach((_, i) => {
            initialZones[i + 1] = []; // 1-based index
        });
        results.forEach((team) => {
            const position = team.position || 1; // Výchozí pozice
            if (!initialZones[position]) {
                initialZones[position] = [];
            }
            initialZones[position].push(team);
        });

        setRankZones(initialZones);
    }, [results]);

    useEffect(() => {
        if (gameTypeId === 0) return;

        const updateResultsPoints = () => {
            const gameTypeData = campData.gameTypes[gameTypeId - 1];
            if (!gameTypeData) return;

            const { point_scheme, everyone_else } = gameTypeData;
            const updatedResults = Object.entries(rankZones).flatMap(([rank, teams]) =>
                teams.map((team) => {
                    const points =
                        rank - 1 < point_scheme.length ? point_scheme[rank - 1] : everyone_else;
                    return { ...team, points_awarded: points };
                })
            );

            setResults(updatedResults);
        };

        updateResultsPoints();
    }, [rankZones, gameTypeId]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const sourceRank = source.droppableId;
        const destinationRank = destination.droppableId;

        const sourceTeams = Array.from(rankZones[sourceRank] || []);
        const destinationTeams = Array.from(rankZones[destinationRank] || []);

        const [movedTeam] = sourceTeams.splice(source.index, 1);
        destinationTeams.splice(destination.index, 0, movedTeam);

        setRankZones({
            ...rankZones,
            [sourceRank]: sourceTeams,
            [destinationRank]: destinationTeams,
        });
    };

    return (
        <div className="team-table-container">
            <div className="select-game-type">
                <label>Typ hry</label>
                <select
                    value={gameTypeId}
                    onChange={(e) => setGameTypeId(parseInt(e.target.value, 10))}
                >
                    <option value={0}>Vlastní</option>
                    {campData.gameTypes.map((type, index) => (
                        <option key={index} value={index + 1}>
                            {type.type}
                        </option>
                    ))}
                </select>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="rank-zones">
                    {Object.entries(rankZones).map(([rank, teams]) => (
                        <div key={rank} className="rank-zone">
                            <h3>{rank}. místo</h3>
                            <Droppable droppableId={rank}>
                                {(provided) => (
                                    <ul
                                        className="team-list"
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {teams.map((team, index) => (
                                            <Draggable
                                                key={team.team_name}
                                                draggableId={team.team_name}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <li
                                                        className="team-item"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            backgroundColor: campData.teams.find(
                                                                (t) => t.name === team.team_name
                                                            )?.color,
                                                        }}
                                                    >
                                                        <div className="team-info">
                                                            <span className="team-name">{team.team_name}</span>
                                                            <span className="team-points">
                                                                {team.points_awarded || 0} bodů
                                                            </span>
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default TeamPointsTable;
