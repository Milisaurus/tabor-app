// Author Milan Vrbas <xvrbas01>
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ goBackLink, editLink1, editLink2, 
                showIconsLeft = true, showIconsRight = true}) => {
    return (
        <header className="header">
            {/* Show icons only if showIcons === true */}
            {showIconsLeft ? (
                <div className="left-icon" title="Zpět na úvodní stránku">
                    <Link to={goBackLink} className="icon-button left-icon">
                        <img src="/back-button.png" alt="Zpět" />
                    </Link>
                </div>
            ) : (
                <div className="left-icon" style={{ visibility: 'hidden' }}>
                    <div className="icon-button left-icon"></div>
                </div>
            )}

            <Link to="/main-page" title="Zpět na hlavní stránku">
                <h1 className="app-name">tabor.app</h1>
            </Link>

            {/* Show the right icons only if showIconsRight is true */}
            {showIconsRight ? (
                <div className="right-icons">
                    {/* Dropdown for multiple links */}
                    <div className="dropdown">
                        <button className="dropbtn">
                            <img src="/drop-down.png" alt="Editovat týmy" title="Klikněte pro úpravu týmů" />
                        </button>
                        <div className="dropdown-content">
                            <Link to={"/edit-teams"}>Editovat týmy</Link>
                            <Link to={"/odd-even"}>Přiřazení sudých/lichých</Link>
                            <Link to={"/competition-table"}>Soutěžní tabulka</Link>
                            {/* Přidej další odkazy podle potřeby */}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="right-icons" style={{ visibility: 'hidden' }}>
                    <div></div>
                </div>
            )}
        </header>
    );
};

export default Header;
