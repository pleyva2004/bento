import { calendar_v3 } from 'googleapis';

// ==========================================
// Chat API Types
// ==========================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message?: string; // Legacy single message support
  messages?: ChatMessage[]; // New conversation history support
}

export interface ChatResponse {
  message: string;
}

export interface ChatErrorResponse {
  error: string;
}

// ==========================================
// OpenAI API Types
// ==========================================

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  temperature: number;
}

export interface OpenAIChoice {
  message: {
    content: string;
    role: string;
  };
  finish_reason: string;
  index: number;
}

export interface OpenAIResponse {
  choices: OpenAIChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
}

// ==========================================
// Schedule Meeting API Types
// ==========================================

export interface ScheduleMeetingRequest {
  selectedDate: string;
  selectedTime: string;
  timezone: string;
  name: string;
  email: string;
  companyName: string;
  companyNiche: string;
}

export interface ScheduleMeetingResponse {
  message: string;
  meetingId: string;
}

export interface ScheduleMeetingErrorResponse {
  message: string;
}

// ==========================================
// Availability Check Types
// ==========================================

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

// ==========================================
// Google Calendar Types
// ==========================================

export type CalendarEvent = calendar_v3.Schema$Event;
export type CalendarEventInsertParams = calendar_v3.Params$Resource$Events$Insert;

export interface CalendarEventData {
  summary: string;
  description: string;
  organizer: {
    email: string;
    displayName: string;
  };
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{ email: string }>;
  reminders: {
    useDefault: boolean;
    overrides: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

// ==========================================
// Email Helper Types
// ==========================================

export interface EmailParams {
  to: string;
  name: string;
  companyName: string;
  meetingDate: Date;
  meetingTime: string;
}

export interface NotificationParams {
  name: string;
  email: string;
  companyName: string;
  companyNiche: string;
  meetingDate: Date;
  meetingTime: string;
}

// ==========================================
// Type Guards
// ==========================================

export function isChatRequest(body: any): body is ChatRequest {
  return body && (typeof body.message === 'string' || Array.isArray(body.messages));
}

export function isScheduleMeetingRequest(body: any): body is ScheduleMeetingRequest {
  return (
    body &&
    typeof body.selectedDate === 'string' &&
    typeof body.selectedTime === 'string' &&
    typeof body.timezone === 'string' &&
    typeof body.name === 'string' &&
    typeof body.email === 'string' &&
    typeof body.companyName === 'string' &&
    typeof body.companyNiche === 'string'
  );
}

