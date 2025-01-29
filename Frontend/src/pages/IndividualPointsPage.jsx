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
import Loading from '../components/Loading/Loading';

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
    const [oddEvenSelection, setoddEvenSelection] = useState({ odd: false, even: false });
    const [formError, setFormError] = useState("");
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
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError(""); // Reset error message

    
        const isDuplicateReason = campData.individualActivities.some(
            (activity) => activity.reason === reason
        );
        if (isDuplicateReason) {
            setFormError("Název aktivity již existuje! Vyberte prosím jiný název.");
            return;
        }

        if (oddEvenSelection.even && oddEvenSelection.odd) {
            setFormError("Můžete vybrat buď sudé nebo liché, ne obě možnosti.");
            return; // Do not set both options to true
        }
    
        // Pokud byly zatrženy Sudí nebo Liší, použije se kategorie místo účastníků
        const selectedParticipants = [];
        if (oddEvenSelection.even) {
            selectedParticipants.push("even");
        }
        if (oddEvenSelection.odd) {
            selectedParticipants.push("odd");
        }
        
        // Pokud nejsou zatržena Sudí/Liší, použijeme účastníky
        if (!oddEvenSelection.even && !oddEvenSelection.odd) {
            selectedParticipants.push(...participants);
        }
    
        const newIndividualActivity = {
            day,
            reason,
            points: parseInt(points),
            participants: selectedParticipants,
            timestamp: Date.now()
        };
    
        campData['individualActivities'].push(newIndividualActivity);
    
        try {
            await updateCamp(JSON.stringify(campData));
        } catch (error) {
            console.error("Failed to update camp data:", error);
            alert("Nepodařilo se odeslat požadavek");
        }
    
        navigate("/main-page");
    };
    
    
    if (loading) return <Loading />;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return(
        <div className="individual-points-page">
            <Header goBackLink="/main-page"  editLink1={"/edit-teams"} editLink2="#" showIcons="true"/>  
            <NavbarButtons/>
            <Heading text="Vložení individuální aktivity" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit} className="points-form">

                <div className="activity-name">
                    <label>Název aktivity</label>
                    <input type="text" value={reason} onChange={(e) => {setReason(e.target.value)}} required placeholder="Název" />
                </div>

                <SelectDay selectedDay={day} onDayChange={setDay}/>

                <div className="number-of-points-input">
                    <label>Počet udělených bodů</label>
                    <input 
                    type="number" 
                    value={points} 
                    onChange={(e) => {setPoints(e.target.value)}} 
                    min={0} 
                    required 
                    placeholder="Počet bodů"
                    inputMode="numeric"
                    onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.]/g, ''); }}
                    />
                </div>

                <SelectCampMembers campData={campData} participants={participants} onSelectionChange={setParticipants} oddEvenSelection={oddEvenSelection}
                setoddEvenSelection={setoddEvenSelection} />

                {/* Display error message if any */}
                {formError && (
                    <div className="form-error" style={{ color: "red", marginTop: "1rem" }}>
                        {formError}
                    </div>
                )}

                <button className="submitbutton" type="submit">Potvrdit</button>

            </form>
        </div>
    );
}

export default IndividualPoints;