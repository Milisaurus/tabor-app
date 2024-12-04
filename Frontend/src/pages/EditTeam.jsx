// This code works, but when removing children, it kinda breaks, so maybe FIT IT?
// however, editing childs name works as well as anything else

import React, { useState, useEffect } from "react";
import { getTeams, updateTeam } from "../api";
import { Link, useNavigate } from "react-router-dom";
import TeamForm from "../components/TeamForm/TeamForm";

// COMPONENT IMPORT
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Header from "../components/Header/Header";

const EditTeam = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeamIndex, setSelectedTeamIndex] = useState(null); 
    const [editedTeam, setEditedTeam] = useState(null); 
    const [currentChildIndex, setCurrentChildIndex] = useState(0); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            const data = await getTeams();
            setTeams(data);
        };
        fetchTeams();
    }, []);

    const handleTeamSelect = (index) => {
        setSelectedTeamIndex(index);
        setEditedTeam({ ...teams[index] });
        setCurrentChildIndex(0);
    };

    // Aktualizace dat týmu
    const handleTeamChange = (index, e) => {
        const { name, value } = e.target;
        setEditedTeam((prev) => ({ ...prev, [name]: value }));
    };

    const handleChildChange = (teamIndex, childIndex, e) => {
        const updatedChildren = [...editedTeam.children];
        updatedChildren[childIndex] = e.target.value;
        setEditedTeam((prev) => ({ ...prev, children: updatedChildren }));
    };

    const handleChildFormChange = (teamIndex, direction) => {
        setCurrentChildIndex((prevIndex) => prevIndex + (direction === "next" ? 1 : -1));
    };

    // Uložení změn na server
    const handleSave = async () => {
        if (editedTeam && selectedTeamIndex !== null) {
            const originalTeam = teams[selectedTeamIndex]; 
            await updateTeam(selectedTeamIndex, editedTeam, originalTeam);
            navigate("/main-page");
        }
    };
    

    return (
        <div className="create-camp-container">
            <Header goBackLink="/" editLink1={"/edit-teams"} editLink2={"#"}/>
            <NavbarButtons />
            <Heading text="Editovat týmy" level={1} className="nadpish1" />
            <div>
                <label htmlFor="team-select">Vyber tým:</label>
                <select
                    id="team-select"
                    value={selectedTeamIndex || ""}
                    onChange={(e) => handleTeamSelect(e.target.value)}
                >
                    <option value="">-- Vyber tým --</option>
                    {teams.map((team, index) => (
                        <option key={index} value={index}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            {editedTeam && (
                <>
                    <TeamForm
                        index={selectedTeamIndex}
                        team={editedTeam}
                        currentChildIndex={currentChildIndex}
                        handleTeamChange={handleTeamChange}
                        handleChildChange={handleChildChange}
                        handleChildFormChange={handleChildFormChange}
                    />
                    <button className="linkbutton" onClick={handleSave}>
                        Uložit změny
                    </button>
                </>
            )}
            <img src="/wave.svg" alt="Wave" className="wave-svg" />
        </div>
    );
};

export default EditTeam;
