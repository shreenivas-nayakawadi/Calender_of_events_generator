import React, { useState } from "react";
import "./RemarkModal.css";

const RemarkModal = ({ onClose, onSave }) => {
  const [text, setText] = useState("");
  const [type, setType] = useState("holiday");
  const [isRange, setIsRange] = useState(false);
  const [singleDate, setSingleDate] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || (isRange && (!rangeStart || !rangeEnd)) || (!isRange && !singleDate)) {
      alert("Please fill all required fields.");
      return;
    }

    if (isRange && new Date(rangeStart) > new Date(rangeEnd)) {
        alert("Start date cannot be after end date.");
        return;
    }

    const remark = {
      text,
      type,
      isRange,
      date: isRange ? `${rangeStart} to ${rangeEnd}` : singleDate,
    };

    onSave(remark);
    // No need to call onClose here, App.jsx will handle it
  };

  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Add Remark</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className="form-group radio-group">
            <label>Type:</label>
            <div className="radio-options">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="holiday"
                  checked={type === "holiday"}
                  onChange={(e) => setType(e.target.value)}
                />
                Holiday
              </label>
              <label>
                <input
                  type="radio"
                  name="type"
                  value="event"
                  checked={type === "event"}
                  onChange={(e) => setType(e.target.value)}
                />
                Event
              </label>
            </div>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isRange}
                onChange={(e) => setIsRange(e.target.checked)}
              />
              Is this a date range?
            </label>
          </div>
          {isRange ? (
            <div className="date-range-group">
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={singleDate}
                onChange={(e) => setSingleDate(e.target.value)}
                required
              />
            </div>
          )}
          <div className="modal-actions">
            <button type="button" className="modal-cancel-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-submit-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemarkModal;
