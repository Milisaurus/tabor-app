import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import { getCamp, updateCamp } from "../api";
import SelectDay from "../components/selectDay/selectDay";
import SelectCampMembers from "../components/SelectTeamMembers/SelectTeamMembers";
import Loading from '../components/Loading/Loading';

import "../css/EditActivity.css"

const EditIndividualActivity = () => {
    const [campData, setCampData] = useState();     // camp data
    const [loading, setLoading] = useState(true);               
    const [error, setError] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(); // activity selected for editing
    const [editedActivity, setEditedActivity] = useState();     // edited version of the selected activity
    const [oddEvenSelection, setoddEvenSelection] = useState({ odd: false, even: false }); // for odd/even selection
    const navigate = useNavigate();
    const location = useLocation();

    // get name of edited activity from URL query
    const queryParams = new URLSearchParams(location.search);
    const gameReasonFromUrl = queryParams.get("reason");
    
    // Handle editing activity
    const handleChange = (field, value) => {
        if (field === "points") {
            value = parseInt(value) || 0;
        }
        setEditedActivity((prev) => ({
            ...prev,
            [field]: value,
        }))
    };

    // fetch camp data
    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
                if (data) {
                    setCampData(data);
                    if (gameReasonFromUrl) {
                        const game = data.individualActivities.find(
                            (g) => g.reason === gameReasonFromUrl
                        );
                        setSelectedActivity(game);
                        setEditedActivity(game);
                        // Set oddEvenSelection based on current activity's participants
                        const hasOdd = game.participants.includes("odd");
                        const hasEven = game.participants.includes("even");
                        setoddEvenSelection({ odd: hasOdd, even: hasEven });
                    }
                } else {
                    setError("Camp data not found.");
                }
            } catch (err) {
                setError("Error loading camp data: " + err.message);
            } finally {
                setLoading(false);
            }
        };
    
        if (!sessionStorage.getItem("camp_name")) {
            navigate("/");
        }
        fetchCampData();
    }, []);

    // Handles submit, send data to server
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that the new activity reason does not conflict with other activities
        const isDuplicateReason = campData.individualActivities.some((activity) => 
            activity.reason === editedActivity.reason && activity.reason !== selectedActivity.reason);
        if (isDuplicateReason) {
            alert("Název aktivity již existuje! Vyberte prosím jiný název.");
            return;
        }

        
        if (oddEvenSelection.even && oddEvenSelection.odd) {
            alert("Můžete vybrat buď sudé nebo liché, ne obě možnosti.");
            return; // Do not set both options to true
        }

        // Handle oddEvenSelection and regular participants
        const selectedParticipants = [];
        if (oddEvenSelection.even) {
            selectedParticipants.push("even");
        }
        if (oddEvenSelection.odd) {
            selectedParticipants.push("odd");
        }

        if (!oddEvenSelection.even && !oddEvenSelection.odd) {
            selectedParticipants.push(...editedActivity.participants);
        }

        const updatedActivity = {
            ...editedActivity,
            participants: selectedParticipants
        };

        // Replace the edited activity in the camp data
        const updatedActivities = campData.individualActivities.map((activity) =>
            activity.reason === selectedActivity.reason ? updatedActivity : activity
        );

        const updatedCampData = { ...campData, individualActivities: updatedActivities };

        // Send updated data to the server
        try {
            await updateCamp(JSON.stringify(updatedCampData));
            navigate("/main-page");
        } catch (err) {
            console.error("Error updating game data:", err);
        }
    };

    if (loading) return <Loading />;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return(
        <div className="edit-individual-activity-page">
            <Header goBackLink="/main-page"/>
            <NavbarButtons/>
            <Heading text="Úprava individuální aktivity" level={1} className="nadpish1" />

            <form className="edit-activity-form" onSubmit={handleSubmit}>
                <div className="activity-name">
                    <label>Název aktivity</label>
                    <input type="text" value={editedActivity.reason} onChange={(e) => handleChange("reason", e.target.value)} required/>
                </div>

                <SelectDay selectedDay={editedActivity.day} onDayChange={(newDay) => handleChange("day", newDay)} />

                <div className="number-of-points">
                    <label>Počet udělených bodů</label>
                    <input type="number" value={editedActivity.points} onChange={(e) => handleChange("points", e.target.value)} min={0} required placeholder="Počet bodů"/>
                </div>

                <SelectCampMembers
                    campData={campData}
                    participants={editedActivity.participants}
                    onSelectionChange={(newParticipants) => handleChange("participants", newParticipants)}
                    oddEvenSelection={oddEvenSelection}
                    setoddEvenSelection={setoddEvenSelection} 
                />

                <button className="submitbutton" type="submit">Potvrdit</button>
            </form>
        </div>
    )
}

export default EditIndividualActivity;
