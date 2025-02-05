import React, { useState, useEffect } from "react";
import { getCamp, updateCamp } from "../api";
import { useNavigate } from "react-router-dom";

import "../css/OddEvenPage.css";

import Loading from '../components/Loading/Loading';
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Header from "../components/Header/Header";

const OddEvenPage = () => {
    const [children, setChildren] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [originalAssignments, setOriginalAssignments] = useState({});
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
                if (data) {
                    setCampData(data);

                    const allChildren = data.teams.flatMap((team) => team.children);

                    const existingAssignments = data.oddOrEven || { odd: [], even: [] };

                    const newAssignments = allChildren.reduce((acc, child) => {
                        if (existingAssignments.odd.includes(child)) {
                            acc[child] = "odd";
                        } else if (existingAssignments.even.includes(child)) {
                            acc[child] = "even";
                        } else {
                            acc[child] = null;
                        }
                        return acc;
                    }, {});

                    setAssignments(newAssignments);
                    setOriginalAssignments(newAssignments); // Save original state
                    setChildren(allChildren);
                } else {
                    setError("Camp data not found.");
                }
            } catch (err) {
                setError("Error loading camp data: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCampData();
    }, []);

    const hasChanges = () => {
        return JSON.stringify(assignments) !== JSON.stringify(originalAssignments);
    };

    const handleSave = async () => {
        if (!hasChanges()) {
            alert("Žádné změny nebyly provedeny.");
            return;
        }

        try {
            const oddEvenData = {
                odd: Object.keys(assignments).filter((key) => assignments[key] === "odd"),
                even: Object.keys(assignments).filter((key) => assignments[key] === "even"),
            };

            await updateCamp(JSON.stringify({ oddOrEven: oddEvenData }));
            navigate("/main-page");
        } catch (error) {
            console.error(error);
            alert("Error saving assignments.");
        }
    };

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!campData) return <div>No camp data available.</div>;

    const handleAssignment = (child, group) => {
        setAssignments((prevAssignments) => ({
            ...prevAssignments,
            [child]: group,
        }));
    };

    const getTeamColor = (child) => {
        if (!campData) return "#ccc";
        const team = campData.teams.find((team) => team.children.includes(child));
        return team ? team.color : "#ccc";
    };

    return (
        <div>
            <Header goBackLink="/"/>
            <NavbarButtons />
            <Heading text="Přiřazení dětí do suchých a lichých" level={1} className="nadpish1" />
            <div className="assign-groups-container">
                <p className="description">
                    U každého dítěte vyberte, zda-li patří do sudého nebo lichého týmu
                </p>
                <ul className="assign-list">
                    {children.map((child) => {
                        const teamColor = getTeamColor(child);
                        return (
                            <li key={child} className="assign-item">
                                <span className="child-info">
                                    <span
                                        className="team-color-indicator"
                                        style={{ backgroundColor: teamColor }}
                                    />
                                    {child}
                                </span>
                                <div className="assign-buttons">
                                    <button
                                        className={`odd-button ${
                                            assignments[child] === "odd" ? "active" : ""
                                        }`}
                                        onClick={() => handleAssignment(child, "odd")}
                                    >
                                        Lichý
                                    </button>
                                    <button
                                        className={`even-button ${
                                            assignments[child] === "even" ? "active" : ""
                                        }`}
                                        onClick={() => handleAssignment(child, "even")}
                                    >
                                        Sudý
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="save-button-odd-even-container">
                <button className="save-button-odd-even" onClick={handleSave}>
                    Uložit
                </button>
            </div>
        </div>
    );
};

export default OddEvenPage;
