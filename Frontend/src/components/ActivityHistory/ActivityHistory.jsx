import React from "react";
import { Link } from "react-router-dom";

const ActivityHistory = ({ selectedActivity, campData, closeModal }) => {

    return (
        <div className="game-detail-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <Link to="#">
                        <img src="/edit-points-button.png" alt="Edit" className="modal-icon-left" />
                    </Link>
                    <h2 className="detail-hry">Detail hry</h2>
                    <Link to="#">
                        <img src="/recycle-bin.png" alt="Delete" className="modal-icon-right" />
                    </Link>
                </div>
                <h3 className="game-type">{selectedActivity.reason || selectedActivity.name} 
                    ({selectedActivity.participants ? "Individuální" : "Týmová"})
                </h3>
                <p className="detail-hry">{selectedActivity.day}</p>
                <hr />

                {selectedActivity.participants ? (
                    <>
                        {/* INDIVIDUAL ACTIVITY */}
                        <p><strong>Počet bodů:</strong> {selectedActivity.points}</p>
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
                                </tr>
                            </thead>
                            <tbody>
                                {selectedActivity.results.map((result, index) => {
                                    const team = campData.teams.find(team => team.name === result.team_name);
                                    const teamColor = team?.color || "#000"; // Default is black

                                    return (
                                        <tr key={index}>
                                            <td style={{ color: teamColor }}>{result.team_name}</td>
                                            <td>{result.position}</td>
                                            <td>{result.points_awarded}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                )}

                <button className="close-modal" onClick={closeModal}>Zavřít</button>
            </div>
        </div>
    );
};

export default ActivityHistory;
