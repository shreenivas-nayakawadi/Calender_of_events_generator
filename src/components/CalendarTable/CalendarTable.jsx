import React from 'react';
import { format as dateFnsFormat, getDay } from 'date-fns';
import './CalendarTable.css';

const CalendarTable = ({
    weeks,
    weekdays,
    getWeekMonthDisplay,
    countWorkingDays,
    getWeekRemarks, // Note: This logic remains complex
    isNonWorkingDay,
    shouldHighlight,
    workingDaysByWeekday,
    totalWorkingDays,
    examStartDate
}) => {

    // This function is complex and was simplified in the hook.
    // The original logic is preserved here for rendering.
    const renderWeekRemarks = (weekDays) => {
        const remarksForWeek = getWeekRemarks(weekDays); // Using the simplified version from hook
        // A more robust implementation would process ranges and sort dates here.
        return (
            <div className="remarks-column">
                {remarksForWeek.map((remark, index) => (
                    <div key={index} className={`remark-item ${remark.type}`}>
                        {remark.isRange ? remark.date : dateFnsFormat(new Date(remark.date), "do")}
                        {' '}&ndash; {remark.text}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="calendar-table-container">
            <table className="calendar-table">
            <thead>
                <tr>
                    <th>WEEK NO.</th>
                    <th>MONTH</th>
                    {weekdays.map((day) => <th key={day}>{day}</th>)}
                    <th>NO. OF WORKING DAYS</th>
                    <th>REMARK</th>
                </tr>
            </thead>
            <tbody>
                {weeks.map((week, weekIndex) => {
                    const firstDayOfWeek = getDay(week[0]); // Sunday: 0, Monday: 1
                    const emptyCells = Array(firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1).fill(null);

                    return (
                        <tr key={weekIndex}>
                            <td>{weekIndex + 1}</td>
                            <td>{getWeekMonthDisplay(week)}</td>
                            {emptyCells.map((_, i) => <td key={`empty-${i}`} className="empty-cell"></td>)}
                            {week.map((day, dayIndex) => (
                                <td
                                    key={dayIndex}
                                    className={
                                        isNonWorkingDay(day) ? "holiday" :
                                        shouldHighlight(day) ? "event" : ""
                                    }
                                >
                                    {dateFnsFormat(day, "d")}
                                    {(isNonWorkingDay(day) || shouldHighlight(day)) && <sup>*</sup>}
                                </td>
                            ))}
                            {/* Fill remaining cells if week is not full */}
                            {Array(6 - (emptyCells.length + week.length)).fill(null).map((_, i) => <td key={`fill-${i}`} className="empty-cell"></td>)}
                            <td>{countWorkingDays(week)}</td>
                            <td className="remarks-cell">{renderWeekRemarks(week)}</td>
                        </tr>
                    );
                })}
            </tbody>
            <tfoot>
                <tr className="totals-row">
                    <td colSpan="2"><strong>Total Working Days</strong></td>
                    {workingDaysByWeekday.map((count, idx) => <td key={idx}><strong>{count}</strong></td>)}
                    <td><strong>{totalWorkingDays}</strong></td>
                    <td></td>
                </tr>
                <tr>
                    <td colSpan={weekdays.length + 4} className="notes-cell">
                        <div className="notes-content">
                            <strong>Note:</strong>
                            <ul>
                                <li>Dates marked with * indicate holidays or events</li>
                                <li><strong>{examStartDate}</strong> Onwards – Semester End Examination (Tentative)</li>
                            </ul>
                        </div>
                    </td>
                </tr>
                 <tr>
                    <td colSpan={weekdays.length + 4} className="signature-cell">
                        <div className="signature-container">
                            <div className="signature-block">
                                <p>__________________________</p>
                                <p><strong>Dean Academics / COE</strong></p>
                            </div>
                            <div className="signature-block">
                                <p>__________________________</p>
                                <p><strong>Principal</strong></p>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
            </table>
        </div>
    );
};

export default CalendarTable;
