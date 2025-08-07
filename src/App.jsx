import React, { useRef, useState } from 'react';
import useCalendar from './hooks/useCalendar';
import CalendarHeader from './components/CalendarHeader/CalendarHeader';
import CalendarControls from './components/CalendarControls/CalendarControls';
import CalendarTable from './components/CalendarTable/CalendarTable';
import CalendarFooter from './components/CalendarFooter/CalendarFooter';
import NoData from './components/NoData/NoData';
import RemarkModal from './components/RemarkModal';
import SetupModal from './components/SetupModal';
import { handleExport } from './utils/domHelpers';
import './App.css';

const App = () => {
    const calendarRef = useRef();
    const [showRemarkModal, setShowRemarkModal] = useState(false);
    // Start with the setup modal open
    const [showSetupModal, setShowSetupModal] = useState(true);

    const {
        calendarData,
        addRemark,
        undoRemark,
        clearData,
        setupCalendar,
    } = useCalendar();

    const {
        startDate,
        endDate,
        sem,
        dept,
        startYear,
        endYear,
        remarks,
        weeks,
        weekdays,
        examStartDate,
        workingDaysByWeekday,
        totalWorkingDays,
        getWeekMonthDisplay,
        getWeekRemarks,
        isNonWorkingDay,
        shouldHighlight,
        countWorkingDays,
    } = calendarData;

    // This function receives the data from the SetupModal and passes it to the hook
    const handleSetup = (setupData) => {
        setupCalendar(setupData);
        setShowSetupModal(false);
    };

    const handleClear = () => {
        const userInput = prompt('Type "CLEAR" (in uppercase) to confirm clearing all data.');
        if (userInput === "CLEAR") {
            clearData();
            setShowSetupModal(true); // Re-open the setup modal after clearing
            alert("All data has been cleared.");
        } else {
            alert("Clear cancelled. You must type 'CLEAR' exactly.");
        }
    };
    
    // This function receives the new remark from the RemarkModal
    const handleAddRemark = (remark) => {
        addRemark(remark);
        setShowRemarkModal(false); // Close modal on save
    };


    return (
        <>
            <div ref={calendarRef}>
                <div className="calendar-container">
                    <CalendarHeader
                        dept={dept}
                        sem={sem}
                        startYear={startYear}
                        endYear={endYear}
                    />

                    {startDate && endDate ? (
                        <>
                            <CalendarControls
                                onAddRemark={() => setShowRemarkModal(true)}
                                onClear={handleClear}
                                onExport={() => handleExport(calendarRef, sem)}
                                onUndo={undoRemark}
                                remarksLength={remarks.length}
                            />
                            <CalendarTable
                                weeks={weeks}
                                weekdays={weekdays}
                                getWeekMonthDisplay={getWeekMonthDisplay}
                                countWorkingDays={countWorkingDays}
                                getWeekRemarks={getWeekRemarks}
                                isNonWorkingDay={isNonWorkingDay}
                                shouldHighlight={shouldHighlight}
                                workingDaysByWeekday={workingDaysByWeekday}
                                totalWorkingDays={totalWorkingDays}
                                examStartDate={examStartDate}
                            />
                        </>
                    ) : (
                        <NoData onGenerate={() => setShowSetupModal(true)} />
                    )}
                </div>
                {/* The footer should only show when there is a calendar */}
                {startDate && endDate && <CalendarFooter />}
            </div>

            {/* Render modals based on state */}
            {showRemarkModal && (
                <RemarkModal
                    onClose={() => setShowRemarkModal(false)}
                    onSave={handleAddRemark}
                />
            )}

            <SetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                onSetup={handleSetup}
            />
        </>
    );
};

export default App;
