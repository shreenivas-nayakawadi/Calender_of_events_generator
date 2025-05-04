// Safely parse ISO date string (YYYY-MM-DD)
export const parseISO = (dateString) => {
    if (!dateString || typeof dateString !== 'string') {
      throw new Error('Invalid date string');
    }
    
    const parts = dateString.split('-');
    if (parts.length !== 3) {
      throw new Error('Date string must be in YYYY-MM-DD format');
    }
  
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // months are 0-indexed
    const day = parseInt(parts[2], 10);
    
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error('Date contains invalid numbers');
    }
  
    const date = new Date(year, month, day);
    
    // Validate the date was created correctly
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      throw new Error('Invalid date values');
    }
  
    return date;
  };
  
  // Format date with basic patterns
  export const format = (date, formatStr) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }
  
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    switch (formatStr) {
      case 'do': // Day with ordinal (1st, 2nd, etc.)
        return `${day}${getOrdinalSuffix(day)}`;
      case 'MMM': // Short month name (JAN, FEB)
        return ['JAN','FEB','MAR','APR','MAY','JUN',
                'JUL','AUG','SEP','OCT','NOV','DEC'][date.getMonth()];
      case 'd':   // Day number
        return day.toString();
      default:
        throw new Error(`Unsupported format: ${formatStr}`);
    }
  };
  
  const getOrdinalSuffix = (num) => {
    const j = num % 10, k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };
  
  // Day of week checks
  export const isSunday = (date) => {
    validateDate(date);
    return date.getDay() === 0;
  };
  
  export const isSaturday = (date) => {
    validateDate(date);
    return date.getDay() === 6;
  };
  
  export const getDay = (date) => {
    validateDate(date);
    return date.getDay();
  };
  
  const validateDate = (date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('Invalid Date object');
    }
    return true;
  };