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

    const remark = {
      text,
      type,
      isRange,
      date: isRange ? `${rangeStart} to ${rangeEnd}` : singleDate,
    };

    onSave(remark);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Add Remark</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Type:</label>
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
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isRange}
                onChange={(e) => setIsRange(e.target.checked)}
              />
              Range of Dates
            </label>
          </div>
          {isRange ? (
            <>
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
            </>
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
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemarkModal;
