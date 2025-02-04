// Author Milan Vrbas <xvrbas01>
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import DropDownMenu from '../DropDownMenu/DropDownMenu';


const Header = ({ goBackLink, editLink1, editLink2, 
                showIconsLeft = true, showIconsRight = true}) => {
    return (
        <header className="header">
            {/* Show icons only if showIcons === true */}
            {showIconsLeft ? (
                <div className="left-icon" title="Zpět na úvodní stránku">
                    <Link to={goBackLink} className="icon-button left-icon">
                        <img src="/back.png" alt="Zpět" />
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
                    <DropDownMenu/>
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
