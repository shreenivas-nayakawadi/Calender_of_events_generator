import React, { useState, useEffect, useRef, createRef } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";
import * as htmlToImage from "html-to-image";

// import { format, eachDayOfInterval, isSameDay, parseISO, getDay, isSaturday, getWeekOfMonth, isSunday } from 'date-fns';
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

                  // Get the starting weekday (0=Sun, 1=Mon, ..., 6=Sat)
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

      const shouldHighlight = (date) => {
            if (isSaturday(date)) {
                  const weekOfMonth = getWeekOfMonth(date);
                  return weekOfMonth === 1 || weekOfMonth === 3;
            }

            return remarks.some(
                  (remark) =>
                        isSameDay(parseISO(remark.date), date) &&
                        remark.type === "holiday"
            );
      };

      const isNonWorkingDay = (date) => {
            if (isSaturday(date)) {
                  const weekOfMonth = getWeekOfMonth(date);
                  return weekOfMonth === 1 || weekOfMonth === 3;
            }

            return remarks.some(
                  (remark) =>
                        isSameDay(parseISO(remark.date), date) &&
                        remark.type === "holiday"
            );
      };

      const getWeekRemarks = (weekDays) => {
            const weekRemarks = [];

            weekDays.forEach((day) => {
                  if (isSaturday(day)) {
                        const weekOfMonth = getWeekOfMonth(day);
                        if (weekOfMonth === 1 || weekOfMonth === 3) {
                              weekRemarks.push({
                                    date: day,
                                    text: `${
                                          weekOfMonth === 1 ? "First" : "Third"
                                    } Saturday Holiday`,
                                    type: "holiday",
                              });
                        }
                  }
            });

            remarks.forEach((remark) => {
                  const remarkDate = parseISO(remark.date);
                  if (weekDays.some((day) => isSameDay(remarkDate, day))) {
                        weekRemarks.push({
                              date: remarkDate,
                              text: remark.text,
                              type: remark.type,
                        });
                  }
            });

            weekRemarks.sort((a, b) => a.date - b.date);

            return (
                  <div className="remarks-column">
                        {weekRemarks.map((remark, index) => (
                              <div
                                    key={index}
                                    className={`remark-item ${remark.type}`}
                              >
                                    {format(remark.date, "do")} – {remark.text}
                              </div>
                        ))}
                  </div>
            );
      };

      const handleAddRemark = (remark) => {
            setRemarks((prev) => [...prev, remark]);
            setShowModal(false);
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
                        {dept &&(<h2>{dept}</h2>)}
                        <h3>{sem && `SEM ${sem}`} UG CALENDAR OF EVENTS</h3>
                        <h4>
                              {startYear}-{endYear}
                        </h4>

                        {startDate && endDate ? (
                              <div>
                                    <div className="calendar-button-container">
                                          <button
                                                className="add-remark-btn"
                                                onClick={() =>
                                                      setShowModal(true)
                                                }
                                          >
                                                Add Remark
                                          </button>
                                          <button
                                                className="clear-btn"
                                                onClick={() => clearData()}
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
                                                            <th key={day}>
                                                                  {day}
                                                            </th>
                                                      ))}
                                                      <th>
                                                            NO. OF WORKING DAYS
                                                      </th>
                                                      <th>REMARK</th>
                                                </tr>
                                          </thead>
                                          <tbody>
                                                {weeks.map(
                                                      (week, weekIndex) => {
                                                            const month =
                                                                  format(
                                                                        week[0],
                                                                        "MMM"
                                                                  );
                                                            const workingDays =
                                                                  countWorkingDays(
                                                                        week
                                                                  );
                                                            const firstWeekDay =
                                                                  getDay(
                                                                        week[0]
                                                                  );

                                                            return (
                                                                  <tr
                                                                        key={
                                                                              weekIndex
                                                                        }
                                                                  >
                                                                        <td>
                                                                              {weekIndex +
                                                                                    1}
                                                                        </td>
                                                                        <td>
                                                                              {
                                                                                    month
                                                                              }
                                                                        </td>
                                                                        {weekdays.map(
                                                                              (
                                                                                    day,
                                                                                    i
                                                                              ) => {
                                                                                    // For first week, skip days before start date
                                                                                    if (
                                                                                          weekIndex ===
                                                                                                0 &&
                                                                                          i <
                                                                                                firstWeekDay -
                                                                                                      1
                                                                                    ) {
                                                                                          return (
                                                                                                <td
                                                                                                      key={`${weekIndex}-${i}`}
                                                                                                ></td>
                                                                                          );
                                                                                    }

                                                                                    const dayIndex =
                                                                                          weekIndex ===
                                                                                          0
                                                                                                ? i -
                                                                                                  (firstWeekDay -
                                                                                                        1)
                                                                                                : i;
                                                                                    const dayDate =
                                                                                          week[
                                                                                                dayIndex
                                                                                          ];

                                                                                    if (
                                                                                          !dayDate
                                                                                    )
                                                                                          return (
                                                                                                <td
                                                                                                      key={`${weekIndex}-${i}`}
                                                                                                ></td>
                                                                                          );

                                                                                    const isSat =
                                                                                          isSaturday(
                                                                                                dayDate
                                                                                          );
                                                                                    const weekOfMonth =
                                                                                          getWeekOfMonth(
                                                                                                dayDate
                                                                                          );
                                                                                    const isFirstOrThirdSat =
                                                                                          isSat &&
                                                                                          (weekOfMonth ===
                                                                                                1 ||
                                                                                                weekOfMonth ===
                                                                                                      3);

                                                                                    return (
                                                                                          <td
                                                                                                key={`${weekIndex}-${i}`}
                                                                                                className={
                                                                                                      shouldHighlight(
                                                                                                            dayDate
                                                                                                      )
                                                                                                            ? "holiday"
                                                                                                            : ""
                                                                                                }
                                                                                          >
                                                                                                {format(
                                                                                                      dayDate,
                                                                                                      "d"
                                                                                                )}
                                                                                                {isFirstOrThirdSat && (
                                                                                                      <sup>
                                                                                                            *
                                                                                                      </sup>
                                                                                                )}
                                                                                          </td>
                                                                                    );
                                                                              }
                                                                        )}
                                                                        <td>
                                                                              {
                                                                                    workingDays
                                                                              }
                                                                        </td>
                                                                        <td className="remarks-cell">
                                                                              {getWeekRemarks(
                                                                                    week
                                                                              )}
                                                                        </td>
                                                                  </tr>
                                                            );
                                                      }
                                                )}
                                          </tbody>
                                          <tfoot>
                                                <tr>
                                                      <td
                                                            colSpan={
                                                                  weekdays.length +
                                                                  3
                                                            }
                                                            style={{
                                                                  textAlign:
                                                                        "left",
                                                                  padding: "10px",
                                                            }}
                                                      >
                                                            <div
                                                                  style={{
                                                                        display: "flex",
                                                                        flexDirection:
                                                                              "column",
                                                                        gap: "8px",
                                                                  }}
                                                            >
                                                                  <div>
                                                                        <strong>
                                                                              Note:
                                                                        </strong>
                                                                        <ul
                                                                              style={{
                                                                                    margin: "5px 0 0 20px",
                                                                                    padding: 0,
                                                                              }}
                                                                        >
                                                                              <li>
                                                                                    Dates
                                                                                    marked
                                                                                    with
                                                                                    *
                                                                                    indicate
                                                                                    1st/3rd
                                                                                    Saturday
                                                                                    holidays
                                                                              </li>
                                                                              <li>
                                                                                    Holidays
                                                                                    are
                                                                                    highlighted
                                                                                    in
                                                                                    red
                                                                              </li>
                                                                              <li>
                                                                                    Events
                                                                                    are
                                                                                    marked
                                                                                    separately
                                                                                    in
                                                                                    remarks
                                                                                    column
                                                                              </li>
                                                                        </ul>
                                                                  </div>
                                                                  <div
                                                                        style={{
                                                                              fontStyle:
                                                                                    "italic",
                                                                              marginTop:
                                                                                    "10px",
                                                                        }}
                                                                  >
                                                                        This
                                                                        calendar
                                                                        is
                                                                        generated
                                                                        for
                                                                        academic
                                                                        purposes
                                                                        only.
                                                                        Please
                                                                        verify
                                                                        all
                                                                        dates
                                                                        with the
                                                                        official
                                                                        university
                                                                        schedule.
                                                                  </div>
                                                                  <div
                                                                        style={{
                                                                              marginTop:
                                                                                    "15px",
                                                                              fontSize: "0.9em",
                                                                        }}
                                                                  >
                                                                        <strong>
                                                                              Legend:
                                                                        </strong>
                                                                        <div
                                                                              style={{
                                                                                    display: "flex",
                                                                                    gap: "15px",
                                                                                    marginTop:
                                                                                          "5px",
                                                                              }}
                                                                        >
                                                                              <span
                                                                                    style={{
                                                                                          color: "#ff0000",
                                                                                    }}
                                                                              >
                                                                                    ■
                                                                                    Holiday
                                                                              </span>
                                                                              <span
                                                                                    style={{
                                                                                          color: "#007bff",
                                                                                    }}
                                                                              >
                                                                                    ■
                                                                                    Event
                                                                              </span>
                                                                              <span>
                                                                                    ■
                                                                                    Normal
                                                                                    Working
                                                                                    Day
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
                                                onClick={() =>
                                                      setShowSetupModal(true)
                                                }
                                          >
                                                Generate Calender
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
