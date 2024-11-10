import React from 'react';
import { Link } from 'react-router-dom';
import './css/NavbarTitle.css';

const NavbarTitle = ({ goBackLink, editLink1, editLink2, title }) => {
  return (
    <nav className="navbar">

      <Link to={goBackLink} className="icon-button">
        <img src="/back-button.png" alt="Zpět" className="nav-icon" />
      </Link>

      <div className="navbar-title"><h1>tabor.app</h1></div>

      <div className="navbar-right">
        <Link to={editLink1} className="icon-button">
          <img src="/edit-points-button.png" alt="Bodovaní her" className="nav-icon" />
        </Link>
        
        <Link to={editLink2} className="icon-button">
          <img src="/edit-teams-button.png" alt="Týmy" className="nav-icon" />
        </Link>
      </div>

    </nav>
  );
};

export default NavbarTitle;