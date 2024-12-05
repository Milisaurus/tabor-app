import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import {getCamp, updateCamp} from "../api"

// COMPONENT IMPORT
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading"
import SelectDay from "../components/selectDay/selectDay";
import SelectCampMembers from "../components/SelectTeamMembers/SelectTeamMembers";

import "../css/IndividualPointsPage.css"

const IndividualPoints = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [day, setDay] = useState("Pondělí");
    const [reason, setReason] = useState("");
    const [points, setPoints] = useState("");
    const [participants, setParticipants] = useState([]);
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
        } catch (error){
            console.error("Failed to update camp data:", error);
            console.log(updatedCampData);
        }
        navigate("/main-page");

    };

    return(
        <div className="individual-points-page">
            {/* Navigation bars */}
            <Header goBackLink="/main-page" editLink1="#" editLink2="#" showIcons="true"/>  
            <NavbarButtons/>
            <Heading text="Vložení individuálních bodů" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit} className="points-form">

                {/* Activity Name */}
                <div>
                    <label>Název aktivity</label>
                    <input type="text" value={reason} onChange={(e) => {setReason(e.target.value)}} required placeholder="Název" />
                </div>

                {/* Select Day of the Week */}
                <SelectDay selectedDay={day} onDayChange={setDay}/>

                <SelectCampMembers campData={campData} onSelectionChange={setParticipants} />

                {/* Number of points */}
                <div>
                    <label>Počet udělených bodů</label>
                    <input type="number" value={points} onChange={(e) => {setPoints(e.target.value)}} min={0} required placeholder="Počet bodů"/>
                </div>

                {/* Submit Button */}
                <button className="submitbutton" type="submit">Potvrdit</button>

            </form>

        </div>
    );
}

export default IndividualPoints;