import React, { useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./TeamPointsTable.css";

const TeamPointsTable = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    useEffect(() => {
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
    }, [gameTypeId]);

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const updatedResults = Array.from(results);
        const [movedItem] = updatedResults.splice(result.source.index, 1);
        updatedResults.splice(result.destination.index, 0, movedItem);

        updatedResults.forEach((item, index) => {
            item.position = index + 1;
        });

        setResults(updatedResults);
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
        <div className="team-list-container">
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

            <label>Upravte pořadí týmů přetažením</label>

            <DragDropContext onDragEnd={handleDragEnd}>
    <table className="team-table">
        <thead>
            <tr>
                <th>Umístění</th>
                <th>Tým</th>
                <th>Body</th>
            </tr>
        </thead>
        <Droppable droppableId="teamList">
            {(provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                    {results.map((result, index) => (
                        <Draggable key={result.team_name} draggableId={result.team_name} index={index}>
                            {(provided) => (
                                <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        backgroundColor: getTeamColor(result.team_name),
                                    }}
                                >
                                    <td className="team-position">{result.position}.</td>
                                    <td className="team-name">{result.team_name}</td>
                                    <td>
                                        <input
                                            type="number"
                                            className="points-input"
                                            value={result.points_awarded}
                                            onChange={(e) =>
                                                handleManualPointChange(index, parseFloat(e.target.value) || 0)
                                            }
                                            min={0}
                                        />
                                    </td>
                                </tr>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </tbody>
            )}
        </Droppable>
    </table>
</DragDropContext>


        </div>
    );
};

export default TeamPointsTable;