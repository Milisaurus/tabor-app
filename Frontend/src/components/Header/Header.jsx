import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

import DropDownMenu from '../DropDownMenu/DropDownMenu';

const Header = ({ goBackLink, showIconsLeft = true, showIconsRight = true}) => {
    return (
        <header className="header">
            {/* Show icons only if showIcons === true */}
            {showIconsLeft ? (
                <div className="left-icon">
                    <Link to={goBackLink} className="left-icon">
                        <img src="/back.png" alt="Zpět" title="Zpět"/>
                    </Link>
                </div>

            ) : (
                <div className="left-icon" style={{ visibility: 'hidden' }}>
                    <div className="left-icon"></div>
                </div>
            )}

 

            <Link to="/main-page" title="Zpět na hlavní stránku">
                <h1 className="app-name">tabor.app</h1>
            </Link>

            {/* Show the right icons only if showIconsRight is true */}
            {showIconsRight ? (
                <div className="right-icon" title="Další možnosti">
                    <DropDownMenu/>
                </div>
            ) : (
                <div className="right-icon" style={{ visibility: 'hidden' }}>
                    <div></div>
                </div>
            )}
        </header>
    );
};

export default Header;
