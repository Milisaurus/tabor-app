import React, { useState } from "react"
import "./css/CreateCamp.css"

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";

const ActivityHistory = () => {
    return(
        <div>
            <NavbarTitle goBackLink="/main-page" editLink1="#" editLink2="#"/>
            <NavbarButtons/>
            <h1>Historie Aktivit</h1>
        </div>
    );
}

export default ActivityHistory;