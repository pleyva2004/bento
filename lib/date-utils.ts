/**
 * Timezone-Safe Date Utilities
 *
 * Provides consistent timezone handling across all environments (local dev & Vercel).
 * Uses date-fns-tz to ensure dates are created and converted correctly regardless
 * of the server's local timezone.
 */

import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';

/**
 * Business timezone - all availability is defined in this timezone
 */
export const BUSINESS_TIMEZONE = 'America/New_York';

/**
 * Business hours in the business timezone
 */
export const BUSINESS_HOURS = {
  start: 11, // 11 AM
  end: 19,   // 7 PM (19:00)
};

/**
 * Creates a UTC Date from a time specified in the business timezone (EST/EDT).
 *
 * This is critical for server-side code that needs to create dates representing
 * specific times in EST/EDT, regardless of what timezone the server is running in.
 *
 * @param year - Full year (e.g., 2025)
 * @param month - Month (1-12, NOT 0-indexed like JS Date)
 * @param day - Day of month (1-31)
 * @param hour - Hour in 24-hour format (0-23)
 * @param minute - Minute (0-59)
 * @returns Date object representing the correct UTC instant
 *
 * @example
 * // Create a Date representing 11 AM EST on Dec 22, 2025
 * const date = businessTimeToUTC(2025, 12, 22, 11, 0);
 * // Returns Date with correct UTC time (16:00 UTC during EST, 15:00 UTC during EDT)
 */
export function businessTimeToUTC(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0
): Date {
  // Create a date object representing the time in the business timezone
  // Note: We use month-1 because JS Date uses 0-indexed months
  const localDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  // fromZonedTime (formerly zonedTimeToUtc) converts a date that represents
  // a time in a specific timezone to the equivalent UTC time
  return fromZonedTime(localDate, BUSINESS_TIMEZONE);
}

/**
 * Converts a UTC Date to a Date representing that instant in the user's timezone.
 *
 * @param utcDate - A Date object (representing a UTC instant)
 * @param userTimezone - IANA timezone identifier (e.g., 'America/Los_Angeles')
 * @returns Date object adjusted to represent the time in the user's timezone
 */
export function utcToUserTime(utcDate: Date, userTimezone: string): Date {
  return toZonedTime(utcDate, userTimezone);
}

/**
 * Formats a Date for display in a specific timezone.
 *
 * @param date - Date object to format
 * @param userTimezone - IANA timezone identifier
 * @param formatStr - date-fns format string (default: 'h:mm a zzz')
 * @returns Formatted date string
 *
 * @example
 * formatInUserTimezone(new Date(), 'America/New_York', 'h:mm a zzz')
 * // Returns something like "11:30 AM EST"
 */
export function formatInUserTimezone(
  date: Date,
  userTimezone: string,
  formatStr: string = 'h:mm a zzz'
): string {
  const zonedDate = toZonedTime(date, userTimezone);
  return format(zonedDate, formatStr, { timeZone: userTimezone });
}

/**
 * Parses a date string (YYYY-MM-DD) and returns the components.
 *
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Object with year, month (1-12), and day
 */
export function parseDateString(dateString: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

/**
 * Creates start and end Date objects for querying availability on a specific date.
 * The times are based on BUSINESS_HOURS in BUSINESS_TIMEZONE.
 *
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Object with startDate and endDate as UTC Date objects
 */
export function getBusinessHoursUTC(dateString: string): {
  startDate: Date;
  endDate: Date;
} {
  const { year, month, day } = parseDateString(dateString);

  const startDate = businessTimeToUTC(year, month, day, BUSINESS_HOURS.start, 0);
  const endDate = businessTimeToUTC(year, month, day, BUSINESS_HOURS.end, 0);

  return { startDate, endDate };
}

/**
 * Formats a time string (HH:MM) with timezone for display.
 *
 * @param time - Time in HH:MM format (24-hour)
 * @param timezone - IANA timezone identifier
 * @returns Formatted time with timezone abbreviation (e.g., "11:00 AM EST")
 */
export function formatTimeDisplay(time: string, timezone: string): string {
  const [hours, minutes] = time.split(':').map(Number);

  // Create a reference date to format
  const now = new Date();
  const refDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );

  // Format with timezone
  return format(toZonedTime(refDate, timezone), 'h:mm a', { timeZone: timezone });
}
