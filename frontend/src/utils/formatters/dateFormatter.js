import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return 'N/A';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return format(parsed, formatString);
  } catch {
    return 'Invalid Date';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return 'Invalid Date';
  }
};

export const formatTimeAgo = (date) => {
  return formatRelativeTime(date);
};

export const isToday = (date) => {
  if (!date) return false;
  const today = new Date();
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return (
    parsed.getDate() === today.getDate() &&
    parsed.getMonth() === today.getMonth() &&
    parsed.getFullYear() === today.getFullYear()
  );
};

export const isExpired = (date) => {
  if (!date) return false;
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return parsed < new Date();
};


