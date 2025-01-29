import React, { useEffect, useState } from "react";
import "./TeamPointsTableGame.css";

const TeamPointsTableGame = ({ campData, results, setResults, gameTypeId, setGameTypeId }) => {
    const [sortingEnabled, setSortingEnabled] = useState(false);

    // Kontrola, zda jsou všechny herní body vyplněné (žádný není 0)
    useEffect(() => {
        const allPointsFilled = results.every(team => team.game_points > 0);
        setSortingEnabled(allPointsFilled);
    }, [results]);

    // Automatické řazení týmů, ale až když sortingEnabled = true
    useEffect(() => {
        if (!sortingEnabled) return;

        const sortedResults = [...results]
            .sort((a, b) => b.game_points - a.game_points)
            .reduce((acc, result, index) => {
                const prev = acc[acc.length - 1];
                result.position = prev && prev.game_points === result.game_points ? prev.position : (prev ? prev.position : 0) + 1;
                return [...acc, result];
            }, []);

        setResults(sortedResults);
    }, [sortingEnabled, results]);

    // Přiřazení bodů na základě pořadí
    useEffect(() => {
        if (gameTypeId === 0) return;

        const gameTypeData = campData.gameTypes[gameTypeId - 1];
        if (!gameTypeData) return;

        const { point_scheme, everyone_else } = gameTypeData;

        const updatedResults = results.map((result) => {
            const points =
                result.position - 1 < point_scheme.length
                    ? point_scheme[result.position - 1]
                    : everyone_else;

            return { ...result, points_awarded: points };
        });

        setResults(updatedResults);
    }, [gameTypeId, results]);

    // Správa změny herních bodů
    const handleGamePointsChange = (index, newGamePoints) => {
        const updatedResults = [...results];
        updatedResults[index].game_points = newGamePoints;

        setResults(updatedResults);
    };

    // Správa změny celkových bodů
    const handleManualPointChange = (index, newPoints) => {
        const updatedResults = [...results];
        updatedResults[index].points_awarded = newPoints;

        setGameTypeId(0)
        setResults(updatedResults);
    };

    const getTeamColor = (teamName) => {
        const team = campData.teams.find((t) => t.name === teamName);
        return team ? team.color : "";
    };

    return (
        <div className="team-table-container-game-points">
            <span className="input-explain">(H = Herní body, C = Celkové body)</span>
            <ul className="team-list-game-points">
                {results.map((result, index) => (
                    <li key={result.team_name} className="team-item-game-points">
                        <div className="team-position-game-points">{result.position}.</div>
                        <div
                            className="team-name-game-points"
                            style={{ backgroundColor: getTeamColor(result.team_name) }}
                        >
                            {result.team_name}
                        </div>

                        <div className="points-type-container-game-points">
                            {/* Herní body */}
                            <div>
                                <input
                                    type="number"
                                    className="game-points-input-game-points points-input-game-points"
                                    value={result.game_points || ''}
                                    inputMode="numeric"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                    }}
                                    onChange={(e) =>
                                        handleGamePointsChange(index, parseFloat(e.target.value) || 0)
                                    }
                                    min={0}
                                    placeholder="H"
                                />
                            </div>

                            {/* Celkové body */}
                            <div>
                                <input
                                    type="number"
                                    className="points-input-game-points"
                                    inputMode="numeric"
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9.]/g, '');
                                    }}
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
                ))}
            </ul>

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
        </div>
    );
};

export default TeamPointsTableGame;