import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [positionBuckets, setPositionBuckets] = useState(() =>
        Array.from({ length: 5 }, (_, index) => ({
            position: index + 1,
            teams: [],
        }))
    );

    useEffect(() => {
        if (results.length > 0) {
            const initialBuckets = positionBuckets.map((bucket) => ({
                ...bucket,
                teams: results.filter((team) => team.position === bucket.position),
            }));
            setPositionBuckets(initialBuckets);
        }
    }, [results]);

    useEffect(() => {
        const updatePointsBasedOnPosition = () => {
            if (gameTypeId === 0) return;

            const gameTypeData = campData.gameTypes[gameTypeId - 1];
            if (!gameTypeData) return;

            const { point_scheme, everyone_else } = gameTypeData;
            const updatedResults = [...results];

            positionBuckets.forEach((bucket, index) => {
                bucket.teams.forEach((team) => {
                    const points = index < point_scheme.length ? point_scheme[index] : everyone_else;
                    const teamIndex = updatedResults.findIndex((r) => r.team_name === team.team_name);
                    if (teamIndex !== -1) {
                        updatedResults[teamIndex].points_awarded = points;
                    }
                });
            });

            setResults(updatedResults);
        };

        updatePointsBasedOnPosition();
    }, [gameTypeId, positionBuckets, results, campData.gameTypes]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const sourcePos = parseInt(result.source.droppableId.split("-")[1], 10);
        const destPos = parseInt(result.destination.droppableId.split("-")[1], 10);

        const sourceBucket = positionBuckets.find((bucket) => bucket.position === sourcePos);
        const destBucket = positionBuckets.find((bucket) => bucket.position === destPos);

        if (!sourceBucket || !destBucket) return;

        const draggedTeamIndex = sourceBucket.teams.findIndex(
            (team) => team.team_name === result.draggableId
        );
        const [draggedTeam] = sourceBucket.teams.splice(draggedTeamIndex, 1);

        destBucket.teams.push(draggedTeam);
        setPositionBuckets([...positionBuckets]);

        const updatedResults = results.map((team) => {
            if (team.team_name === draggedTeam.team_name) {
                return { ...team, position: destPos };
            }
            return team;
        });
        setResults(updatedResults);
    };

    const getTeamColor = (teamName) => {
        const team = campData.teams.find((t) => t.name === teamName);
        return team ? team.color : "";
    };

    return (
        <div className="team-table-container">
            <div className="select-game-type">
                <label htmlFor="gameTypeSlider">Typ hry:</label>
                <input
                    id="gameTypeSlider"
                    type="range"
                    min="0"
                    max={campData.gameTypes.length}
                    value={gameTypeId}
                    onChange={(e) => setGameTypeId(parseInt(e.target.value, 10))}
                    className="slider"
                />
                <div>
                    {gameTypeId === 0
                        ? "Vlastní"
                        : campData.gameTypes[gameTypeId - 1]?.type || ""}
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="position-buckets">
                    {positionBuckets.map((bucket) => (
                        <Droppable key={bucket.position} droppableId={`position-${bucket.position}`}>
                            {(provided) => (
                                <div className="position-bucket" ref={provided.innerRef} {...provided.droppableProps}>
                                    <h4>{bucket.position}.</h4>
                                    <ul className="team-list">
                                        {bucket.teams.map((team, index) => (
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
                                                            backgroundColor: getTeamColor(team.team_name),
                                                            ...provided.draggableProps.style,
                                                        }}
                                                    >
                                                        <div className="team-name">{team.team_name}</div>
                                                        <div className="team-points">
                                                            {team.points_awarded || 0} bodů
                                                        </div>
                                                    </li>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </ul>
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
