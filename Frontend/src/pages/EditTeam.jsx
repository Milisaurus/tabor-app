import React, { useState, useEffect } from "react";
import { getCamp, updateTeam } from "../api";
import { useNavigate } from "react-router-dom";

// COMPONENT IMPORT
import TeamFormEdit from "../components/TeamFormEdit/TeamFormEdit";
import Header from "../components/Header/Header";
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";

const EditTeam = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeamIndex, setSelectedTeamIndex] = useState(null);
    const [editedTeam, setEditedTeam] = useState(null);
    const [campData, setCampData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCampData = async () => {
            const campData = await getCamp();
            setTeams(campData.teams); 
            setCampData(campData); 
        };
        fetchCampData();
    }, []);

    const handleTeamSelect = (index) => {
        setSelectedTeamIndex(index);
        setEditedTeam({ ...teams[index] });
    };

    const handleTeamChange = (index, e) => {
        const { name, value } = e.target;
        setEditedTeam((prev) => ({ ...prev, [name]: value }));
    };

    const handleChildChange = (childIndex, e) => {
        const oldName = editedTeam.children[childIndex];
        const newName = e.target.value;
    
        const updatedChildren = [...editedTeam.children];
        updatedChildren[childIndex] = newName;

        // Update editedTeam with the new children list
        setEditedTeam((prev) => ({ ...prev, children: updatedChildren }));

        // Update participants in individualActivities with the new name
        const updatedActivities = campData.individualActivities.map((activity) => ({
            ...activity,
            participants: activity.participants.map((participant) =>
                participant === oldName ? newName : participant
            ),
        }));

        // Update camp data with new activities
        const updatedCampData = {
            ...campData,
            individualActivities: updatedActivities,
        };
        setCampData(updatedCampData);
    };

    const handleRemoveChild = (childIndex) => {
        const removedChild = editedTeam.children[childIndex];
        const updatedChildren = editedTeam.children.filter((_, index) => index !== childIndex);

        // Remove the child from the editedTeam state
        setEditedTeam((prev) => ({ ...prev, children: updatedChildren }));

        // Remove the child from all individualActivities
        const updatedActivities = campData.individualActivities.map((activity) => ({
            ...activity,
            participants: activity.participants.filter((participant) => participant !== removedChild),
        }));

        // Update camp data with the modified activities
        const updatedCampData = {
            ...campData,
            individualActivities: updatedActivities,
        };
        setCampData(updatedCampData);
    };

    const handleAddChild = () => {
        setEditedTeam((prev) => ({
            ...prev,
            children: [...prev.children, `Dítě ${prev.children.length + 1}`],
        }));
    };

    const handleSave = async () => {
        if (editedTeam && selectedTeamIndex !== null) {
            const originalTeam = teams[selectedTeamIndex];
    
            const updatedTeamData = { ...editedTeam, children: editedTeam.children };
    
            const updatedTeams = teams.map((team, index) =>
                index === selectedTeamIndex ? updatedTeamData : team
            );
    
            const removedChildren = originalTeam.children.filter(
                (child) => !editedTeam.children.includes(child)
            );
    
            const updatedActivities = campData.individualActivities.map((activity) => ({
                ...activity,
                participants: activity.participants.filter(
                    (participant) => !removedChildren.includes(participant)
                ),
            }));

            const updatedCampData = {
                ...campData,
                teams: updatedTeams,
                individualActivities: updatedActivities,
            };
    
            console.log("Updated Camp Data: ", updatedCampData);
    
            // Uložte data
            await updateTeam(selectedTeamIndex, updatedTeamData, updatedCampData);
            navigate("/main-page");
        }
    };
    

    return (
        <div className="create-camp-container">
            <Header goBackLink="/" editLink1="/edit-teams" editLink2="#" />
            <NavbarButtons />
            <Heading text="Úprava informací o týmech" level={1} className="nadpish1" />
            <div className="teamSelect">
                <label htmlFor="team-select">Vyber tým:</label>
                <select
                    id="team-select"
                    value={selectedTeamIndex || ""}
                    onChange={(e) => handleTeamSelect(e.target.value)}
                >
                    <option value="">Vyberte tým</option>
                    {teams.map((team, index) => (
                        <option key={index} value={index}>
                            {team.name}
                        </option>
                    ))}
                </select>
            </div>

            {editedTeam && (
                <>
                    <TeamFormEdit
                        index={selectedTeamIndex}
                        team={editedTeam}
                        handleTeamChange={handleTeamChange}
                        handleChildChange={handleChildChange}
                        handleAddChild={handleAddChild}
                        handleRemoveChild={handleRemoveChild}
                    />
                    <button className="linkbutton" onClick={handleSave}>
                        Uložit změny
                    </button>
                </>
            )}
        </div>
    );
};

export default EditTeam;
