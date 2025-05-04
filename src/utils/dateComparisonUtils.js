export const isSameDay = (date1, date2) => {
    if (!date1 || !date2 || !(date1 instanceof Date) || !(date2 instanceof Date)) {
      return false;
    }
    
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  
  export const getWeekOfMonth = (date) => {
    if (!(date instanceof Date)) {
      throw new Error('Invalid Date object');
    }
  
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    const dayOfMonth = date.getDate();
    const adjustedDate = dayOfMonth + firstDayOfWeek - 1;
    
    return Math.ceil(adjustedDate / 7);
  };