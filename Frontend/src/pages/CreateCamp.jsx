import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateCamp, addGameTypes } from "../api";

// COMPONENT IMPORT
import TeamForm from "../components/TeamForm/TeamForm";
import Heading from "../components/Heading/Heading";
import Header from "../components/Header/Header"

import "../css/CreateCamp.css";

const CreateCamp = () => {
    const [teamCount, setTeamCount] = useState("");
    const [teams, setTeams] = useState([]);
    const [currentChildIndexes, setCurrentChildIndexes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCampName = sessionStorage.getItem("camp_name");
        if (!storedCampName) {
          alert("Nebyly nalezeny informace o táboru.");
        }
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allData = {
            campName: sessionStorage.getItem("camp_name"),
            teamCount,
            teams: teams.map((team) => ({
                name: team.name,
                color: team.color,
                leader1: team.leader1,
                leader2: team.leader2,
                childrenCount: team.childrenCount,
                children: team.children,
            })),
        };

        await updateCamp(JSON.stringify(allData));

        await addGameTypes(allData.campName);

        navigate("/main-page");
    };

    const handleTeamCountChange = (e) => {
        const count = parseInt(e.target.value);
        setTeamCount(count);
        const newTeams = Array.from({ length: count }, () => ({
            name: "",
            color: "",
            leader1: "",
            leader2: "",
            childrenCount: "",
            children: [],
        }));
        setTeams(newTeams);
        setCurrentChildIndexes(new Array(count).fill(0));
    };

    const handleTeamChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTeams = [...teams];
        updatedTeams[index][name] = value;

        if (name === "childrenCount" && value !== "") {
            updatedTeams[index].children = Array.from({ length: parseInt(value) }, () => "");
        }

        if (currentChildIndexes[index] >= parseInt(value)) {
            currentChildIndexes[index] = parseInt(value) - 1;
        }

        setTeams(updatedTeams);
        setCurrentChildIndexes([...currentChildIndexes]);
    };

    const handleChildChange = (teamIndex, childIndex, e) => {
        const { value } = e.target;
        const updatedTeams = [...teams];
        updatedTeams[teamIndex].children[childIndex] = value;
        setTeams(updatedTeams);
    };

    const handleChildFormChange = (teamIndex, direction) => {
        const updatedIndexes = [...currentChildIndexes];
        if (direction === "next" && updatedIndexes[teamIndex] < teams[teamIndex].children.length - 1) {
            updatedIndexes[teamIndex]++;
        } else if (direction === "prev" && updatedIndexes[teamIndex] > 0) {
            updatedIndexes[teamIndex]--;
        }
        setCurrentChildIndexes(updatedIndexes);
    };

    return (
        <div className="create-camp-container">
            
            <Header goBackLink="/" editLink1={"#"} editLink2={"#"} showIconsRight={false}/>
            <Heading text="Tvorba Tábora" level={1} className="nadpish1" />

            <form onSubmit={handleSubmit}>
                {/* Teams count */}
                <div>
                    <label htmlFor="teamCount">Počet týmů:</label>
                    <select
                        id="teamCount"
                        value={teamCount}
                        onChange={handleTeamCountChange}
                        required
                    >
                        <option value="" disabled hidden>
                            Počet týmů
                        </option>
                        <option value="1">DEBUG ONLY 1</option>
                        <option value="2">2</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                    </select>
                </div>

                {teams.map((team, index) => (
                    <TeamForm
                        key={index}
                        index={index}
                        team={team}
                        currentChildIndex={currentChildIndexes[index]}
                        handleTeamChange={handleTeamChange}
                        handleChildChange={handleChildChange}
                        handleChildFormChange={handleChildFormChange}
                    />
                ))}
                <button className="linkbutton" type="submit">Vytvořit</button>
            </form>
            <img src="/wave.svg" alt="Wave" className="wave-svg" />
        </div>
    );
};

export default CreateCamp;
