import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";
import Heading from "../components/Heading/Heading";
import { getCamp, updateCamp } from "../api";
import SelectDay from "../components/selectDay/selectDay";

const EditTeamGame = () => {
    const [campData, setCampData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);    
    const [selectedGame, setSelectedGame] = useState();
    const [editedGame, setEditedGame] =useState();

    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const gameNameFromUrl = queryParams.get("name");

    useEffect(() => {
            const fetchCampData = async () => {
                try {
                    const data = await getCamp();
                    if (data) {
                        setCampData(data);
                        if (gameNameFromUrl) {
                            const game = data.teamGames.find(
                                (g) => g.name === gameNameFromUrl
                            );
                            setSelectedGame(game);
                            setEditedGame(game);
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
        const updatedGames = campData.teamGames.map((game) => game.name === selectedGame.name ? editedGame : game);
        const updatedCampData = {...campData,teamGames: updatedGames,};

        try {
            await updateCamp(JSON.stringify(updatedCampData));
            navigate("/main-page");
        } catch (err) {
            console.error("Error updating game data:", err);
        }
    };

    const handleChange = (field, value) => {
        setEditedGame((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (loading) return <h1>Načítání...</h1>;
    if (error) return <h1>Error: {error}</h1>;
    if (!campData) return <h1>No camp data for {sessionStorage.getItem("camp_name")} available.</h1>;

    return(
        <div className="edit-tem-games-page" onSubmit={handleSubmit}>
            <Header goBackLink="/main-page" editLink1={"/edit-teams"} editLink2="#" showIcons="true" />
            <NavbarButtons />
            <Heading text="Úprava týmové hry" level={1} className="nadpish1" />
            <form onSubmit={handleSubmit} className="edit-game-form">
                <div>
                    <input type="text" value={editedGame.name} onChange={(e) => handleChange("name", e.target.value)} required placeholder="Název hry" />
                </div>

                <SelectDay selectedDay={editedGame.day} onDayChange={(newDay) => handleChange("day", newDay)}/>

                <button className="submitbutton" type="submit">Potvrdit</button>

            </form>
        </div>
    )
}

export default EditTeamGame;