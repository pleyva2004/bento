/**
 * Cal.com Availability API
 *
 * Fetches available time slots from Cal.com to show only truly available
 * booking times (excluding times with existing calendar events)
 */

export interface AvailableSlot {
  time: string; // ISO 8601 format
}

export interface CalSlotResponse {
  slots: {
    time: string;
  }[];
}

/**
 * Fetches available time slots from Cal.com API for a specific date
 *
 * @param date - Date string in YYYY-MM-DD format
 * @param timezone - IANA timezone (e.g., "America/New_York")
 * @returns Array of available time slots in HH:MM format
 */
export async function getAvailableSlots(
  date: string,
  timezone: string
): Promise<string[]> {
  const apiKey = process.env.CAL_API_KEY;
  const eventTypeId = process.env.CAL_EVENT_TYPE_ID;
  const apiVersion = process.env.CAL_API_VERSION || '2024-08-13';

  if (!apiKey || !eventTypeId) {
    console.error('[Cal Availability] Missing API credentials');
    throw new Error('Cal.com API credentials not configured');
  }

  try {
    // Parse the date
    const [year, month, day] = date.split('-').map(Number);

    // Create start of day (11 AM EST = your business hours start)
    const startDate = new Date(year, month - 1, day, 11, 0, 0);
    // Create end of day (7 PM EST = your business hours end)
    const endDate = new Date(year, month - 1, day, 19, 0, 0);

    // Convert to UTC for API call
    const startTimeUTC = startDate.toISOString();
    const endTimeUTC = endDate.toISOString();

    console.log('[Cal Availability] Fetching slots:', {
      date,
      timezone,
      startTimeUTC,
      endTimeUTC,
      eventTypeId,
    });

    // Build query parameters
    const params = new URLSearchParams({
      startTime: startTimeUTC,
      endTime: endTimeUTC,
      eventTypeId: eventTypeId,
      // Note: Cal.com API v2 may use different parameter names
      // Adjust based on actual API response
    });

    const url = `https://api.cal.com/v2/slots/available?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'cal-api-version': apiVersion,
        'Content-Type': 'application/json',
      },
    });

    console.log('[Cal Availability] API response:', response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Cal Availability] API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      // Return empty array on error (will show no slots available)
      return [];
    }

    const data = await response.json();

    console.log('[Cal Availability] Raw API response:', data);

    // Parse the response to extract available time slots
    // Cal.com API returns slots in ISO format, we need to convert to HH:MM
    const availableSlots = parseCalSlots(data, date, timezone);

    console.log('[Cal Availability] Parsed available slots:', availableSlots);

    return availableSlots;

  } catch (error) {
    console.error('[Cal Availability] Failed to fetch available slots:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Parses Cal.com API response and converts to HH:MM format in specified timezone
 *
 * @param data - Raw API response from Cal.com
 * @param date - Date string in YYYY-MM-DD format to extract slots for
 * @param timezone - Target timezone for conversion
 * @returns Array of time strings in HH:MM format
 */
function parseCalSlots(data: any, date: string, timezone: string): string[] {
  try {
    // Cal.com API response structure may vary
    // Try different possible response formats

    let slots: any[] = [];

    // Format 1: { data: { slots: { '2025-11-26': [...] } } }
    // Cal.com v2 API returns slots as an object keyed by date
    if (data.data && data.data.slots && typeof data.data.slots === 'object' && !Array.isArray(data.data.slots)) {
      // Extract slots for the requested date
      slots = data.data.slots[date] || [];
      // If no slots for specific date, try to get all slots from all dates
      if (slots.length === 0) {
        slots = Object.values(data.data.slots).flat() as any[];
      }
    }
    // Format 2: { slots: [{ time: "2025-11-25T15:00:00.000Z" }] }
    else if (data.slots && Array.isArray(data.slots)) {
      slots = data.slots;
    }
    // Format 3: { data: { slots: [...] } } (array format)
    else if (data.data && data.data.slots && Array.isArray(data.data.slots)) {
      slots = data.data.slots;
    }
    // Format 4: Direct array
    else if (Array.isArray(data)) {
      slots = data;
    }

    if (slots.length === 0) {
      console.warn('[Cal Availability] No slots found in response');
      return [];
    }

    // Convert ISO timestamps to HH:MM format in the specified timezone
    const timeStrings = slots.map(slot => {
      const timeValue = slot.time || slot;

      if (typeof timeValue !== 'string') {
        return null;
      }

      try {
        const slotDate = new Date(timeValue);

        // Format as HH:MM in 24-hour format in the specified timezone
        const timeString = slotDate.toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: timezone,
        });

        // Extract just the time part (HH:MM)
        const [hours, minutes] = timeString.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

      } catch (err) {
        console.error('[Cal Availability] Failed to parse slot time:', timeValue, err);
        return null;
      }
    }).filter((time): time is string => time !== null);

    return timeStrings;

  } catch (error) {
    console.error('[Cal Availability] Failed to parse slots:', error);
    return [];
  }
}

/**
 * Test function to verify Cal.com API connection
 * Can be called to debug availability issues
 */
export async function testCalAvailability(): Promise<void> {
  try {
    const testDate = new Date();
    testDate.setDate(testDate.getDate() + 1); // Tomorrow
    const dateString = testDate.toISOString().split('T')[0];

    console.log('[Cal Availability] Testing with date:', dateString);

    const slots = await getAvailableSlots(dateString, 'America/New_York');

    console.log('[Cal Availability] Test result:', {
      date: dateString,
      slotsFound: slots.length,
      slots,
    });

  } catch (error) {
    console.error('[Cal Availability] Test failed:', error);
  }
}
