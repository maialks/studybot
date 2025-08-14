import { startOfDay, format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { DateFormat } from '../types';

export function getStartOfDay(): Date {
  return startOfDay(new Date());
}

type Args = { dateUTC: Date; serverTimezone: string; pattern: DateFormat };
export function formatToTimezone({ dateUTC, serverTimezone, pattern }: Args) {
  const zonedDate = toZonedTime(dateUTC, serverTimezone);
  return format(zonedDate, pattern);
}
