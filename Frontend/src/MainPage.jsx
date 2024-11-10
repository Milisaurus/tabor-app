import React, { useState } from "react"
import { Link } from 'react-router-dom';

import NavbarTitle from "./NavbarTitle.jsx";
import NavbarButtons from "./NavbarButtons.jsx";


const MainPage = () => {
    return(
        <div>
            <NavbarTitle goBackLink="/" editLink1={"#"} editLink2={"#"}/>
            <NavbarButtons/>
            <h1>Sledování bodového postupu</h1>

        </div>
    );
}

export default MainPage;