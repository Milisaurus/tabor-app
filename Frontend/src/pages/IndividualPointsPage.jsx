// Author Jan Juračka <xjurac07>

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {getCamp, updateCamp} from "../api"

// COMPONENT IMPORT
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading"
import SelectDay from "../components/selectDay/selectDay";
import SelectCampMembers from "../components/SelectTeamMembers/SelectTeamMembers";

import "../css/IndividualPointsPage.css"

const IndividualPoints = () => {
    // States definition
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const weekDays = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    const [day, setDay] = useState(weekDays[new Date().getDay()]);
    const [reason, setReason] = useState("");               // Name of the activity
    const [points, setPoints] = useState("");               // Points to participants
    const [participants, setParticipants] = useState([]);   // Holds names of participants
    const navigate = useNavigate();

    // fetch camp data from server
    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const data = await getCamp();
                if (data) {
                    setCampData(data);
                } else {
                    setError("Camp data not found.");
                }
            } catch (err) {
                setError("Error loading camp data: " + err.message);
            } finally {
                setLoading(false);
            }
        };
        if(!sessionStorage.getItem("camp_name")){
            navigate("/");
        }
        fetchCampData();
    }, []);
    
    // Handles submit, sends new data to server
    const handleSubmit = async (event) => {
        // prevent default values
        event.preventDefault();
        // Check if the activity reason already exists in campData.teamGames
        const isDuplicateReason = campData.individualActivities.some((activity) => activity.reason === reason);
        if (isDuplicateReason) {
            alert("Název aktivity již existuje! Vyberte prosím jiný název.");
            return; // Stop the submission
        }
        // wrap new activity into object
        const newIndividualActivity = {
            day,
            reason,
            points: parseInt(points),
            participants
        }
        // add new activity to camp data
        campData['individualActivities'].push(newIndividualActivity);
        // send JSON string to server
        try {
            await updateCamp(JSON.stringify(campData));
        } catch (error){
            console.error("Failed to update camp data:", error);
            console.log(updatedCampData);
            alert("Nepodařilo se odeslat požadavek");
        }        
        navigate("/main-page");
    };
    
    if (loading) return <h1>Načítání...</h1>;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return(
        <div className="individual-points-page">
            <Header goBackLink="/main-page"  editLink1={"/edit-teams"} editLink2="#" showIcons="true"/>  
            <NavbarButtons/>
            <Heading text="Vložení individuálních bodů" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit} className="points-form">

                <div>
                    <label>Název aktivity</label>
                    <input type="text" value={reason} onChange={(e) => {setReason(e.target.value)}} required placeholder="Název" />
                </div>

                <SelectDay selectedDay={day} onDayChange={setDay}/>

                <div className="number-of-points">
                    <label>Počet udělených bodů</label>
                    <input type="number" value={points} onChange={(e) => {setPoints(e.target.value)}} min={0} required placeholder="Počet bodů"/>
                </div>


                <button className="submitbutton" type="submit">Potvrdit</button>

            </form>
        </div>
    );
}

export default IndividualPoints;