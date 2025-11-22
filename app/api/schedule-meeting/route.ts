import { NextRequest, NextResponse } from 'next/server';
import { createCalBooking } from '@/lib/cal-api';
import { isScheduleMeetingRequest } from '@/lib/types';
import type { ScheduleMeetingResponse, ScheduleMeetingErrorResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with type guard
    if (!isScheduleMeetingRequest(body)) {
      const errorResponse: ScheduleMeetingErrorResponse = {
        message: 'Missing required fields'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Create calendar event via Cal.com
    const meetingId = await createCalBooking(body);

    const response: ScheduleMeetingResponse = {
      message: 'Meeting scheduled successfully',
      meetingId,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to schedule meeting';
    const errorResponse: ScheduleMeetingErrorResponse = { message: errorMessage };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

