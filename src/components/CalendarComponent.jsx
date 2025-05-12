import React, { useState, useEffect, useRef } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";
import * as htmlToImage from "html-to-image";
import {
  parseISO,
  format,
  isSaturday,
  isSunday,
  getDay,
} from "../utils/dateUtils";
import { eachDayOfInterval } from "../utils/dateRangeUtils";
import { isSameDay, getWeekOfMonth } from "../utils/dateComparisonUtils";
import RemarkModal from "./RemarkModal";
import SetupModal from "./SetupModal";
import "./CalendarComponent.css";

const CalendarComponent = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sem, setSem] = useState(null);
  const [dept, setDept] = useState("");
  const [startYear, setStartYear] = useState(null);
  const [endYear, setEndYear] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const calendarRef = useRef();

  useEffect(() => {
    if (!startDate || !endDate) return;

    const generateCalendar = () => {
      const allDays = eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate),
      }).filter((day) => !isSunday(day));

      const groupedWeeks = [];
      let currentWeek = [];
      const startWeekday = getDay(parseISO(startDate));

      allDays.forEach((day, index) => {
        currentWeek.push(day);
        if (getDay(day) === 6 || index === allDays.length - 1) {
          groupedWeeks.push(currentWeek);
          currentWeek = [];
        }
      });

      setWeeks(groupedWeeks);
    };

    generateCalendar();
  }, [startDate, endDate]);

  const getWeekMonthDisplay = (weekDays) => {
    const months = new Set();
    weekDays.forEach(day => {
      if (day) {
        months.add(format(day, 'MMM').toUpperCase());
      }
    });
    
    const uniqueMonths = Array.from(months);
    return uniqueMonths.length > 1 
      ? uniqueMonths.join('/') 
      : uniqueMonths[0] || '';
  };

  const shouldHighlight = (date) => {
    if (isSaturday(date)) return false;

    return remarks.some((remark) => {
      if (remark.isRange) {
        const [rangeStart, rangeEnd] = remark.date.split(" to ");
        const start = parseISO(rangeStart);
        const end = parseISO(rangeEnd);
        return date >= start && date <= end;
      } else {
        return isSameDay(parseISO(remark.date), date);
      }
    });
  };

  const isNonWorkingDay = (date) => {
    if (isSaturday(date)) {
      const isHolidaySaturday = remarks.some((remark) => {
        if (remark.isRange) {
          const [rangeStart, rangeEnd] = remark.date.split(" to ");
          const start = parseISO(rangeStart);
          const end = parseISO(rangeEnd);
          return (
            date >= start &&
            date <= end &&
            remark.type === "holiday"
          );
        } else {
          return (
            isSameDay(parseISO(remark.date), date) &&
            remark.type === "holiday"
          );
        }
      });

      const weekOfMonth = getWeekOfMonth(date);
      return isHolidaySaturday || weekOfMonth === 1 || weekOfMonth === 3;
    }

    return remarks.some((remark) => {
      if (remark.isRange) {
        const [rangeStart, rangeEnd] = remark.date.split(" to ");
        const start = parseISO(rangeStart);
        const end = parseISO(rangeEnd);
        return (
          date >= start &&
          date <= end &&
          remark.type === "holiday"
        );
      } else {
        return (
          isSameDay(parseISO(remark.date), date) &&
          remark.type === "holiday"
        );
      }
    });
  };

  const getWeekRemarks = (weekDays) => {
    const weekRemarks = [];

    remarks.forEach((remark) => {
      if (remark.isRange) {
        const [rangeStart, rangeEnd] = remark.date.split(" to ");
        const start = parseISO(rangeStart);
        const end = parseISO(rangeEnd);
        
        // Find dates in this week that fall within the range
        const datesInWeek = weekDays.filter(day => 
          day >= start && day <= end
        );

        if (datesInWeek.length > 0) {
          // If all days in range are in this week, show full range
          if (datesInWeek.length === (end.getDate() - start.getDate() + 1)) {
            weekRemarks.push({
              date: `${format(start, "do")} to ${format(end, "do")}`,
              text: remark.text,
              type: remark.type,
              isRange: true
            });
          } 
          // Otherwise break down by individual dates in this week
          else {
            // Group consecutive dates
            const consecutiveGroups = [];
            let currentGroup = [datesInWeek[0]];
            
            for (let i = 1; i < datesInWeek.length; i++) {
              const prevDate = datesInWeek[i-1];
              const currDate = datesInWeek[i];
              const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);
              
              if (diffDays === 1) {
                currentGroup.push(currDate);
              } else {
                consecutiveGroups.push([...currentGroup]);
                currentGroup = [currDate];
              }
            }
            consecutiveGroups.push([...currentGroup]);
            
            // Create remarks for each group
            consecutiveGroups.forEach(group => {
              if (group.length > 1) {
                weekRemarks.push({
                  date: `${format(group[0], "do")} to ${format(group[group.length-1], "do")}`,
                  text: remark.text,
                  type: remark.type,
                  isRange: true
                });
              } else {
                weekRemarks.push({
                  date: group[0],
                  text: remark.text,
                  type: remark.type,
                  isRange: false
                });
              }
            });
          }
        }
      } else {
        const remarkDate = parseISO(remark.date);
        if (weekDays.some((day) => isSameDay(remarkDate, day))) {
          weekRemarks.push({
            date: remarkDate,
            text: remark.text,
            type: remark.type,
            isRange: false
          });
        }
      }
    });

    // Sort remarks by date
    weekRemarks.sort((a, b) => {
      const getFirstDate = (remark) => {
        if (remark.isRange) {
          if (typeof remark.date === 'string') {
            return parseISO(remark.date.split(" to ")[0]);
          }
          return remark.date[0];
        }
        return remark.date;
      };
      
      return getFirstDate(a) - getFirstDate(b);
    });

    return (
      <div className="remarks-column">
        {weekRemarks
          .filter(remark => 
            !(!remark.isRange && 
              remark.type === "holiday" && 
              remark.text.includes("Saturday"))
          )
          .map((remark, index) => (
            <div key={index} className={`remark-item ${remark.type}`}>
              {remark.isRange 
                ? remark.date 
                : format(remark.date, "do")} – {remark.text}
            </div>
          ))}
      </div>
    );
  };

  const handleAddRemark = (remark) => {
    setRemarks((prev) => [...prev, remark]);
  };

  const countWorkingDays = (weekDays) => {
    return weekDays.filter((day) => !isNonWorkingDay(day)).length;
  };

  const clearData = () => {
    setStartDate("");
    setEndDate("");
    setSem(null);
    setDept("");
    setStartYear(null);
    setEndYear(null);
    setRemarks([]);
    setWeeks([]);
  };

  const handleExport = async () => {
    if (calendarRef.current) {
      const dataUrl = await htmlToImage.toJpeg(calendarRef.current);
      const link = document.createElement("a");
      link.download = `${sem} UG Calendar of events.jpg`;
      link.href = dataUrl;
      link.click();
    }
  };

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div ref={calendarRef}>
      <div className="calendar-container">
        <h1>Dayananda Sagar College of Engineering</h1>
        {dept && <h2>{dept}</h2>}
        <h3>{sem && `SEM ${sem}`} UG CALENDAR OF EVENTS</h3>
        <h4>
          {startYear}-{endYear}
        </h4>

        {startDate && endDate ? (
          <div>
            <div className="calendar-button-container">
              <button
                className="add-remark-btn"
                onClick={() => setShowModal(true)}
              >
                Add Remark
              </button>
              <button
                className="clear-btn"
                onClick={clearData}
              >
                Clear Data
              </button>
              <button
                className="save-btn"
                onClick={handleExport}
              >
                Save
              </button>
            </div>

            <table className="calendar-table">
              <thead>
                <tr>
                  <th>WEEK NO.</th>
                  <th>MONTH</th>
                  {weekdays.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                  <th>NO. OF WORKING DAYS</th>
                  <th>REMARK</th>
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => {
                  const workingDays = countWorkingDays(week);
                  const firstWeekDay = getDay(week[0]);

                  return (
                    <tr key={weekIndex}>
                      <td>{weekIndex + 1}</td>
                      <td>{getWeekMonthDisplay(week)}</td>
                      {weekdays.map((_, i) => {
                        if (weekIndex === 0 && i < firstWeekDay - 1) {
                          return <td key={`${weekIndex}-${i}`}></td>;
                        }

                        const dayIndex = weekIndex === 0
                          ? i - (firstWeekDay - 1)
                          : i;
                        const dayDate = week[dayIndex];
                        
                        if (!dayDate) return <td key={`${weekIndex}-${i}`}></td>;

                        return (
                          <td
                            key={`${weekIndex}-${i}`}
                            className={
                              isNonWorkingDay(dayDate)
                                ? "holiday"
                                : shouldHighlight(dayDate)
                                ? "event"
                                : ""
                            }
                          >
                            {format(dayDate, "d")}
                            {(isNonWorkingDay(dayDate) || shouldHighlight(dayDate)) && (
                              <sup>*</sup>
                            )}
                          </td>
                        );
                      })}
                      <td>{workingDays}</td>
                      <td className="remarks-cell">
                        {getWeekRemarks(week)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan={weekdays.length + 3}
                    style={{
                      textAlign: "left",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div>
                        <strong>Note:</strong>
                        <ul
                          style={{
                            margin: "5px 0 0 20px",
                            padding: 0,
                          }}
                        >
                          <li>
                            Dates marked with * indicate holidays or events
                          </li>
                          <li>Holidays are highlighted in red</li>
                          <li>Events are highlighted in blue</li>
                        </ul>
                      </div>
                      <div
                        style={{
                          fontStyle: "italic",
                          marginTop: "10px",
                        }}
                      >
                        This calendar is generated for academic purposes only.
                      </div>
                      <div
                        style={{
                          marginTop: "15px",
                          fontSize: "0.9em",
                        }}
                      >
                        <strong>Legend:</strong>
                        <div
                          style={{
                            display: "flex",
                            gap: "15px",
                            marginTop: "5px",
                          }}
                        >
                          <span style={{ color: "#ff0000" }}>
                            ■ Holiday
                          </span>
                          <span style={{ color: "#2980b9" }}>
                            ■ Event
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="no-data-container">
            <h1>NO DATA YET!</h1>
            {!showSetupModal && (
              <button
                className="generate-calender"
                onClick={() => setShowSetupModal(true)}
              >
                Generate Calendar
              </button>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <RemarkModal
          onClose={() => setShowModal(false)}
          onSave={handleAddRemark}
        />
      )}

      <SetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        setSem={setSem}
        setStartYear={setStartYear}
        setEndYear={setEndYear}
        setDept={setDept}
      />
    </div>
  );
};

export default CalendarComponent;