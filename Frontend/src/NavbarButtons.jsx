import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './css/NavbarButtons.css';

const NavbarButtons = () => {
    return(
        <nav>
            <Link to="/activity-history" className="nav-button">
                <button>Historie Aktivit</button>
            </Link>
            <Link to="/team-points" className="nav-button">
                <button>Vložení týmových bodů</button>
            </Link>
            <Link to="/individual-points" className="nav-button">
                <button>Vložení individuálních bodů</button>
            </Link>
        </nav>
    );
}

export default NavbarButtons;