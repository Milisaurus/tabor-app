import React, { useState, useEffect } from 'react';
import './Loading.css'; // Připojení CSS souboru

const Loader = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + '.';
        } else {
          return '';
        }
      });
    }, 300); // Změna každých 500 ms

    return () => clearInterval(interval); // Vyčištění při odmountování komponenty
  }, []);

  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p className="loading-text">Načítání{dots}</p>
    </div>
  );
};

export default Loader;
