/**
 * Cal.com API Integration
 *
 * This module handles scheduling meetings through Cal.com API v2.
 * It provides a simpler alternative to Google Calendar with built-in
 * email notifications, meeting links, and availability management.
 */

import type { ScheduleMeetingRequest } from './types';

// Cal.com API configuration
const CAL_API_BASE = 'https://api.cal.com/v2';
const CAL_API_VERSION = process.env.CAL_API_VERSION || '2024-08-13';

/**
 * Cal.com API Response Types
 */
export interface CalBookingResponse {
  status: string;
  data: {
    id: number;
    uid: string;
    title: string;
    status: 'accepted' | 'pending' | 'rejected' | 'cancelled';
    start: string;
    end: string;
    duration: number;
    attendees: Array<{
      name: string;
      email: string;
      timeZone: string;
    }>;
    location?: string;
    metadata?: Record<string, any>;
  };
}

export interface CalErrorResponse {
  status: string;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Creates a booking through Cal.com API
 *
 * @param eventData - Meeting details from the scheduling form
 * @returns Booking UID from Cal.com
 * @throws Error if API call fails or credentials are missing
 */
export async function createCalBooking(
  eventData: ScheduleMeetingRequest
): Promise<string> {
  // Validate environment variables
  const apiKey = process.env.CAL_API_KEY;
  const eventTypeId = process.env.CAL_EVENT_TYPE_ID;

  if (!apiKey) {
    throw new Error('CAL_API_KEY environment variable is not set');
  }

  if (!eventTypeId) {
    throw new Error('CAL_EVENT_TYPE_ID environment variable is not set');
  }

  const { selectedDate, selectedTime, timezone, name, email, companyName, companyNiche } = eventData;

  try {
    // Parse the selected date and time in LOCAL timezone
    // Avoid UTC midnight bug by parsing components separately
    const [year, month, day] = selectedDate.split('-').map(Number);
    const meetingDate = new Date(year, month - 1, day); // month is 0-indexed
    const [hours, minutes] = selectedTime.split(':');
    meetingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // Convert to UTC for Cal.com API (CRITICAL!)
    // Cal.com requires the start time in UTC format
    const startTimeUTC = meetingDate.toISOString();

    console.log('[Cal.com API] Creating booking:', {
      date: selectedDate,
      time: selectedTime,
      timezone: timezone,
      localDateTime: meetingDate.toLocaleString(),
      utcDateTime: startTimeUTC,
      attendee: { name, email },
      company: { name: companyName, niche: companyNiche },
    });

    // Prepare request body for Cal.com API
    const requestBody = {
      start: startTimeUTC,
      eventTypeId: parseInt(eventTypeId, 10),
      attendee: {
        name: name,
        email: email,
        timeZone: timezone,
        language: 'en',
      },
      metadata: {
        companyName: companyName,
        companyNiche: companyNiche,
        source: 'bento-landing-page',
      },
    };

    console.log('[Cal.com API] Request body:', JSON.stringify(requestBody, null, 2));

    // Make API request to Cal.com
    const response = await fetch(`${CAL_API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'cal-api-version': CAL_API_VERSION,
      },
      body: JSON.stringify(requestBody),
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json() as CalErrorResponse;
      console.error('[Cal.com API] Error response:', errorData);

      throw new Error(
        `Cal.com API error (${response.status}): ${
          errorData.error?.message || 'Unknown error'
        }`
      );
    }

    // Parse successful response
    const result = await response.json() as CalBookingResponse;

    console.log('[Cal.com API] Booking created successfully:', {
      uid: result.data.uid,
      id: result.data.id,
      status: result.data.status,
      start: result.data.start,
      end: result.data.end,
    });

    // Return the booking UID
    return result.data.uid;

  } catch (error) {
    console.error('[Cal.com API] Failed to create booking:', error);

    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Failed to create Cal.com booking: ${error.message}`);
    }

    throw new Error('Failed to create Cal.com booking: Unknown error');
  }
}

/**
 * Retrieves event types from Cal.com (useful for setup/debugging)
 *
 * @returns List of available event types
 */
export async function getEventTypes(): Promise<any> {
  const apiKey = process.env.CAL_API_KEY;

  if (!apiKey) {
    throw new Error('CAL_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`${CAL_API_BASE}/event-types`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'cal-api-version': CAL_API_VERSION,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event types: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('[Cal.com API] Failed to fetch event types:', error);
    throw error;
  }
}

/**
 * Cancels a booking in Cal.com
 *
 * @param bookingUid - The booking UID to cancel
 * @param reason - Cancellation reason (optional)
 */
export async function cancelCalBooking(
  bookingUid: string,
  reason?: string
): Promise<void> {
  const apiKey = process.env.CAL_API_KEY;

  if (!apiKey) {
    throw new Error('CAL_API_KEY environment variable is not set');
  }

  try {
    const response = await fetch(`${CAL_API_BASE}/bookings/${bookingUid}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'cal-api-version': CAL_API_VERSION,
      },
      body: JSON.stringify({
        reason: reason || 'Cancelled by user',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel booking: ${response.status}`);
    }

    console.log('[Cal.com API] Booking cancelled:', bookingUid);

  } catch (error) {
    console.error('[Cal.com API] Failed to cancel booking:', error);
    throw error;
  }
}
