/**
 * Timezone Utilities
 *
 * Handles timezone detection, conversion, and display for the scheduling system.
 * Base availability: 11 AM - 7 PM EST (Eastern Standard Time)
 */

export interface TimezoneOption {
  value: string; // IANA timezone identifier
  label: string; // Display name
  abbreviation: string; // Short form (EST, PST, etc.)
  offset: number; // UTC offset in hours
}

/**
 * Common US timezones for the dropdown selector
 */
export const US_TIMEZONES: TimezoneOption[] = [
  { value: 'America/New_York', label: 'Eastern Time', abbreviation: 'EST', offset: -5 },
  { value: 'America/Chicago', label: 'Central Time', abbreviation: 'CST', offset: -6 },
  { value: 'America/Denver', label: 'Mountain Time', abbreviation: 'MST', offset: -7 },
  { value: 'America/Phoenix', label: 'Arizona Time', abbreviation: 'MST', offset: -7 },
  { value: 'America/Los_Angeles', label: 'Pacific Time', abbreviation: 'PST', offset: -8 },
  { value: 'America/Anchorage', label: 'Alaska Time', abbreviation: 'AKST', offset: -9 },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time', abbreviation: 'HST', offset: -10 },
  { value: 'America/Puerto_Rico', label: 'Atlantic Time', abbreviation: 'AST', offset: -4 },
  { value: 'Pacific/Guam', label: 'Guam Time', abbreviation: 'ChST', offset: 10 },
];

/**
 * Base availability in EST (your business hours)
 */
export const BASE_AVAILABILITY_EST = {
  startHour: 11, // 11 AM EST
  endHour: 19,   // 7 PM EST
  timezone: 'America/New_York',
};

/**
 * Auto-detect the user's timezone from browser
 */
export function detectUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.error('Failed to detect timezone:', error);
    return 'America/New_York'; // Default to EST
  }
}

/**
 * Get timezone info by IANA identifier
 */
export function getTimezoneInfo(timezoneValue: string): TimezoneOption | undefined {
  return US_TIMEZONES.find(tz => tz.value === timezoneValue);
}

/**
 * Get timezone abbreviation for display
 */
export function getTimezoneAbbreviation(timezoneValue: string): string {
  const info = getTimezoneInfo(timezoneValue);
  return info?.abbreviation || 'EST';
}

/**
 * Generate time slots based on user's selected timezone
 * Converts base EST hours (11 AM - 7 PM) to the user's timezone
 *
 * @param userTimezone - User's selected timezone (IANA identifier)
 * @returns Array of time slot objects with value and display
 */
export function generateTimeSlotsForTimezone(userTimezone: string): Array<{ value: string; display: string }> {
  const slots: Array<{ value: string; display: string }> = [];
  const abbreviation = getTimezoneAbbreviation(userTimezone);

  // Create a reference date (using today's date)
  const referenceDate = new Date();
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const day = referenceDate.getDate();

  // Start at 11 AM EST, end at 7 PM EST
  for (let hour = BASE_AVAILABILITY_EST.startHour; hour < BASE_AVAILABILITY_EST.endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Create a date in EST
      const estDate = new Date(year, month, day, hour, minute, 0);

      // Convert to user's timezone using toLocaleString
      const userTimeString = estDate.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: userTimezone,
      });

      // Get 24-hour format for the value (in user's local time)
      const userHour24 = parseInt(estDate.toLocaleString('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: userTimezone,
      }));

      const userMinute = parseInt(estDate.toLocaleString('en-US', {
        minute: '2-digit',
        timeZone: userTimezone,
      }));

      // Format value as HH:MM (24-hour format)
      const value = `${userHour24.toString().padStart(2, '0')}:${userMinute.toString().padStart(2, '0')}`;

      // Display with timezone abbreviation
      const display = `${userTimeString} ${abbreviation}`;

      slots.push({ value, display });
    }
  }

  return slots;
}

/**
 * Format time string with timezone
 *
 * @param time - Time in HH:MM format (24-hour)
 * @param timezoneValue - IANA timezone identifier
 * @returns Formatted time string with timezone abbreviation
 */
export function formatTimeWithTimezone(time: string, timezoneValue: string): string {
  const abbreviation = getTimezoneAbbreviation(timezoneValue);
  const [hours, minutes] = time.split(':').map(Number);

  // Convert 24-hour to 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period} ${abbreviation}`;
}

/**
 * Get current time in a specific timezone
 * Useful for displaying "Current time in selected timezone: X"
 */
export function getCurrentTimeInTimezone(timezoneValue: string): string {
  const now = new Date();
  const timeString = now.toLocaleString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezoneValue,
  });

  const abbreviation = getTimezoneAbbreviation(timezoneValue);
  return `${timeString} ${abbreviation}`;
}

/**
 * Convert a time from one timezone to another
 * Used when sending data to the backend
 *
 * @param date - Date string (YYYY-MM-DD)
 * @param time - Time string (HH:MM in 24-hour format)
 * @param fromTimezone - Source timezone
 * @param toTimezone - Target timezone
 * @returns Object with converted date and time
 */
export function convertTimeBetweenTimezones(
  date: string,
  time: string,
  _fromTimezone: string,
  toTimezone: string
): { date: string; time: string } {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  // Create date in source timezone
  const sourceDate = new Date(year, month - 1, day, hours, minutes, 0);

  // Convert to target timezone
  const targetDateString = sourceDate.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: toTimezone,
  });

  // Parse the result
  const [datePart, timePart] = targetDateString.split(', ');
  const [monthTarget, dayTarget, yearTarget] = datePart.split('/');
  const [hoursTarget, minutesTarget] = timePart.split(':');

  return {
    date: `${yearTarget}-${monthTarget.padStart(2, '0')}-${dayTarget.padStart(2, '0')}`,
    time: `${hoursTarget}:${minutesTarget}`,
  };
}

/**
 * Validate if a timezone is in our supported list
 */
export function isValidTimezone(timezoneValue: string): boolean {
  return US_TIMEZONES.some(tz => tz.value === timezoneValue);
}

/**
 * Get the best matching timezone from our list
 * Used when auto-detected timezone isn't in our predefined list
 */
export function getBestMatchingTimezone(detectedTimezone: string): string {
  // If detected timezone is in our list, use it
  if (isValidTimezone(detectedTimezone)) {
    return detectedTimezone;
  }

  // Try to find a close match based on common aliases
  const timezoneMap: { [key: string]: string } = {
    'US/Eastern': 'America/New_York',
    'US/Central': 'America/Chicago',
    'US/Mountain': 'America/Denver',
    'US/Pacific': 'America/Los_Angeles',
    'US/Alaska': 'America/Anchorage',
    'US/Hawaii': 'Pacific/Honolulu',
  };

  if (timezoneMap[detectedTimezone]) {
    return timezoneMap[detectedTimezone];
  }

  // Default to Eastern if no match found
  return 'America/New_York';
}
