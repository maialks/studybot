import { startOfDay, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { DateFormat } from '../types';

export function getStartOfDay(date: string | Date): Date {
  return startOfDay(date);
}

export function formatToTimezone(
  dateUTC: Date,
  serverTimezone: string,
  pattern: string
) {
  const zonedDate = toZonedTime(dateUTC, serverTimezone);
  return format(zonedDate, pattern);
}
