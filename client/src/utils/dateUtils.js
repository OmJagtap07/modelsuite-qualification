export const getDueDateStatus = (dueDateString) => {
  if (!dueDateString) return null;

  const parts = dueDateString.split('-');
  if (parts.length !== 3) return null;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const due = new Date(year, month, day);
  if (isNaN(due.getTime())) return null;

  const today = new Date();
  
  // Normalize both dates to midnight local time to avoid timezone/time-of-day edge cases
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays <= 3) {
    return 'Due Soon';
  }

  return null;
};
