import React from 'react';
import './NoData.css';

const NoData = ({ onGenerate }) => {
    return (
        <div className="no-data-container">
            <h1>NO DATA YET!</h1>
            <button className="generate-calendar-btn" onClick={onGenerate}>
                Generate Calendar
            </button>
        </div>
    );
};

export default NoData;