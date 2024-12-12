// Author Milan Vrbas <xvrbas01>
import React from 'react';
import "./Heading.css"

const Heading = ({ text, level = 1, className = "" }) => {
    const Tag = `h${level}`; // Dynamically determine the heading level

    // Render the heading
    return <Tag className={className}>{text}</Tag>;
};

export default Heading;
