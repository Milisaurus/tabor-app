// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import CreateCamp from "./CreateCamp";

import MainPage from "./MainPage";
import ActivityHistory from "./ActivityHistory";
import TeamPoints from "./TeamPointsPage";
import IndividualPoints from "./IndividualPointsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/create-camp" element={<CreateCamp />} />
                <Route path="/main-page" element={<MainPage/>} />
                <Route path="/activity-history" element={<ActivityHistory/>} />
                <Route path="/team-points" element={<TeamPoints/>} />
                <Route path="/individual-points" element={<IndividualPoints/>} />
            </Routes>
        </Router>
    );
}

export default App;
