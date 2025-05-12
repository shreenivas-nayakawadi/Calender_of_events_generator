import React, { useState } from "react";
import "./SetupModal.css";

const SetupModal = ({
    isOpen,
    onClose,
    setEndDate,
    setStartDate,
    setSem,
    setDept,
    setStartYear,
    setEndYear,
}) => {
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

        setEndYear(endYear);
        setStartYear(startYear == endYear ? startYear - 1 : startYear);
        setStartDate(startDate);
        setEndDate(endDate);
        setDept(dept);
        setSem(sem);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>Calendar of events Setup</h2>
                <form onSubmit={handleSubmit}>
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
                    <label htmlFor="dept">
                        Department:
                        <select
                            name="dept"
                            value={formData.dept || ""}
                            onChange={handleChange}
                            className="dept-select"
                            required
                        >
                            <option value="">Select department</option>
                            <option value="Information Science and Engineering">ISE</option>
                            <option value="Computer Science and Engineering">CSE</option>
                        </select>
                    </label>

                    <button type="submit" className="submit-button">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetupModal;

// import React, { useState } from "react";
// import "./SetupModal.css";

// const SetupModal = ({
//       isOpen,
//       onClose,
//       setEndDate,
//       setStartDate,
//       setSem,
//       setDept,
//       setStartYear,
//       setEndYear,
// }) => {
//       const [formData, setFormData] = useState({
//             startDate: "",
//             endDate: "",
//             weeks: 14,
//             sem: 1,
//       });

//       const handleChange = (e) => {
//             const { name, value } = e.target;
//             setFormData((prev) => ({ ...prev, [name]: value }));
//       };

//       const handleSubmit = (e) => {
//             e.preventDefault();
//             const { startDate, endDate, weeks, sem, dept } = formData;

//             // Validate start and end dates exist
//             if (!startDate || !endDate) {
//                   alert("Please select both start and end dates");
//                   return;
//             }

//             // Convert strings to Date objects
//             const start = new Date(startDate);
//             const end = new Date(endDate);

//             // Validate start is before end
//             if (start >= end) {
//                   alert("Start date must be before end date");
//                   return;
//             }

//             // Calculate the actual number of weeks between dates
//             const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
//             const calculatedWeeks = Math.ceil(
//                   (end - start) / millisecondsPerWeek
//             );

//             // Validate week count matches the calculated duration
//             if (calculatedWeeks < 14 || calculatedWeeks > 16) {
//                   alert(
//                         `The selected dates span ${calculatedWeeks} weeks. Dates must be between 14-16 weeks.`
//                   );
//                   return;
//             }

//             // Validate the input week count matches the actual duration
//             if (calculatedWeeks !== Number(weeks)) {
//                   console.log(calculatedWeeks, weeks);
//                   alert(
//                         `The selected dates span ${calculatedWeeks} weeks, which doesn't match your input of ${weeks} weeks.`
//                   );
//                   return;
//             }

//             const startYear = start.getFullYear();
//             const endYear = end.getFullYear();

//             setEndYear(endYear);
//             setStartYear(startYear == endYear ? startYear - 1 : startYear);

//             // If all validations pass
//             setStartDate(startDate);
//             setEndDate(endDate);
//             console.log("dept", dept);
//             setDept(dept);
//             setSem(sem);
//             onClose();
//       };

//       if (!isOpen) return null;

//       return (
//             <div className="modal-overlay">
//                   <div className="modal">
//                         <button className="close-button" onClick={onClose}>
//                               ×
//                         </button>
//                         <h2>Calendar of events Setup</h2>
//                         <form onSubmit={handleSubmit}>
//                               <label>
//                                     Start Date:
//                                     <input
//                                           type="date"
//                                           name="startDate"
//                                           value={formData.startDate}
//                                           onChange={handleChange}
//                                           required
//                                     />
//                               </label>
//                               <label>
//                                     End Date:
//                                     <input
//                                           type="date"
//                                           name="endDate"
//                                           value={formData.endDate}
//                                           onChange={handleChange}
//                                           required
//                                     />
//                               </label>
//                               <label>
//                                     Number of Weeks (14–16):
//                                     <input
//                                           type="number"
//                                           name="weeks"
//                                           min="14"
//                                           max="16"
//                                           value={formData.weeks}
//                                           onChange={handleChange}
//                                           required
//                                     />
//                               </label>
//                               <label>
//                                     Semester (1 - 8):
//                                     <input
//                                           type="number"
//                                           name="sem"
//                                           min="1"
//                                           max="18"
//                                           value={formData.sem}
//                                           onChange={handleChange}
//                                           required
//                                     />
//                               </label>
//                               <label htmlFor="dept">
//                                     <select
//                                           name="dept"
//                                           value={formData.dept || ""}
//                                           onChange={handleChange}
//                                           className="dept-select"
//                                           required
//                                     >
//                                           <option value="">
//                                                 Select option
//                                           </option>
//                                           <option value="Information Science and Engineering">
//                                                 ISE
//                                           </option>
//                                           <option value="Computer Science and Engineering">
//                                                 CSE
//                                           </option>
//                                     </select>
//                               </label>

//                               <button type="submit" className="submit-button">
//                                     Submit
//                               </button>
//                         </form>
//                   </div>
//             </div>
//       );
// };

// export default SetupModal;
