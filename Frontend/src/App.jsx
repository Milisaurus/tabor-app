// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./StartPage";
import CreateCamp from "./CreateCamp";
import IndividualPoints from "./IndividualPointsPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/create-camp" element={<CreateCamp />} />
                <Route path="/individual-points" element={<IndividualPoints/>} />
            </Routes>
        </Router>
    );
}

export default App;
