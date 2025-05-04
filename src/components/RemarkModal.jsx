import React, { useState } from 'react';
import './RemarkModal.css';

const RemarkModal = ({ onClose, onSave }) => {
    const [date, setDate] = useState('');
    const [text, setText] = useState('');
    const [type, setType] = useState('event');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (date && text) {
        onSave({ date, text, type });
      }
    };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add Remark</h3>
        <button className="close-button" onClick={onClose}>×</button>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date:</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Remark:</label>
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              required 
            />
          </div>
          
          <div className="form-group">
            <label>Type:</label>
            <div>
              <label>
                <input
                  type="radio"
                  checked={type === 'event'}
                  onChange={() => setType('event')}
                />
                Event
              </label>
              <label>
                <input
                  type="radio"
                  checked={type === 'holiday'}
                  onChange={() => setType('holiday')}
                />
                Holiday
              </label>
            </div>
          </div>
          
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