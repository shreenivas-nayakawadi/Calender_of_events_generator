import { isSunday } from './dateUtils';

export const eachDayOfInterval = ({ start, end }) => {
  if (!(start instanceof Date) || !(end instanceof Date)) {
    throw new Error('Start and end must be Date objects');
  }
  if (start > end) {
    throw new Error('Start date must be before end date');
  }

  const dates = [];
  const current = new Date(start);
  current.setHours(0, 0, 0, 0); // Normalize time

  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    if (!isSunday(current)) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
};