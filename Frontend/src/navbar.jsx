import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './css/Navbar.css';

const Navbar = () => {
    return(
        <nav>
            <Link to="#" className="nav-button">
                <button>Historie Aktivit</button>
            </Link>
            <Link to="#" className="nav-button">
                <button>Vložení týmových bodů</button>
            </Link>
            <Link to="/individual-points" className="nav-button">
                <button>Vložení individuálních bodů</button>
            </Link>
        </nav>
    );
}

export default Navbar 