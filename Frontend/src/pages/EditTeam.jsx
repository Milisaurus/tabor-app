// Author Milan Vrbas <xvrbas01>

import React, { useState, useEffect } from "react";
import { getCamp, updateTeam } from "../api";
import { useNavigate } from "react-router-dom";

// COMPONENT IMPORT
import TeamFormEdit from "../components/TeamFormEdit/TeamFormEdit";
import Header from "../components/Header/Header";
import Heading from "../components/Heading/Heading";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";

const EditTeam = () => {
    const [teams, setTeams] = useState([]); // Store the list of teams
    const [selectedTeamIndex, setSelectedTeamIndex] = useState(null); // Store the index of the selected team
    const [editedTeam, setEditedTeam] = useState(null); // Store the data of the team being edited
    const [campData, setCampData] = useState(null); // Store the camp data
    const navigate = useNavigate();

    // Fetch camp data
    useEffect(() => {
        const fetchCampData = async () => {
            const campData = await getCamp();
            setTeams(campData.teams); // Set teams in state
            setCampData(campData); // Set entire camp data in state
        };
        if (!sessionStorage.getItem("camp_name")) {
            navigate("/");
        }
        fetchCampData();
    }, []);

    // Handle team selection from the dropdown
    const handleTeamSelect = (index) => {
        setSelectedTeamIndex(index);
        setEditedTeam({ ...teams[index] }); // Set the selected team data for editing
    };

    // Handle changes in team data (e.g., name, leader)
    const handleTeamChange = (index, e) => {
        const { name, value } = e.target;
        setEditedTeam((prev) => ({ ...prev, [name]: value })); // Update the team data
    };

    // Handle changes in individual child data
    const handleChildChange = (childIndex, e) => {
        const oldName = editedTeam.children[childIndex]; // Get the old child name
        const newName = e.target.value; // Get the new child name
    
        const updatedChildren = [...editedTeam.children];
        updatedChildren[childIndex] = newName; // Update the child's name

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
        setCampData(updatedCampData); // Update camp data
    };

    // Handle removal of a child from the team
    const handleRemoveChild = (childIndex) => {
        const removedChild = editedTeam.children[childIndex]; // Get the child to remove
        // Remove the child from the list
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
        setCampData(updatedCampData); // Update camp data
    };

    // Handle adding a new child to the team
    const handleAddChild = () => {
        setEditedTeam((prev) => ({
            ...prev,
            children: [...prev.children, `Dítě ${prev.children.length + 1}`], // Add a new child with default name
        }));
    };

    // Save the changes to the team and update the camp data
    const handleSave = async () => {
        if (editedTeam && selectedTeamIndex !== null) {
            const originalTeam = teams[selectedTeamIndex]; // Get the original team data
    
            // Create updated team data
            const updatedTeamData = { ...editedTeam, children: editedTeam.children };
    
            // Replace the old team data with the updated team data
            const updatedTeams = teams.map((team, index) =>
                index === selectedTeamIndex ? updatedTeamData : team
            );
    
            // Get the removed children
            const removedChildren = originalTeam.children.filter(
                (child) => !editedTeam.children.includes(child)
            );
    
            // Remove the participants who were removed from the team (individualActivities)
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
    
            // Save the updated data
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
