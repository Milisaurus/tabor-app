import React, { useState, useEffect } from "react"
import {getCamp, updateCamp} from "../api"

// COMPONENT IMPORT
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import SelectDay from "../components/selectDay/selectDay";


const TeamPoints = () => {
    const [campData, setCampData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [day, setDay] = useState("Pondělí");
    const [gameName, setGameName] = useState("");
    const [gameType, setGameType] = useState("Vlastní");


    
    const handleGameTypeChange = (e) => {
        setGameType(e.target.value);
    }

    const handleManualPointChange = (e) => {
        setGameType("Vlastní");
    }

    const handlePositionsChange = () => {

    }
    
    const handleSubmit = async () => {

    }

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

    if (loading) return <h1>Načítání...</h1>;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return(
        <div className="create-camp-container">
            <Header goBackLink="/main-page" editLink1="#" editLink2="#" showIcons="true"/>  
            <NavbarButtons/>
            <Heading text="Vložení týmových bodů" level={1} className="nadpish1" />
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Zadejte název hry</label>
                    <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} required placeholder="Název hry"/>
                </div>

                <SelectDay selectedDay={day} onDayChange={setDay} />

                <div>
                    <label>Typ hry</label>
                    <select value={gameType} onChange={handleGameTypeChange}>
                        <option value="Vlastní">Vlastní</option>
                        {campData.gameTypes.map((type, index) => (
                            <option key={index} value={type.type}>{type.type}</option>
                        ))
                        }
                    </select>
                </div>
                
                <button className="submitbutton" type="submit">Potvrdit</button>
            </form>
        </div>
    );
}

export default TeamPoints;