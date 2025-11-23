import { NextRequest, NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/cal-availability';

export interface CheckAvailabilityRequest {
  date: string;      // YYYY-MM-DD format
  timezone: string;  // IANA timezone
}

export interface CheckAvailabilityResponse {
  availableSlots: string[];  // Array of HH:MM times
  date: string;
  timezone: string;
}

export interface CheckAvailabilityError {
  error: string;
  message: string;
}

// Simple in-memory cache with 5-minute TTL
const cache = new Map<string, { slots: string[]; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(date: string, timezone: string): string {
  return `${date}|${timezone}`;
}

function getCachedSlots(date: string, timezone: string): string[] | null {
  const key = getCacheKey(date, timezone);
  const cached = cache.get(key);

  if (!cached) {
    return null;
  }

  const now = Date.now();
  const age = now - cached.timestamp;

  if (age > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  console.log(`[Check Availability] Cache hit for ${date} (age: ${Math.round(age / 1000)}s)`);
  return cached.slots;
}

function setCachedSlots(date: string, timezone: string, slots: string[]): void {
  const key = getCacheKey(date, timezone);
  cache.set(key, {
    slots,
    timestamp: Date.now(),
  });

  // Clean up old cache entries (older than 1 hour)
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  for (const [cacheKey, value] of Array.from(cache.entries())) {
    if (value.timestamp < oneHourAgo) {
      cache.delete(cacheKey);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    if (!body || typeof body.date !== 'string' || typeof body.timezone !== 'string') {
      const errorResponse: CheckAvailabilityError = {
        error: 'INVALID_REQUEST',
        message: 'Missing required fields: date and timezone',
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const { date, timezone } = body as CheckAvailabilityRequest;

    console.log('[Check Availability] Request:', { date, timezone });

    // Check cache first
    const cachedSlots = getCachedSlots(date, timezone);
    if (cachedSlots !== null) {
      const response: CheckAvailabilityResponse = {
        availableSlots: cachedSlots,
        date,
        timezone,
      };
      return NextResponse.json(response, { status: 200 });
    }

    // Fetch available slots from Cal.com
    const availableSlots = await getAvailableSlots(date, timezone);

    console.log('[Check Availability] Found slots:', {
      date,
      timezone,
      count: availableSlots.length,
      slots: availableSlots,
    });

    // Cache the result
    setCachedSlots(date, timezone, availableSlots);

    const response: CheckAvailabilityResponse = {
      availableSlots,
      date,
      timezone,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('[Check Availability] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to check availability';

    const errorResponse: CheckAvailabilityError = {
      error: 'AVAILABILITY_CHECK_FAILED',
      message: errorMessage,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Optional: GET endpoint for simple testing
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const timezone = searchParams.get('timezone') || 'America/New_York';

  if (!date) {
    return NextResponse.json(
      { error: 'Missing date parameter' },
      { status: 400 }
    );
  }

  try {
    const availableSlots = await getAvailableSlots(date, timezone);

    return NextResponse.json({
      availableSlots,
      date,
      timezone,
    });

  } catch (error) {
    console.error('[Check Availability] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}
