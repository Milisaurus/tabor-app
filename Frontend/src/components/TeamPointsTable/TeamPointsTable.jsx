import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [dropCount, setDropCount] = useState(0);
    useEffect(() => {
        // Řazení týmů a správné určení pozic (řešení shodných míst)
        const sortedResults = [...results]
            .sort((a, b) => b.game_points - a.game_points) // Řazení podle herních bodů (sestupně)
            .reduce((acc, result, index, arr) => {
                const prev = acc[acc.length - 1];
                if (prev && prev.game_points === result.game_points) {
                    result.position = prev.position; // Shodné místo jako předchozí tým
                } else {
                    result.position = (prev ? prev.position : 0) + 1; // Další dostupná pozice
                }
                return [...acc, result];
            }, []);
    
        setResults(sortedResults);
    }, [results]); // Aktualizace při změně výsledků
    
    useEffect(() => {
        if (gameTypeId === 0) return;
    
        const updateResultsBasedOnPositions = (gameTypeId) => {
            const gameTypeData = campData.gameTypes[gameTypeId - 1];
            if (!gameTypeData) return;
    
            const { point_scheme, everyone_else } = gameTypeData;
    
            const updatedResults = results.map((result) => {
                const points =
                    result.position - 1 < point_scheme.length
                        ? point_scheme[result.position - 1]
                        : everyone_else;
    
                result.points_awarded = points; // Přidělení bodů dle pozice
                return result;
            });
    
            setResults(updatedResults);
        };
    
        updateResultsBasedOnPositions(gameTypeId);
    }, [gameTypeId, results]);
    
    // Řídí změny herních bodů (přesune tým na správné místo v pořadí)
    const handleGamePointsChange = (index, newGamePoints) => {
        const updatedResults = [...results];
        updatedResults[index].game_points = newGamePoints;
    
        // Reorganizace výsledků a přepočet pozic
        const sortedResults = updatedResults
            .sort((a, b) => b.game_points - a.game_points)
            .reduce((acc, result, i, arr) => {
                const prev = acc[acc.length - 1];
                if (prev && prev.game_points === result.game_points) {
                    result.position = prev.position; // Shodné místo jako předchozí tým
                } else {
                    result.position = (prev ? prev.position : 0) + 1; // Další dostupná pozice
                }
                return [...acc, result];
            }, []);
    
        setResults(sortedResults);
    };
    
    
    // Řídí přetažení týmů
    const handleDragEnd = (result) => {
        if (!result.destination) return;
    
        const updatedResults = Array.from(results);
        const [movedItem] = updatedResults.splice(result.source.index, 1);
        updatedResults.splice(result.destination.index, 0, movedItem);
    
        setResults(updatedResults); // Pozice budou přepočítány v useEffect
    };
    

    
    // Aktualizuje manuálně hlavní body
    const handleManualPointChange = (index, newPoints) => {
        const updatedResults = [...results];
        updatedResults[index].points_awarded = newPoints;
        setResults(updatedResults);
        setGameTypeId(0); // Reset typu hry na "vlastní"
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
                            {results.map((result, index) => (
                                <Draggable key={result.team_name} draggableId={result.team_name} index={index}>
                                    {(provided) => (
                                        <li
                                            className="team-item"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <div className="team-position">{result.position}.</div>
                                            <div className="team-name" style={{ backgroundColor: getTeamColor(result.team_name) }}>
                                                {result.team_name}
                                            </div>

                                            <div  className="points-type-container">
                                                {/* Herní body */}
                                                <div>
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Povolení pouze čísel a desetinné tečky
                                                        }}
                                                        className="game-points-input points-input"
                                                        value={result.game_points || ''}
                                                        onChange={(e) =>
                                                            handleGamePointsChange(index, parseFloat(e.target.value) || 0)
                                                        }
                                                        min={0}
                                                        placeholder="H"
                                                    />
                                                </div>

                                                {/* Hlavní body */}
                                                <div>
                                                    <input
                                                        type="number"
                                                        inputMode="numeric"
                                                        onInput={(e) => {
                                                            e.target.value = e.target.value.replace(/[^0-9.]/g, ''); // Povolení pouze čísel a desetinné tečky
                                                        }}
                                                        className="points-input"
                                                        value={result.points_awarded || ''}
                                                        onChange={(e) =>
                                                            handleManualPointChange(index, parseFloat(e.target.value) || 0)
                                                        }
                                                        min={0}
                                                        placeholder="C"
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
            <span>(H = Herní body, C = Celkové body)</span>
        </div>
    );
};

export default TeamPointsTable;
