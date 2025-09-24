// API endpoint for scheduling meetings with Google Calendar integration
// You'll need to install: npm install googleapis nodemailer

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { selectedDate, selectedTime, name, email, companyName, companyNiche } = req.body;

  // Validate required fields
  if (!selectedDate || !selectedTime || !name || !email || !companyName || !companyNiche) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create the meeting date/time
    const meetingDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    meetingDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    // End time (30 minute later)
    const endDate = new Date(meetingDate);
    endDate.setMinutes(endDate.getMinutes() + 30);

    const { google } = require('googleapis');
    const path = require('path');

    const CREDENTIALS_PATH = path.join(process.cwd(), 'bento-cloud-service-credentials.json');

    const SCOPES = ['https://www.googleapis.com/auth/calendar.events.owned'];

    const auth = new google.auth.GoogleAuth({
      keyFile: CREDENTIALS_PATH,
      scopes: SCOPES,
      // subject: 'pleyva2004@sgmail.com'
    });


    // const meetLink = await getMeetLink();

    // Create calendar event data with integrated Meet link
    const calendarEvent = {
      summary: `AI Consultation - ${companyName}`,
      description: `AI consultation call with ${name} from ${companyName} (${companyNiche} industry).

Meeting Details:
- Client: ${name}
- Email: ${email}
- Company: ${companyName}
- Industry: ${companyNiche}


This is a no-cost AI audit call to discuss how AI can transform their business.`,
     organizer: {
      email: 'pleyva2004@sgmail.com',
      displayName: 'Levrok Labs'
    },
      start: {
        dateTime: meetingDate.toISOString(),
        timeZone: 'America/New_York', // Adjust to your timezone
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/New_York', // Adjust to your timezone
      },
      attendees: [
        // { email: email }, // Add the client as an attendee
      ],      
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'email', minutes: 60 }, // 1 hour before
          { method: 'popup', minutes: 15 }, // 15 minutes before
          { method: 'popup', minutes: 5 }, // 5 minutes before
        ],
      },
    };

    // Get the authenticated client
    const calendar = google.calendar({ version: 'v3', auth: auth });

    const calID = '1591f6c552214b6d67035a03a57caa529a2b87848b98ae6f7dfa771c3a05882b@group.calendar.google.com'
   
    const response = await calendar.events.insert({
      calendarId: calID, // or your specific calendar ID
      resource: calendarEvent,
      conferenceDataVersion: 1, // Required for creating Meet links
      sendUpdates: 'all', // Send invites to all attendees,      
    });

    console.log('Calendar event created:', response);

    // Get the Meet link from the response

    // For demonstration, we'll send a simple email notification
    await sendConfirmationEmail({
      to: email,
      name,
      companyName,
      meetingDate,
      meetingTime: selectedTime,
    });

    // Also notify your team
    await sendInternalNotification({
      name,
      email,
      companyName,
      companyNiche,
      meetingDate,
      meetingTime: selectedTime
    });

    res.status(200).json({ 
      message: 'Meeting scheduled successfully',
      meetingId: `meeting-${Date.now()}` // In real implementation, use the Google Calendar event ID
    });

  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ message: 'Failed to schedule meeting' });
  }
  
}

async function getMeetLink() {
  const {SpacesServiceClient} = require('@google-apps/meet');
  const { google } = require('googleapis');
  const path = require('path');

  const CREDENTIALS_PATH = path.join(process.cwd(), 'bento-cloud-service-credentials.json');

  const SCOPES2 = ['https://www.googleapis.com/auth/meetings.space.created'];

  const auth2 = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: SCOPES2,
  });

  const meetClient = new SpacesServiceClient({
    authClient: auth2,
  });

  const request = {};

  const meetResponse = await meetClient.createSpace(request);

  console.log(`Meet URL Created: ${meetResponse[0].meetingUri}`);

  return meetResponse[0].meetingUri;

}


async function sendConfirmationEmail({ to, name, companyName, meetingDate, meetingTime }) {
  // Email sending logic using nodemailer or your preferred email service
  // This is a simplified example - you'll need to set up your email service
  
  const emailContent = `
Dear ${name},

Thank you for scheduling an AI consultation call with Levrok Labs!

Meeting Details:
📅 Date: ${meetingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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
The Levrok Labs Team
hello@levroklabs.com
  `;

  // Implement actual email sending here
  console.log('Sending confirmation email to:', to);
  console.log('Email content:', emailContent);
  
  // Example with nodemailer (you'll need to configure this):
  /*
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransporter({
    // Your email service configuration
  });
  
  await transporter.sendMail({
    from: 'hello@levroklabs.com',
    to: to,
    subject: 'AI Consultation Scheduled - Levrok Labs',
    text: emailContent,
  });
  */
}


async function sendInternalNotification({ name, email, companyName, companyNiche, meetingDate, meetingTime }) {
  // Send notification to your team about the new meeting
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
  
  // Send to your team's Slack, email, or notification system
}
