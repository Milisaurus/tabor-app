import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ goBackLink, editLink1, editLink2, 
                showIconsLeft = true, showIconsRight = true}) => {
    return (
        <header className="header">
            {/* Show icons only if showIcons === true */}
            {showIconsLeft ? (
                <div className="left-icon">
                    <Link to={goBackLink} className="icon-button left-icon">
                        <img src="/back-button.png" alt="Zpět" />
                    </Link>
                </div>
            ) : (
                <div className="left-icon" style={{ visibility: 'hidden' }}>
                    <div className="icon-button left-icon"></div>
                </div>
            )}

            <Link to="/main-page">
                <h1 className="app-name">tabor.app</h1>
            </Link>

            {showIconsRight ? (
                <div className="right-icons">
                    <Link to={editLink1}>
                        <img src="/edit-teams-button.png" alt="Editovat týmy" />
                    </Link>
                    <Link to={editLink2}>
                        <img src="/edit-points-button.png" alt="Editovat typ bodování her" />
                    </Link>
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
