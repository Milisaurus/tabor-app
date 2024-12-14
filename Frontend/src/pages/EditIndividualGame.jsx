import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import { getCamp, updateCamp } from "../api";
import SelectDay from "../components/selectDay/selectDay";
import SelectCampMembers from "../components/SelectTeamMembers/SelectTeamMembers";

import "../css/EditActivity.css"

const EditIndividualActivity = () => {
    const [campData, setCampData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState();
    const [editedActivity, setEditedActivity] = useState();

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const gameReasonFromUrl = queryParams.get("reason");

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedActivities = campData.individualActivities.map((activity) => activity.reason === selectedActivity.reason ? editedActivity : activity);
        const updatedCampData = {...campData, individualActivities: updatedActivities,};

        try {
            await updateCamp(JSON.stringify(updatedCampData));
            navigate("/main-page");
        } catch (err) {
            console.error("Error updating game data:", err);
        }
    };

    const handleChange = (field, value) => {
        setEditedActivity((prev) => ({
            ...prev,
            [field]: value,
        }))
    };

    if (loading) return <h1>Načítání...</h1>;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return(
        <div className="edit-individual-activity-page" onSubmit={handleSubmit}>
            <Header goBackLink="/main-page" editLink1={"/edit-teams"} editLink2="#" showIcons="true" />
            <NavbarButtons/>
            <Heading text="Úprava individuální aktivity" level={1} className="nadpish1" />

            <form className="edit-activity-form" onSubmit={handleSubmit}>
                <div>
                    <label>Název aktivity</label>
                    <input type="text" value={editedActivity.reason} onChange={(e) => handleChange("reason", e.target.value)} required/>
                </div>

                <SelectDay selectedDay={editedActivity.day} onDayChange={(newDay) => handleChange("day", newDay)}/>

                <div className="number-of-points">
                    <label>Počet udělených bodů</label>
                    <input type="number" value={editedActivity.points} onChange={(e) => handleChange("points", e.target.value)} min={0} required placeholder="Počet bodů"/>
                </div>

                <SelectCampMembers campData={campData} participants={editedActivity.participants} onSelectionChange={(newParticipants) => handleChange(newParticipants)} />

                <button className="submitbutton" type="submit">Potvrdit</button>

            </form>
        </div>
    )
}

export default EditIndividualActivity