export const getDueDateStatus = (dueDateString) => {
  if (!dueDateString) return null;

  const due = new Date(dueDateString);
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
