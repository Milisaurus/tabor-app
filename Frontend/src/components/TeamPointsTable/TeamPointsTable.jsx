import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [positionZones, setPositionZones] = useState({}); // Zóny pro jednotlivé pozice
    const [dropCount, setDropCount] = useState(0);

    useEffect(() => {
        // Inicializace zón na základě aktuálních výsledků
        const initialZones = {};
        results.forEach((result) => {
            if (!initialZones[result.position]) {
                initialZones[result.position] = [];
            }
            initialZones[result.position].push(result);
        });

        setPositionZones(initialZones);
    }, [results]);

    useEffect(() => {
        if (gameTypeId === 0) return;

        const updateResultsPoints = () => {
            const gameTypeData = campData.gameTypes[gameTypeId - 1];
            if (!gameTypeData) return;

            const { point_scheme, everyone_else } = gameTypeData;
            const updatedResults = Object.entries(positionZones).flatMap(([position, teams]) =>
                teams.map((team) => {
                    const points = position - 1 < point_scheme.length ? point_scheme[position - 1] : everyone_else;
                    return { ...team, points_awarded: points };
                })
            );

            setResults(updatedResults);
        };

        updateResultsPoints();
    }, [positionZones, gameTypeId]);

    const handleDragEnd = (result) => {
        const { source, destination } = result;

        // Pokud tým není přetažen do platné zóny, nic nedělej
        if (!destination) return;

        const sourcePosition = source.droppableId;
        const destinationPosition = destination.droppableId;

        const sourceTeams = Array.from(positionZones[sourcePosition] || []);
        const destinationTeams = Array.from(positionZones[destinationPosition] || []);

        const [movedTeam] = sourceTeams.splice(source.index, 1);

        // Přidání týmu do cílové zóny
        destinationTeams.splice(destination.index, 0, movedTeam);

        setPositionZones({
            ...positionZones,
            [sourcePosition]: sourceTeams,
            [destinationPosition]: destinationTeams,
        });

        setDropCount(dropCount + 1);
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

            <DragDropContext onDragEnd={handleDragEnd}>
                {Array.from({ length: 5 }).map((_, i) => {
                    const position = i + 1; // 1-based index
                    const teamsInZone = positionZones[position] || [];

                    return (
                        <div key={position} className="position-zone">
    <h3>{position}. místo</h3>
    <Droppable droppableId={`${position}`}>
        {(provided) => (
            <ul
                className="team-list"
                ref={provided.innerRef}
                {...provided.droppableProps}
            >
                {teamsInZone.map((team, index) => (
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
                                {/* Zobrazení názvu týmu a bodů */}
                                <div className="team-info">
                                    <span className="team-name">{team.team_name}</span>
                                    <span className="team-points">
                                        {team.points_awarded} bodů
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

                    );
                })}
            </DragDropContext>
        </div>
    );
};

export default TeamPointsTable;
