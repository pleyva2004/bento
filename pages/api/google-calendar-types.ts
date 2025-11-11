import { calendar_v3 } from 'googleapis';

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

