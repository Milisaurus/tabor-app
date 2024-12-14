// Author Jan Juračka <xjurac07>

import React from "react";
import "./selectDay.css"

const SelectDay = ({selectedDay, onDayChange}) => {
    const week = [
        "Pondělí",
        "Úterý",
        "Středa",
        "Čtvrtek",
        "Pátek",
        "Sobota",
        "Neděle"
    ];

    return (
        <div className="select-day-component">
            <label>Vyberte den v  týdnu</label>
            <select value={selectedDay} onChange={ (e) => onDayChange(e.target.value)}>
                {week.map((day, index) => (
                        <option key={index} value={day}>{day}</option>
                    )
                )}
            </select>
        </div>
    )
};

export default SelectDay;