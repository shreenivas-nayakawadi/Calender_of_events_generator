import React from 'react';
import './CalendarControls.css';

const CalendarControls = ({ onAddRemark, onClear, onExport, onUndo, remarksLength }) => {
    return (
        <div className="calendar-controls-container">
            <button
                className="control-btn undo-btn"
                onClick={onUndo}
                disabled={remarksLength === 0}
            >
                Undo Last Remark
            </button>
            <button className="control-btn add-remark-btn" onClick={onAddRemark}>
                Add Remark
            </button>
            <button className="control-btn clear-btn" onClick={onClear}>
                Clear Data
            </button>
            <button className="control-btn save-btn" onClick={onExport}>
                Save as JPG
            </button>
        </div>
    );
};

export default CalendarControls;
