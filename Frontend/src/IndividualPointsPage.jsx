import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import {getCamp, updateCamp} from "./api"
import "./css/CreateCamp.css"

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";

const IndividualPoints = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [day, setDay] = useState("Saturday");
    const [reason, setReason] = useState("");
    const [numOfParticipants, setNumOfParticipants] = useState(1);
    const [points, setPoints] = useState("");
    const [participants, setParticipants] = useState([""]);
    const navigate = useNavigate();

    // synchronize component
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

    if (loading) {
        return <h1>Načítání...</h1>;
    }

    if (error) {
        return <h1>Error: {error}</h1>;
    }

    if (!campData) {
        return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newIndividualActivity = {
            day,
            reason,
            points: parseInt(points),
            participants
        }




        campData['individualActivities'].push(newIndividualActivity);
        const updatedCampDataJson = JSON.stringify(campData);


        try {
            await updateCamp(updatedCampDataJson);
            //setCampData(updatedCampData);   // TODO: later replace with ACTUAL camp data
            // setDay("");
            // setReason("");
            // setPoints("");
            // setParticipants("");
             
        } catch (error){
            console.error("Failed to update camp data:", error);
            console.log(updatedCampData);
        }
        
    };

    const handleNumParticipantsChange = (event) => {
        const count = parseInt(event.target.value) || 1;
        setNumOfParticipants(count);
    };

    const handleParticipantChange = (index, value) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index] = value;
        setParticipants(updatedParticipants);
    };

    return(
        <div>
            {/* Navigation bars */}
            <NavbarTitle goBackLink="/main-page" editLink1="#" editLink2="#"/>  
            <NavbarButtons/>
            <h1>Vložení individuálních bodů</h1>

            <form onSubmit={handleSubmit} className="points-form">

                {/* Select Day of the Week */}
                <div>
                    <label>Vyberte den v týdnu</label>
                    <select value={day} onChange={(e) => setDay(e.target.value)} required>
                        <option value="Saturday">Sobota</option>
                        <option value="Sunday">Neděle</option>
                        <option value="Monday">Pondělí</option>
                        <option value="Tuesday">Úterý</option>
                        <option value="Wednesday">Středa</option>
                        <option value="Thursday">Čtvrtek</option>
                        <option value="Friday">Pátek</option>
                    </select>
                </div>

                {/* Activity Name */}
                <div>
                    <label>Název aktivity</label>
                    <input type="text" value={reason} onChange={(e) => {setReason(e.target.value)}} required placeholder="Název" />
                </div>

                {/* Number of Children */}
                <div>
                    <label>Počet dětí</label>
                    <input type="number" value={numOfParticipants} onChange={handleNumParticipantsChange} min={1} placeholder="Počet" required/>
                </div>


                {/* TODO: this input lacks any kind of consistency with actual data, anyone can type here whatever they want. CHANGE IT!!! */}
                {/* Dynamic Participant Inputs */}
                <div>
                    <label>Zadejte jména</label>

                </div>
                {Array.from({ length: numOfParticipants }, (_, index) => (
                    <div key={index}>
                        <input 
                            type="text" 
                            value={participants[index] || ""} 
                            onChange={(e) => handleParticipantChange(index, e.target.value)} 
                            required
                            placeholder="Jméno"
                        />
                    </div>
                ))}

                {/* Number of points */}
                <div>
                    <label>Počet udělených bodů</label>
                    <input type="number" value={points} onChange={(e) => {setPoints(e.target.value)}} min={0} required placeholder="Počet bodů"/>
                </div>

                {/* Submit Button */}
                <button type="submit" onClick={handleSubmit}>Potvrdit</button>

            </form>

        </div>
    );
}

export default IndividualPoints;