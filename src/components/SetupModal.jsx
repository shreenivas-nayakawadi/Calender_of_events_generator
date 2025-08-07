import React, { useState } from "react";
import "./SetupModal.css";

const SetupModal = ({ isOpen, onClose, onSetup }) => {
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        weeks: 14,
        sem: 1,
        dept: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { startDate, endDate, weeks, sem, dept } = formData;

        if (!startDate || !endDate) {
            alert("Please select both start and end dates");
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            alert("Start date must be before end date");
            return;
        }

        const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
        const calculatedWeeks = Math.ceil((end - start) / millisecondsPerWeek);

        if (calculatedWeeks < 14 || calculatedWeeks > 16) {
            alert(`The selected dates span ${calculatedWeeks} weeks. Dates must be between 14-16 weeks.`);
            return;
        }

        if (calculatedWeeks !== Number(weeks)) {
            alert(`The selected dates span ${calculatedWeeks} weeks, which doesn't match your input of ${weeks} weeks.`);
            return;
        }

        const startYear = start.getFullYear();
        const endYear = end.getFullYear();
        
        // Pass all data up in a single object
        onSetup({
            startDate,
            endDate,
            sem,
            dept,
            startYear: startYear === endYear ? startYear - 1 : startYear,
            endYear
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
                <h2>Calendar Setup</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <label>
                        Start Date:
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        End Date:
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Number of Weeks (14–16):
                        <input
                            type="number"
                            name="weeks"
                            min="14"
                            max="16"
                            value={formData.weeks}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Semester (1 - 8):
                        <input
                            type="number"
                            name="sem"
                            min="1"
                            max="8"
                            value={formData.sem}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Department:
                        <select
                            name="dept"
                            value={formData.dept}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Select department</option>
                            <option value="Information Science and Engineering">Information Science and Engineering (ISE)</option>
                            <option value="Computer Science and Engineering">Computer Science and Engineering (CSE)</option>
                            {/* Add other departments as needed */}
                        </select>
                    </label>

                    <button type="submit" className="modal-submit-button">
                        Generate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupModal;
