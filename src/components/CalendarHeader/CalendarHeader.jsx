import React from 'react';
import './CalendarHeader.css';

const CalendarHeader = ({ dept, sem, startYear, endYear }) => {
    return (
        <div className="calendar-header">
            <h1>Dayananda Sagar College of Engineering</h1>
            {dept && <h2>{dept}</h2>}
            {sem && <h3>SEM {sem} UG CALENDAR OF EVENTS</h3>}
            {startYear && endYear && <h4>{startYear}-{endYear}</h4>}
        </div>
    );
};

export default CalendarHeader;
