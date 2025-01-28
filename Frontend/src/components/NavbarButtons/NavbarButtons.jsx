// Author Jan Juračka <xjurac07>

import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './NavbarButtons.css';

const NavbarButtons = () => {
    return(
        <nav className="navbar-buttons">
            {/* Link to the team points page*/}
            <Link to="/team-points">
                <button className="nav-button">Vložení týmové hry</button>
            </Link>
            {/* Link to the individual points page*/}
            <Link to="/individual-points">
                <button className="nav-button">Vložení individuální aktivity</button>
            </Link>
        </nav>

    );
}

export default NavbarButtons;