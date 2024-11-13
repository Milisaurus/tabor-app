import React, { useState } from "react"

// COMPONENT IMPORT
import Header from "../components/Header/Header";
import NavbarButtons from "../components/NavbarButtons/NavbarButtons";

import "../css/CreateCamp.css"

const TeamPoints = () => {
    return(
        <div>
            <Header goBackLink="/main-page" editLink1="#" editLink2="#"/>
            <NavbarButtons/>
            <h1>Vložení týmových bodů</h1>
        </div>
    );
}

export default TeamPoints;