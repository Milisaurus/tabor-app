import React, { useState } from "react"
import "./css/CreateCamp.css"

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";

const TeamPoints = () => {
    return(
        <div>
            <NavbarTitle goBackLink="/main-page" editLink1="#" editLink2="#"/>
            <NavbarButtons/>
            <h1>Vložení týmových bodů</h1>
        </div>
    );
}

export default TeamPoints;