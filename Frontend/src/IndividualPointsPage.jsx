import React, { useState } from "react"
import { Link } from 'react-router-dom';
import "./css/CreateCamp.css"

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";


const IndividualPoints = () => {
    return(
        <div>
            <NavbarTitle goBackLink="/main-page" editLink1="#" editLink2="#"/>
            <NavbarButtons/>
            <h1>Vložení individuálních bodů</h1>

        </div>
    );
}

export default IndividualPoints;