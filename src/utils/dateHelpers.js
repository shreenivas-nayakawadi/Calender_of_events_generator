import { parseISO, getDate } from 'date-fns';

/**
 * Safely parses a date string, handling various formats.
 * @param {string | Date} dateString - The date string or Date object to parse.
 * @param {Date} [referenceDate=new Date()] - A reference date for parsing relative formats.
 * @returns {Date} The parsed date.
 */
export const safeParseISO = (dateString, referenceDate = new Date()) => {
    try {
        if (dateString instanceof Date) return dateString;
        if (typeof dateString !== 'string') return referenceDate;

        // Handle formats like "1st", "2nd", "3rd"
        if (/^\d+(st|nd|rd|th)$/.test(dateString)) {
            const day = parseInt(dateString, 10);
            return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day);
        }

        // Handle range formats like "1st to 3rd"
        if (dateString.includes(' to ')) {
            const firstPart = dateString.split(' to ')[0];
            const day = parseInt(firstPart, 10);
            return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), day);
        }

        return parseISO(dateString);
    } catch (e) {
        console.error("Failed to parse date:", dateString, e);
        return referenceDate;
    }
};

/**
 * Calculates the week number of a date within its month.
 * @param {Date} date - The date to check.
 * @returns {number} The week number (1-5).
 */
export const getWeekOfMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const dayOfMonth = getDate(date);
    // Adjust for Sunday start of week if needed by your logic
    return Math.ceil((dayOfMonth + dayOfWeek) / 7);
};
