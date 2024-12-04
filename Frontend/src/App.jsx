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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/create-camp" element={<CreateCamp />} />
                <Route path="/main-page" element={<MainPage/>} />
                <Route path="/team-points" element={<TeamPoints/>} />
                <Route path="/individual-points" element={<IndividualPoints/>} />
                <Route path="/edit-teams" element={<EditTeams />} />
            </Routes>
        </Router>
    );
}

export default App;
