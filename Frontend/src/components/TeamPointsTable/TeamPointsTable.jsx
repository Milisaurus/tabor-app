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

    // Synchronizace pozic a bodů s výsledky
    useEffect(() => {
        const initializeBuckets = () => {
            const newBuckets = positionBuckets.map((bucket) => ({
                ...bucket,
                teams: results
                    .filter((team) => team.position === bucket.position)
                    .map((team) => ({ team_name: team.team_name, points_awarded: team.points_awarded })),
            }));
            setPositionBuckets(newBuckets);
        };
        
        initializeBuckets();
    }, [results]);

    // Přepočet bodů při změně typu hry nebo přetažení
    useEffect(() => {
        recalculatePoints();
    }, [gameTypeId, positionBuckets]);

    const recalculatePoints = () => {
        if (gameTypeId === 0) return; // Vlastní bodování – ponechat ruční úpravy

        const gameTypeData = campData.gameTypes[gameTypeId - 1];
        if (!gameTypeData) return;

        const { point_scheme, everyone_else } = gameTypeData;

        const updatedResults = [...results];

        positionBuckets.forEach((bucket) => {
            bucket.teams.forEach((team) => {
                const points = point_scheme[bucket.position - 1] || everyone_else;
                team.points_awarded = points;
            });
        });
        

        setResults(updatedResults);
    };

    // Zpracování přetažení týmů mezi pozicemi
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

        const updatedBuckets = positionBuckets.map((bucket) =>
            bucket.position === sourcePos
                ? { ...bucket, teams: bucket.teams.filter((t) => t.team_name !== draggedTeam.team_name) }
                : bucket.position === destPos
                ? { ...bucket, teams: [...bucket.teams, draggedTeam] }
                : bucket
        );
        setPositionBuckets(updatedBuckets);
        

        // Aktualizace výsledků (pozic) po přetažení
        const updatedResults = results.map((team) => {
            if (team.team_name === draggedTeam.team_name) {
                return { ...team, position: destPos };
            }
            return team;
        });

        setResults(updatedResults);
    };

    // Ruční úprava bodů pomocí inputu
    const handlePointsChange = (teamName, newPoints) => {
        const updatedResults = results.map((team) =>
            team.team_name === teamName
                ? { ...team, points_awarded: parseInt(newPoints, 10) || 0 }
                : team
        );
        setResults(updatedResults);
    };

    // Barva týmu podle JSON dat
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
                                                        <div className="team-info">
                                                            <div className="team-name">{team.team_name}</div>
                                                            <input
                                                                type="number"
                                                                className="team-points-input"
                                                                value={team.points_awarded || 0}
                                                                onChange={(e) =>
                                                                    handlePointsChange(
                                                                        team.team_name,
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />
                                                            <span> bodů</span>
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