import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Heading from "../Heading/Heading";

import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [dropCount, setDropCount] = useState(0); // Count to refresh the table
    const [positionBuckets, setPositionBuckets] = useState(() =>
        Array.from({ length: campData.teamCount }, (_, index) => ({
            position: index + 1,
            teams: [],
        }))
    );

    // Synchronizace pozic s výsledky při každé změně typu hry nebo výsledků
    useEffect(() => {
        const initializeBuckets = () => {
            const newBuckets = positionBuckets.map((bucket) => ({
                ...bucket,
                teams: results.filter((team) => team.position === bucket.position),
            }));
            setPositionBuckets(newBuckets);
        };
        initializeBuckets();
    }, [results]);

    // Aktualizace bodového systému při změně typu hry
    useEffect(() => {
        if (gameTypeId === 0) return; // Vlastní bodování

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
    }, [gameTypeId, dropCount]);

    // Logika pro přetažení
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

        // Aktualizace výsledků bez resetování bodů
        const updatedResults = results.map((team) => {
            if (team.team_name === draggedTeam.team_name) {
                return { ...team, position: destPos };
            }
            return team;
        });
        setResults(updatedResults);

        setDropCount(dropCount + 1);
    };

    // Barva týmu podle JSON dat
    const getTeamColor = (teamName) => {
        const team = campData.teams.find((t) => t.name === teamName);
        return team ? team.color : "";
    };

     // Funkce pro aktualizaci bodů při změně v inputu
     const handlePointsChange = (teamName, points) => {
        const updatedResults = results.map((team) => {
            if (team.team_name === teamName) {
                return { ...team, points_awarded: parseInt(points, 10) || 0 };
            }
            return team;
        });

        setGameTypeId(0);
        setResults(updatedResults);
    };


    return (
        <div className="team-table-container">
            <div className="select-game-type">
                <label htmlFor="gameTypeSlider">
                    Typ bodování: {gameTypeId === 0
                        ? "Vlastní"
                        : campData.gameTypes[gameTypeId - 1]?.type || ""}
                </label>
                <input
                    id="gameTypeSlider"
                    type="range"
                    min="0"
                    max={campData.gameTypes.length}
                    value={gameTypeId}
                    onChange={(e) => setGameTypeId(parseInt(e.target.value, 10))}
                />
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="position-buckets">
                    {positionBuckets.map((bucket) => (
                        <Droppable key={bucket.position} droppableId={`position-${bucket.position}`}>
                            {(provided) => (
                                <div className="position-bucket" ref={provided.innerRef} {...provided.droppableProps}>
                                    <h4>{bucket.position}. místo</h4>
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
                                                            <input
                                                                type="number"
                                                                inputMode="numeric"
                                                                onInput={(e) => {
                                                                    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                                                }}
                                                                min={0}
                                                                className="team-points-input"
                                                                value={team.points_awarded !== undefined && 
                                                                    team.points_awarded !== null 
                                                                    ? team.points_awarded 
                                                                    : ''}
                                                                onChange={(e) =>
                                                                    handlePointsChange(
                                                                        team.team_name,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
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
