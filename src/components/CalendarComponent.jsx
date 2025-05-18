import React, { useState, useEffect, useRef } from "react";
import { exportComponentAsJPEG } from "react-component-export-image";
import * as htmlToImage from "html-to-image";
import {
      addDays,
      format as dateFnsFormat,
      parseISO as dateFnsParseISO,
      isSameDay as dateFnsIsSameDay,
      isSaturday,
      isSunday,
      getDay,
      eachDayOfInterval,
      getDate,
      parse,
} from "date-fns";

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

      const examStartDate = endDate
            ? dateFnsFormat(
                    addDays(dateFnsParseISO(endDate), 5),
                    "do MMMM yyyy"
              )
            : "";

      // Helper function to safely parse dates
      const safeParseISO = (dateString, referenceDate = new Date()) => {
            try {
                  if (dateString instanceof Date) return dateString;

                  // Handle "1st", "2nd" format
                  if (
                        typeof dateString === "string" &&
                        /^\d+[a-z]{2}$/.test(dateString)
                  ) {
                        const day = parseInt(dateString, 10);
                        return new Date(
                              referenceDate.getFullYear(),
                              referenceDate.getMonth(),
                              day
                        );
                  }

                  // Handle "1st to 3rd" format
                  if (
                        typeof dateString === "string" &&
                        dateString.includes(" to ")
                  ) {
                        const firstPart = dateString.split(" to ")[0];
                        const day = parseInt(firstPart, 10);
                        return new Date(
                              referenceDate.getFullYear(),
                              referenceDate.getMonth(),
                              day
                        );
                  }

                  return dateFnsParseISO(dateString);
            } catch (e) {
                  console.error("Failed to parse date:", dateString, e);
                  return referenceDate;
            }
      };

      const getWeekOfMonth = (date) => {
            const firstDayOfMonth = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  1
            );
            const dayOfWeek = firstDayOfMonth.getDay();
            const dayOfMonth = date.getDate();
            return Math.ceil((dayOfMonth + dayOfWeek) / 7);
      };

      const generateDefaultRemarks = (weeks) => {
            const defaultRemarks = [];

            weeks.forEach((week) => {
                  const saturday = week.find((day) => isSaturday(day));

                  if (saturday) {
                        const weekOfMonth = getWeekOfMonth(saturday);

                        if (weekOfMonth === 1 || weekOfMonth === 3) {
                              defaultRemarks.push({
                                    date: dateFnsFormat(saturday, "yyyy-MM-dd"),
                                    text: `${weekOfMonth}${
                                          weekOfMonth === 1 ? "st" : "rd"
                                    } Saturday Holiday`,
                                    type: "holiday",
                                    isRange: false,
                              });
                        }
                  }
            });

            return defaultRemarks;
      };

      useEffect(() => {
            if (!startDate || !endDate) return;

            const generateCalendar = () => {
                  const allDays = eachDayOfInterval({
                        start: dateFnsParseISO(startDate),
                        end: dateFnsParseISO(endDate),
                  }).filter((day) => !isSunday(day));

                  const groupedWeeks = [];
                  let currentWeek = [];
                  const startWeekday = getDay(dateFnsParseISO(startDate));

                  allDays.forEach((day, index) => {
                        currentWeek.push(day);
                        if (getDay(day) === 6 || index === allDays.length - 1) {
                              groupedWeeks.push(currentWeek);
                              currentWeek = [];
                        }
                  });

                  setWeeks(groupedWeeks);

                  const defaultRemarks = generateDefaultRemarks(groupedWeeks);
                  setRemarks(defaultRemarks);
            };

            generateCalendar();
      }, [startDate, endDate]);

      const getWeekMonthDisplay = (weekDays) => {
            const months = new Set();
            weekDays.forEach((day) => {
                  if (day) {
                        months.add(dateFnsFormat(day, "MMM").toUpperCase());
                  }
            });

            const uniqueMonths = Array.from(months);
            return uniqueMonths.length > 1
                  ? uniqueMonths.join("/")
                  : uniqueMonths[0] || "";
      };

      const shouldHighlight = (date) => {
            if (isSaturday(date)) return false;

            return remarks.some((remark) => {
                  if (remark.isRange) {
                        const [rangeStart, rangeEnd] =
                              remark.date.split(" to ");
                        const start = safeParseISO(rangeStart, date);
                        const end = safeParseISO(rangeEnd, date);
                        return date >= start && date <= end;
                  } else {
                        return dateFnsIsSameDay(
                              safeParseISO(remark.date, date),
                              date
                        );
                  }
            });
      };

      const isNonWorkingDay = (date) => {
            if (isSaturday(date)) {
                  const weekOfMonth = getWeekOfMonth(date);
                  if (weekOfMonth === 1 || weekOfMonth === 3) {
                        return true;
                  }

                  return remarks.some((remark) => {
                        if (!remark.isRange) {
                              return (
                                    dateFnsIsSameDay(
                                          safeParseISO(remark.date, date),
                                          date
                                    ) && remark.type === "holiday"
                              );
                        }
                        return false;
                  });
            }

            return remarks.some((remark) => {
                  if (remark.isRange) {
                        const [rangeStart, rangeEnd] =
                              remark.date.split(" to ");
                        const start = safeParseISO(rangeStart, date);
                        const end = safeParseISO(rangeEnd, date);
                        return (
                              date >= start &&
                              date <= end &&
                              remark.type === "holiday"
                        );
                  } else {
                        return (
                              dateFnsIsSameDay(
                                    safeParseISO(remark.date, date),
                                    date
                              ) && remark.type === "holiday"
                        );
                  }
            });
      };

      const getWeekRemarks = (weekDays) => {
            const weekRemarks = [];

            remarks.forEach((remark) => {
                  if (remark.isRange) {
                        const [rangeStart, rangeEnd] =
                              remark.date.split(" to ");
                        const start = safeParseISO(rangeStart, weekDays[0]);
                        const end = safeParseISO(rangeEnd, weekDays[0]);

                        const datesInWeek = weekDays.filter(
                              (day) => day >= start && day <= end
                        );

                        if (datesInWeek.length > 0) {
                              if (
                                    datesInWeek.length ===
                                    end.getDate() - start.getDate() + 1
                              ) {
                                    weekRemarks.push({
                                          date: `${dateFnsFormat(
                                                start,
                                                "do"
                                          )} to ${dateFnsFormat(end, "do")}`,
                                          text: remark.text,
                                          type: remark.type,
                                          isRange: true,
                                    });
                              } else {
                                    const consecutiveGroups = [];
                                    let currentGroup = [datesInWeek[0]];

                                    for (
                                          let i = 1;
                                          i < datesInWeek.length;
                                          i++
                                    ) {
                                          const prevDate = datesInWeek[i - 1];
                                          const currDate = datesInWeek[i];
                                          const diffDays =
                                                (currDate - prevDate) /
                                                (1000 * 60 * 60 * 24);

                                          if (diffDays === 1) {
                                                currentGroup.push(currDate);
                                          } else {
                                                consecutiveGroups.push([
                                                      ...currentGroup,
                                                ]);
                                                currentGroup = [currDate];
                                          }
                                    }
                                    consecutiveGroups.push([...currentGroup]);

                                    consecutiveGroups.forEach((group) => {
                                          if (group.length > 1) {
                                                weekRemarks.push({
                                                      date: `${dateFnsFormat(
                                                            group[0],
                                                            "do"
                                                      )} to ${dateFnsFormat(
                                                            group[
                                                                  group.length -
                                                                        1
                                                            ],
                                                            "do"
                                                      )}`,
                                                      text: remark.text,
                                                      type: remark.type,
                                                      isRange: true,
                                                });
                                          } else {
                                                weekRemarks.push({
                                                      date: group[0],
                                                      text: remark.text,
                                                      type: remark.type,
                                                      isRange: false,
                                                });
                                          }
                                    });
                              }
                        }
                  } else {
                        const remarkDate = safeParseISO(
                              remark.date,
                              weekDays[0]
                        );
                        if (
                              weekDays.some((day) =>
                                    dateFnsIsSameDay(remarkDate, day)
                              )
                        ) {
                              if (isSaturday(remarkDate)) {
                                    const weekOfMonth =
                                          getWeekOfMonth(remarkDate);
                                    if (
                                          weekOfMonth === 1 ||
                                          weekOfMonth === 3
                                    ) {
                                          weekRemarks.push({
                                                date: remarkDate,
                                                text: remark.text,
                                                type: remark.type,
                                                isRange: false,
                                          });
                                    }
                              } else {
                                    weekRemarks.push({
                                          date: remarkDate,
                                          text: remark.text,
                                          type: remark.type,
                                          isRange: false,
                                    });
                              }
                        }
                  }
            });

            weekRemarks.sort((a, b) => {
                  const getFirstDate = (remark) => {
                        if (remark.isRange) {
                              if (typeof remark.date === "string") {
                                    if (remark.date.includes(" to ")) {
                                          const firstDateStr =
                                                remark.date.split(" to ")[0];
                                          const day = parseInt(
                                                firstDateStr,
                                                10
                                          );
                                          return (
                                                weekDays.find(
                                                      (d) => getDate(d) === day
                                                ) || new Date()
                                          );
                                    }
                                    return safeParseISO(
                                          remark.date,
                                          weekDays[0]
                                    );
                              }
                              return remark.date[0];
                        }
                        return safeParseISO(remark.date, weekDays[0]);
                  };

                  const dateA = getFirstDate(a);
                  const dateB = getFirstDate(b);
                  return dateA - dateB;
            });

            return (
                  <div className="remarks-column">
                        {weekRemarks.map((remark, index) => (
                              <div
                                    key={index}
                                    className={`remark-item ${remark.type}`}
                              >
                                    {remark.isRange
                                          ? remark.date
                                          : dateFnsFormat(
                                                  remark.date,
                                                  "do"
                                            )}{" "}
                                    – {remark.text}
                              </div>
                        ))}
                  </div>
            );
      };

      const handleUndoRemark = () => {
            setRemarks((prev) => prev.slice(0, -1));
      };

      const handleAddRemark = (remark) => {
            const isDuplicate = remarks.some((existingRemark) => {
                  if (remark.isRange && existingRemark.isRange) {
                        const [newStart, newEnd] = remark.date.split(" to ");
                        const [existingStart, existingEnd] =
                              existingRemark.date.split(" to ");
                        const newStartDate = safeParseISO(newStart);
                        const newEndDate = safeParseISO(newEnd);
                        const existingStartDate = safeParseISO(existingStart);
                        const existingEndDate = safeParseISO(existingEnd);

                        return (
                              (newStartDate >= existingStartDate &&
                                    newStartDate <= existingEndDate) ||
                              (newEndDate >= existingStartDate &&
                                    newEndDate <= existingEndDate) ||
                              (newStartDate <= existingStartDate &&
                                    newEndDate >= existingEndDate)
                        );
                  } else if (!remark.isRange && !existingRemark.isRange) {
                        return dateFnsIsSameDay(
                              safeParseISO(remark.date),
                              safeParseISO(existingRemark.date)
                        );
                  }
                  if (remark.isRange) {
                        const [rangeStart, rangeEnd] =
                              remark.date.split(" to ");
                        const singleDate = safeParseISO(existingRemark.date);
                        const start = safeParseISO(rangeStart);
                        const end = safeParseISO(rangeEnd);
                        return singleDate >= start && singleDate <= end;
                  } else {
                        const [rangeStart, rangeEnd] =
                              existingRemark.date.split(" to ");
                        const singleDate = safeParseISO(remark.date);
                        const start = safeParseISO(rangeStart);
                        const end = safeParseISO(rangeEnd);
                        return singleDate >= start && singleDate <= end;
                  }
            });

            let hasSystemHoliday = false;
            if (remark.isRange) {
                  const [start, end] = remark.date
                        .split(" to ")
                        .map((d) => safeParseISO(d));
                  let current = new Date(start);
                  while (current <= end) {
                        if (isNonWorkingDay(current)) {
                              hasSystemHoliday = true;
                              break;
                        }
                        current.setDate(current.getDate() + 1);
                  }
            } else {
                  const date = safeParseISO(remark.date);
                  hasSystemHoliday = isNonWorkingDay(date);
            }

            if (hasSystemHoliday) {
                  alert(
                        `Remark conflict! ${
                              hasSystemHoliday
                                    ? "Selected dates include system holidays (1st/3rd Saturdays)"
                                    : "Duplicate date/range exists"
                        }`
                  );
                  return;
            }

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

      const getWorkingDaysByWeekday = () => {
            const counts = [0, 0, 0, 0, 0, 0]; // Mon to Sat (index 0 = Monday)

            weeks.forEach((week) => {
                  week.forEach((day) => {
                        const dayIndex = getDay(day); // Sunday = 0, Saturday = 6
                        if (dayIndex === 0) return; // skip Sunday
                        const adjustedIndex = dayIndex - 1; // shift so Mon = 0, Sat = 5
                        if (!isNonWorkingDay(day)) {
                              counts[adjustedIndex]++;
                        }
                  });
            });

            return counts;
      };

      const handleExport = async () => {
            const buttonContainer = document.querySelector(
                  ".calendar-button-container"
            );

            // Hide buttons
            if (buttonContainer) buttonContainer.style.display = "none";

            if (calendarRef.current) {
                  try {
                        const dataUrl = await htmlToImage.toJpeg(
                              calendarRef.current
                        );
                        const link = document.createElement("a");
                        link.download = `${sem} UG Calendar of events.jpg`;
                        link.href = dataUrl;
                        link.click();
                  } catch (error) {
                        console.error("Image export failed:", error);
                  } finally {
                        // Show buttons again
                        if (buttonContainer)
                              buttonContainer.style.display = "flex";
                  }
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
                                                className="undo-btn"
                                                onClick={handleUndoRemark}
                                                disabled={remarks.length === 0}
                                          >
                                                Undo Last Remark
                                          </button>

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
                                                                              {getWeekMonthDisplay(
                                                                                    week
                                                                              )}
                                                                        </td>
                                                                        {weekdays.map(
                                                                              (
                                                                                    _,
                                                                                    i
                                                                              ) => {
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

                                                                                    return (
                                                                                          <td
                                                                                                key={`${weekIndex}-${i}`}
                                                                                                className={
                                                                                                      isNonWorkingDay(
                                                                                                            dayDate
                                                                                                      )
                                                                                                            ? "holiday"
                                                                                                            : shouldHighlight(
                                                                                                                    dayDate
                                                                                                              )
                                                                                                            ? "event"
                                                                                                            : ""
                                                                                                }
                                                                                          >
                                                                                                {dateFnsFormat(
                                                                                                      dayDate,
                                                                                                      "d"
                                                                                                )}
                                                                                                {(isNonWorkingDay(
                                                                                                      dayDate
                                                                                                ) ||
                                                                                                      shouldHighlight(
                                                                                                            dayDate
                                                                                                      )) && (
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
                                                <tr className="totals-row">
                                                      <td colSpan="2">
                                                            <strong>
                                                                  Total Working
                                                                  Days
                                                            </strong>
                                                      </td>
                                                      {getWorkingDaysByWeekday().map(
                                                            (count, idx) => (
                                                                  <td key={idx}>
                                                                        <strong>
                                                                              {
                                                                                    count
                                                                              }
                                                                        </strong>
                                                                  </td>
                                                            )
                                                      )}
                                                      <td>
                                                            <strong>
                                                                  {getWorkingDaysByWeekday().reduce(
                                                                        (
                                                                              sum,
                                                                              val
                                                                        ) =>
                                                                              sum +
                                                                              val,
                                                                        0
                                                                  )}
                                                            </strong>
                                                      </td>
                                                      <td></td>
                                                </tr>
                                                <tr>
                                                      <td
                                                            colSpan={
                                                                  weekdays.length +
                                                                  4
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
                                                                                    holidays
                                                                                    or
                                                                                    events
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
                                                                                    highlighted
                                                                                    in
                                                                                    blue
                                                                              </li>
                                                                              <li>
                                                                                    <strong>
                                                                                          {
                                                                                                examStartDate
                                                                                          }
                                                                                    </strong>{" "}
                                                                                    Onwards
                                                                                    –
                                                                                    Semester
                                                                                    End
                                                                                    Examination
                                                                                    (Tentative)
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
                                                                                          color: "#2980b9",
                                                                                    }}
                                                                              >
                                                                                    ■
                                                                                    Event
                                                                              </span>
                                                                        </div>
                                                                  </div>
                                                            </div>
                                                      </td>
                                                </tr>
                                                <tr>
                                                      <td
                                                            colSpan={
                                                                  weekdays.length +
                                                                  4
                                                            }
                                                            style={{
                                                                  textAlign:
                                                                        "left",
                                                                  padding: "10px",
                                                            }}
                                                      >
                                                            <div
                                                                  style={{
                                                                        marginTop:
                                                                              "40px",
                                                                        display: "flex",
                                                                        justifyContent:
                                                                              "space-between",
                                                                        padding: "0 50px",
                                                                  }}
                                                            >
                                                                  <div
                                                                        style={{
                                                                              textAlign:
                                                                                    "center",
                                                                        }}
                                                                  >
                                                                        <p>
                                                                              __________________________
                                                                        </p>
                                                                        <p>
                                                                              <strong>
                                                                                    Dean
                                                                                    Academics
                                                                                    /
                                                                                    COE
                                                                              </strong>
                                                                        </p>
                                                                  </div>
                                                                  <div
                                                                        style={{
                                                                              textAlign:
                                                                                    "center",
                                                                        }}
                                                                  >
                                                                        <p>
                                                                              __________________________
                                                                        </p>
                                                                        <p>
                                                                              <strong>
                                                                                    Principal
                                                                              </strong>
                                                                        </p>
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
