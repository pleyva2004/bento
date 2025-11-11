import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import * as path from 'path';
import type {
  ScheduleMeetingResponse,
  ScheduleMeetingErrorResponse,
  EmailParams,
  NotificationParams,
} from './types';
import { isScheduleMeetingRequest } from './types';
import type { CalendarEventData } from './google-calendar-types';

type ScheduleApiResponse = ScheduleMeetingResponse | ScheduleMeetingErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScheduleApiResponse>
): Promise<void> {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Validate request body with type guard
  if (!isScheduleMeetingRequest(req.body)) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const { selectedDate, selectedTime, name, email, companyName, companyNiche } = req.body;

  try {
    // Create the meeting date/time
    const meetingDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    meetingDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    // End time (30 minutes later)
    const endDate = new Date(meetingDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const CREDENTIALS_PATH = path.join(
      process.cwd(),
      process.env.GOOGLE_CREDENTIALS_PATH || 'bento-cloud-service-credentials.json'
    );

    const SCOPES = ['https://www.googleapis.com/auth/calendar.events.owned'];

    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: SCOPES,
    });

    const calendarEvent: CalendarEventData = {
      summary: `AI Consultation - ${companyName}`,
      description: `AI consultation call with ${name} from ${companyName} (${companyNiche} industry).

Meeting Details:
- Client: ${name}
- Email: ${email}
- Company: ${companyName}
- Industry: ${companyNiche}


This is a no-cost AI audit call to discuss how AI can transform their business.`,
      organizer: {
        email: process.env.ORGANIZER_EMAIL || '',
        displayName: process.env.ORGANIZER_NAME || 'Levrok Labs',
      },
      start: {
        dateTime: meetingDate.toISOString(),
        timeZone: process.env.CALENDAR_TIMEZONE || 'America/New_York',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: process.env.CALENDAR_TIMEZONE || 'America/New_York',
      },
      attendees: [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
          { method: 'popup', minutes: 5 },
        ],
      },
    };

    const calendar = google.calendar({ version: 'v3', auth });

    const calID = process.env.GOOGLE_CALENDAR_ID;

    if (!calID) {
      throw new Error('GOOGLE_CALENDAR_ID environment variable is required');
    }

    const response = await calendar.events.insert({
      calendarId: calID,
      requestBody: calendarEvent,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    console.log('Calendar event created:', response.data);

    await sendConfirmationEmail({
      to: email,
      name,
      companyName,
      meetingDate,
      meetingTime: selectedTime,
    });

    await sendInternalNotification({
      name,
      email,
      companyName,
      companyNiche,
      meetingDate,
      meetingTime: selectedTime,
    });

    res.status(200).json({
      message: 'Meeting scheduled successfully',
      meetingId: `meeting-${Date.now()}`,
    });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to schedule meeting';
    res.status(500).json({ message: errorMessage });
  }
}

// Commented out - currently unused but kept for future Meet link integration
// async function getMeetLink(): Promise<string> {
//   const { SpacesServiceClient } = require('@google-apps/meet');
//
//   const CREDENTIALS_PATH = path.join(
//     process.cwd(),
//     process.env.GOOGLE_CREDENTIALS_PATH || 'bento-cloud-service-credentials.json'
//   );
//
//   const SCOPES2 = ['https://www.googleapis.com/auth/meetings.space.created'];
//
//   const auth2 = new google.auth.GoogleAuth({
//     keyFile: CREDENTIALS_PATH,
//     scopes: SCOPES2,
//   });
//
//   const meetClient = new SpacesServiceClient({
//     authClient: auth2,
//   });
//
//   const request = {};
//
//   const meetResponse = await meetClient.createSpace(request);
//
//   console.log(`Meet URL Created: ${meetResponse[0].meetingUri}`);
//
//   return meetResponse[0].meetingUri as string;
// }

async function sendConfirmationEmail(params: EmailParams): Promise<void> {
  const { to, name, companyName, meetingDate, meetingTime } = params;

  const emailContent = `
Dear ${name},

Thank you for scheduling an AI consultation call with Levrok Labs!

Meeting Details:
📅 Date: ${meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
⏰ Time: ${meetingTime}
🏢 Company: ${companyName}

What to Expect:
• A comprehensive review of your current business processes
• Discussion of AI opportunities specific to your industry
• Custom recommendations for AI implementation
• No-obligation consultation - completely free

Looking forward to helping you transform your business with AI!

Best regards,
The ${process.env.ORGANIZER_NAME || 'Levrok Labs'} Team
${process.env.SUPPORT_EMAIL || 'hello@levroklabs.com'}
  `;

  console.log('Sending confirmation email to:', to);
  console.log('Email content:', emailContent);

  // Example with nodemailer (you'll need to configure this):
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransporter({
    // Your email service configuration
  });
  
  await transporter.sendMail({
    from: process.env.SUPPORT_EMAIL || 'hello@levroklabs.com',
    to: to,
    subject: `AI Consultation Scheduled - ${process.env.ORGANIZER_NAME || 'Levrok Labs'}`,
    text: emailContent,
  });
  */
}

async function sendInternalNotification(params: NotificationParams): Promise<void> {
  const { name, email, companyName, companyNiche, meetingDate, meetingTime } = params;

  const internalContent = `
New AI Consultation Scheduled!

Client Details:
Name: ${name}
Email: ${email}
Company: ${companyName}
Industry: ${companyNiche}

Meeting: ${meetingDate.toLocaleDateString()} at ${meetingTime}

Prepare for the call by researching their industry and potential AI use cases.
  `;

  console.log('Internal notification:', internalContent);
}

