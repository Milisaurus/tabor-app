import React, { useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import "./DropDownMenu.css";

const DropDownMenu = () => {
    const dropdownRef = useRef(null); // Create a reference to the dropdown container

    useEffect(() => {
        // Function to close the dropdown if clicked outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                const checkbox = document.getElementById('custom-dropdown');
                if (checkbox) {
                    checkbox.checked = false; // Uncheck the checkbox to close the dropdown
                }
            }
        };

        // Add event listener for clicks
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="custom-dropdown-container" ref={dropdownRef}>
            <input
                className="custom-dropdown-checkbox"
                type="checkbox"
                id="custom-dropdown"
                name="custom-dropdown"
            />
            <label className="custom-dropdown-label" htmlFor="custom-dropdown">
                <img src="drop.png" alt="Dropdown Icon" className="dropdown-icon" />
            </label>
            <div className="custom-dropdown-content">
                <Link to="/edit-teams">
                    <span>
                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" 
                            strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
                            width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editovat týmy
                    </span>
                    <i className="uil uil-arrow-right"></i>
                </Link>

                <Link to="/edit-game-type-points">
                    <span>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    style={{marginLeft:"-3px"}}>
                    <path d="M14 6L8 12V16H12L18 10M14 6L17 3L21 7L18 10M14 6L18 10M10 4L4 4L4 20L20 20V14" 
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                        Editovat typy bodování
                    </span>
                    <i className="uil uil-arrow-right"></i>
                </Link>

                <Link to="/odd-even">
                    <span>
                        <svg fill="none" height="28" width="35" 
                            stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" 
                            strokeWidth="2" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" 
                            style={{ marginLeft:"-3px" ,marginRight: '-7px', marginTop: '7px', verticalAlign: 'middle'}}>
                            <path fill="currentColor" d="M106.666667,1.42108547e-14 L106.666667,42.6666667 
                                L42.6666667,42.6666667 L42.6666667,341.333333 L106.666667,341.333333 L106.666667,384 
                                L1.42108547e-14,384 L1.42108547e-14,1.42108547e-14 L106.666667,1.42108547e-14 Z 
                                M384,1.42108547e-14 L384,384 L277.333333,384 L277.333333,341.333333 L341.333333,341.333333 
                                L341.333333,42.6666667 L277.333333,42.6666667 L277.333333,1.42108547e-14 L384,1.42108547e-14 
                                Z M298.666667,256 L298.666667,298.666667 L85.3333333,298.666667 L85.3333333,256 L298.666667,256 
                                Z M298.666667,170.666667 L298.666667,213.333333 L85.3333333,213.333333 L85.3333333,170.666667 
                                L298.666667,170.666667 Z M298.666667,85.3333333 L298.666667,128 L85.3333333,128 
                                L85.3333333,85.3333333 L298.666667,85.3333333 Z"/>
                        </svg>
                        Přiřazení sudých/lichých
                    </span>
                    <i className="uil uil-arrow-right"></i>
                </Link>

                <Link to="/competition-table">
                    <span>
                        <svg width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M448 32H64C28.65 32 0 60.65 0 96v320c0 35.35 
                            28.65 64 64 64h384c35.35 0 64-28.65 64-64V96C512 60.65 483.3 32 448 
                            32zM64 96h64v64H64V96zM64 224h64v64H64V224zM64 416v-64h64v64H64zM448 
                            416H192v-64h256V416zM448 288H192V224h256V288zM448 160H192V96h256V160z"/>
                        </svg>
                        Soutěžní tabulka
                    </span>
                    <i className="uil uil-arrow-right"></i>
                </Link>
            </div>
        </div>
    );
};

export default DropDownMenu;
