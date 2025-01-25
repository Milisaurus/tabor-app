// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// PAGE IMPORT
import StartPage from "./pages/StartPage";
import CreateCamp from "./pages/CreateCamp";
import MainPage from "./pages/MainPage";
import TeamPoints from "./pages/TeamPointsPage";
import IndividualPoints from "./pages/IndividualPointsPage";
import EditTeams from "./pages/EditTeam";
import EditTeamGame from "./pages/EditTeamGame";
import EditIndividualActivity from "./pages/EditIndividualGame";
import OddEvenPage from "./pages/OddEvenPage";

function App() {
    return (
        // Wrapping the application in Router for routing functionality
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/create-camp" element={<CreateCamp />} />
                <Route path="/main-page" element={<MainPage/>} />
                <Route path="/team-points" element={<TeamPoints/>} />
                <Route path="/individual-points" element={<IndividualPoints/>} />
                <Route path="/edit-teams" element={<EditTeams />} />
                <Route path="edit-team-game" element={<EditTeamGame/>} />
                <Route path="edit-individual-activity" element={<EditIndividualActivity/>}/>
                <Route path="odd-even" element={<OddEvenPage/>}/>
            </Routes>
        </Router>
    );
}

export default App;
