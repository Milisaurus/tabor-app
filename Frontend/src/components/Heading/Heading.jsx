// Heading.jsx
import React from 'react';
import "./Heading.css"

const Heading = ({ text, level = 1, className = "" }) => {
  const Tag = `h${level}`; // Dynamicky určíme úroveň nadpisu

  return <Tag className={className}>{text}</Tag>;
};

export default Heading;
