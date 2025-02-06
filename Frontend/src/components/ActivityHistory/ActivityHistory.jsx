import React from "react";
import { Link } from "react-router-dom";
import './ActivityHistory.css';

const ActivityHistory = ({ selectedActivity, campData, closeModal, handleDelete }) => {
    return (
        <div className="game-detail-modal">
            <div className="modal-content-history">
                <div className="modal-header">
                    {/* Edit button */}
                    {selectedActivity.participants ? (
                        <Link to={`/edit-individual-activity?reason=${selectedActivity.reason}`}>
                            <img src="/edit-points-button.png" alt="Edit" className="modal-icon-left" />
                        </Link>
                    ) : (
                        <Link to={`/edit-team-game?name=${selectedActivity.name}`}>
                            <img src="/edit-points-button.png" alt="Edit" className="modal-icon-left" />
                        </Link>
                    )}
                    <h2 className="detail-hry">Detail hry</h2>
                    {/* Delete button */}
                    <Link to="#" onClick={handleDelete}>
                        <img src="/recycle-bin.png" alt="Delete" className="modal-icon-right" />
                    </Link>
                </div>
                <h3 className="game-type">{selectedActivity.reason || selectedActivity.name} 
                    {" "}({selectedActivity.participants ? "Individuální" : "Týmová"})
                </h3>
                <p className="detail-hry">{selectedActivity.day}</p>
                <hr />

                {selectedActivity.participants ? (
                    <>
                        {/* INDIVIDUAL ACTIVITY */}
                        <p><strong>Počet bodů:</strong> {selectedActivity.points}</p>
                        {selectedActivity.participants.some(participant => participant === "odd" || participant === "even") ? (
                            // If participants are "odd" or "even", display a message instead of a table
                            <>
                                <p><strong>{selectedActivity.participants[0] === "odd" ? "Lichá" : "Sudá"}</strong></p>
                            </>
                        ) : (
                            <table className="participant-table">
                                <thead>
                                    <tr>
                                        <th>Tým</th>
                                        <th>Jméno</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedActivity.participants.map((participant, index) => {
                                        const team = campData.teams.find(team => team.children.includes(participant));
                                        const teamColor = team?.color || "#000"; // Default is black

                                        return (
                                            <tr key={index}>
                                                <td style={{ color: teamColor }}>{team?.name}</td>
                                                <td>{participant}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </>
                ) : (
                    <>
                        {/* TEAM GAMES */}
                        <table className="participant-table">
                            <thead>
                                <tr>
                                    <th>Tým</th>
                                    <th>Umístění</th>
                                    <th>Body</th>
                                    {selectedActivity.results.every(result => result.game_points !== 0) && (
                                        <th>Herní body</th> // Zobrazení sloupce pro herní body, pokud jsou všechny nenulové
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedActivity.results
                                    .sort((a, b) => {
                                        // Nejprve řadíme podle umístění
                                        if (a.position !== b.position) {
                                            return a.position - b.position; // Ascending order by position
                                        }
                                        // Pokud jsou umístění stejné, řadíme podle bodů
                                        return b.points_awarded - a.points_awarded; // Descending order by points
                                    })
                                    .map((result, index) => {
                                        const team = campData.teams.find(team => team.name === result.team_name);
                                        const teamColor = team?.color || "#000"; // Default is black

                                        return (
                                            <tr key={index}>
                                                <td style={{ color: teamColor }}>{result.team_name}</td>
                                                <td>{result.position}</td>
                                                <td>{result.points_awarded}</td>
                                                {selectedActivity.results.every(result => result.game_points !== 0) && (
                                                    <td>{result.game_points}</td> // Zobrazení herních bodů
                                                )}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </>
                )}

                {/* Close modal button */}
                <button className="close-modal" onClick={closeModal}>Zavřít</button>
            </div>
        </div>
    );
};

export default ActivityHistory;
