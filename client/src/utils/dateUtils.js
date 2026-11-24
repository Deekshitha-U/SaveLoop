import { format, formatDistanceToNow, isValid } from 'date-fns';
export const prettyDate = (value) => value && isValid(new Date(value)) ? format(new Date(value), 'MMM d, yyyy') : '—';
export const prettyDateTime = (value) => value && isValid(new Date(value)) ? format(new Date(value), 'MMM d, yyyy · h:mm a') : '—';
export const relativeDate = (value) => value && isValid(new Date(value)) ? formatDistanceToNow(new Date(value), { addSuffix: true }) : '—';
export const toDateTimeLocal = (value) => {
  const date = value ? new Date(value) : new Date(Date.now() + 86400000);
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 16);
};
