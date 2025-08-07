import React from 'react';
import './CalendarFooter.css';

const CalendarFooter = () => {
    return (
        <div className="calendar-footer">
            <div className="footer-row">
                <div className="footer-section">
                    <p><strong>Developed By:</strong></p>
                    <p>
                        Shreenivas Nayakawadi (1DS22IS143)<br />
                        Shreesha Alevoor (1DS22IS144)<br />
                        Siddeshwar M (1DS22IS155)<br />
                        Prashant S N (1DS23IS415)
                    </p>
                </div>
                <div className="footer-section right">
                    <p><strong>Guided By:</strong></p>
                    <p>
                        Mr. Yogesh B S<br />
                        Assistant Professor<br />
                        Department of Information Science and Engineering,<br />
                        DSCE
                    </p>
                </div>
            </div>
            <div className="footer-course">
                <p><strong>Course Name:</strong></p>
                <p>
                    Full Stack Development<br />
                    (B.E. 6th Semester, Information Science and Engineering, DSCE)<br />
                    2024–2025 (IPCC21IS62)
                </p>
            </div>
        </div>
    );
};

export default CalendarFooter;
