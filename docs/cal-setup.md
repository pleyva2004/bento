# Cal.com Setup Guide

This guide walks you through setting up Cal.com integration for the schedule-meeting feature. Cal.com provides a simpler alternative to Google Calendar with built-in notifications, meeting links, and availability management.

## Why Cal.com?

Compared to Google Calendar API:
- **Simpler authentication**: Just an API key (no service accounts or JSON files)
- **Built-in features**: Automatic emails, reminders, and meeting links (Google Meet, Zoom)
- **Easier configuration**: Dashboard-based settings instead of code
- **Less code**: ~60% less code than Google Calendar implementation
- **Better for non-technical users**: Team members can update availability without touching code

## Prerequisites

- Cal.com account (free tier available)
- Email address for notifications

## Step 1: Create Cal.com Account

1. Go to [Cal.com](https://cal.com)
2. Click "Get Started" or "Sign Up"
3. Create account using one of these methods:
   - Google account
   - Email + password
   - SAML SSO (enterprise)
4. Verify your email address
5. Complete onboarding wizard:
   - Set your availability
   - Connect your calendar (Google Calendar, Outlook, etc.)
   - Set your timezone

## Step 2: Connect Your Calendar (Optional but Recommended)

Connect your existing calendar to prevent double-bookings:

1. Go to Settings → Calendar Accounts
2. Click "Connect Calendar"
3. Choose your calendar provider:
   - Google Calendar (recommended)
   - Outlook Calendar
   - Apple Calendar
   - CalDAV
4. Follow OAuth flow to grant permissions
5. Select which calendars to check for conflicts

## Step 3: Create Event Type

Event types define the type of meetings you want to schedule.

1. Go to Event Types in the sidebar
   - Or visit: https://app.cal.com/event-types
2. Click "New Event Type" (top right)
3. Choose event type:
   - **Standard**: Regular one-on-one meetings (recommended for this use case)
   - **Group**: Multiple attendees
   - **Round Robin**: Distributed among team members
   - **Collective**: All team members required
4. Fill in event details:

### Basic Information:
- **Title**: "AI Consultation Call" (or your preferred name)
- **URL slug**: `ai-consultation` (will be: cal.com/your-username/ai-consultation)
- **Duration**: 30 minutes
- **Description**:
  ```
  A complimentary consultation to discuss how AI can transform your business.

  We'll cover:
  • Current challenges and opportunities
  • AI solutions tailored to your industry
  • Implementation roadmap
  • ROI expectations
  ```

### Advanced Settings:

5. Click "Advanced" tab for more options:
   - **Booking window**: Set how far in advance bookings can be made
     - Minimum notice: 24 hours (recommended)
     - Maximum notice: 60 days (recommended)
   - **Buffer time**: Time between meetings
     - Before: 0 minutes
     - After: 15 minutes (recommended)
   - **Limits**:
     - Max bookings per day: 5 (adjust as needed)
   - **Availability**: Use default schedule or create custom

6. Click "Save" at the bottom

## Step 4: Configure Meeting Location

Set up video conferencing for your meetings:

1. In your event type settings, find "Location" section
2. Choose a location type:
   - **Google Meet** (recommended - free, integrated)
   - **Zoom** (requires Zoom account)
   - **Microsoft Teams**
   - **Phone call**
   - **In-person meeting**
   - **Custom link** (your own meeting room)

### For Google Meet (Recommended):
1. Click "Google Meet"
2. Connect your Google account if not already connected
3. Cal.com will automatically create meeting links for each booking

### For Zoom:
1. Click "Zoom"
2. Connect your Zoom account
3. Configure meeting settings (password, waiting room, etc.)

## Step 5: Generate API Key

This is the most important step for integration:

1. Go to Settings → Security
   - Or visit: https://app.cal.com/settings/developer/api-keys
2. Scroll to "API Keys" section
3. Click "+ Add" or "New API Key"
4. Fill in API key details:
   - **Name**: "Bento Production" (or "Bento Development")
   - **Expiry**: Never (or set expiry for security)
   - **Permissions**: Default (full access)
5. Click "Create"
6. **CRITICAL**: Copy the API key immediately
   - It starts with `cal_live_` for production
   - It starts with `cal_` for test mode
   - You won't be able to see it again!
7. Store it securely (password manager, env file)

## Step 6: Get Event Type ID

You need the Event Type ID for API calls. Two methods:

### Method A: From URL (Easiest)
1. Go to Event Types page
2. Click on your "AI Consultation Call" event type
3. Look at the browser URL:
   ```
   https://app.cal.com/event-types/123456
                                   ^^^^^^
                             This is your Event Type ID
   ```
4. Copy the number (e.g., `123456`)

### Method B: Via API (Alternative)
```bash
curl https://api.cal.com/v2/event-types \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "cal-api-version: 2024-08-13"
```

Look for your event type in the response and copy the `id` field.

## Step 7: Configure Environment Variables

1. Open your `.env` file in the project root
2. Add these Cal.com variables:

```bash
# Cal.com Configuration
CAL_API_KEY=cal_live_xxxxxxxxxxxxxxxxxxxxxxxxxx
CAL_EVENT_TYPE_ID=123456
CAL_API_VERSION=2024-08-13

# Meeting Configuration (keep these)
CALENDAR_TIMEZONE=America/New_York
ORGANIZER_EMAIL=your-email@example.com
ORGANIZER_NAME=Levrok Labs
SUPPORT_EMAIL=hello@levroklabs.com
```

3. Replace the values:
   - `CAL_API_KEY`: Your API key from Step 5
   - `CAL_EVENT_TYPE_ID`: Your event type ID from Step 6
   - `CALENDAR_TIMEZONE`: Your timezone ([see list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))

## Step 8: Customize Notifications (Optional)

Cal.com sends automatic email notifications. Customize them:

1. Go to Settings → Workflows
   - Or visit: https://app.cal.com/workflows
2. Click "Create Workflow"
3. Choose trigger:
   - **Booking Created** (confirmation email)
   - **Booking Rescheduled**
   - **Booking Cancelled**
   - **Before Event** (reminder)
4. Choose action:
   - **Send Email** (to attendee or yourself)
   - **Send SMS** (requires Twilio)
   - **Webhook** (for integrations)
5. Customize email template:
   - Subject line
   - Email body (supports variables like `{ATTENDEE_NAME}`, `{EVENT_TIME}`)
   - Include meeting link: `{MEETING_URL}`
6. Click "Save"

### Example Confirmation Email:
**Subject**: Your AI Consultation is Confirmed - {EVENT_DATE}

**Body**:
```
Hi {ATTENDEE_NAME},

Your AI consultation with Levrok Labs is confirmed!

📅 Date & Time: {EVENT_DATE} at {EVENT_TIME}
⏱️ Duration: {EVENT_DURATION}
🔗 Meeting Link: {MEETING_URL}

We're looking forward to discussing how AI can transform your business.

Before the call, please:
• Review your current challenges and goals
• Prepare any questions you have
• Test your video/audio setup

Need to reschedule? Use this link: {RESCHEDULE_LINK}
Need to cancel? Use this link: {CANCEL_LINK}

See you soon!

Levrok Labs Team
{SUPPORT_EMAIL}
```

## Step 9: Set Your Availability

Configure when you're available for meetings:

1. Go to Settings → Availability
   - Or visit: https://app.cal.com/availability
2. Click "Add Schedule" or edit "Working Hours"
3. Set your availability:
   - **Monday-Friday**: 9:00 AM - 5:00 PM (example)
   - **Weekend**: Off (or adjust as needed)
4. Add date-specific overrides:
   - Click "Add override"
   - Set specific dates when you're unavailable (holidays, vacations)
5. Click "Save"

### Timezone Note:
- Availability is stored in your account timezone
- Cal.com automatically converts to attendee's timezone
- Attendees see times in their local timezone

## Step 10: Test the Integration

### Test 1: API Connection
Test your API key works:

```bash
curl https://api.cal.com/v2/event-types \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "cal-api-version: 2024-08-13"
```

Expected: JSON response with your event types

### Test 2: Create Test Booking via API
```bash
curl -X POST https://api.cal.com/v2/bookings \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "cal-api-version: 2024-08-13" \
  -d '{
    "start": "2025-11-25T15:00:00Z",
    "eventTypeId": 123456,
    "attendee": {
      "name": "Test User",
      "email": "test@example.com",
      "timeZone": "America/New_York",
      "language": "en"
    }
  }'
```

Expected: JSON response with booking details

### Test 3: Via Your Application
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Open http://localhost:3000
3. Click "Schedule a No-Cost AI audit call"
4. Fill out the form with test data:
   - **Name**: Test User
   - **Email**: your-email@example.com (use real email to receive notifications)
   - **Company**: Test Company
   - **Industry**: Technology
   - **Date**: Tomorrow
   - **Time**: Any available slot
5. Submit the form
6. Verify:
   - Success message appears
   - Email confirmation received
   - Booking appears in Cal.com dashboard
   - Meeting link is included in email

## Step 11: Production Checklist

Before deploying to production:

- [ ] Use production API key (starts with `cal_live_`)
- [ ] Test all email notifications
- [ ] Verify meeting links work (join a test meeting)
- [ ] Set up proper availability and buffer times
- [ ] Configure automated reminders (24 hours before, 1 hour before)
- [ ] Test timezone handling with different timezones
- [ ] Add API key to production environment variables
- [ ] Remove test bookings from calendar
- [ ] Set appropriate booking limits per day
- [ ] Configure cancellation/rescheduling policies
- [ ] Add branding (logo, colors) in Cal.com settings
- [ ] Set up webhooks for additional integrations (optional)

## Troubleshooting

### Error: "Invalid API key"

**Solution**: Check API key format and permissions
1. Verify key starts with `cal_` or `cal_live_`
2. Ensure no spaces or quotes around the key
3. Check key hasn't expired
4. Regenerate key if needed

### Error: "Event type not found"

**Solution**: Verify Event Type ID
1. Go to your event types page
2. Check the URL for the correct ID
3. Ensure event type is active (not deleted)
4. Try fetching event types via API to confirm

### Error: "Time slot not available"

**Solution**: Check availability settings
1. Verify you have availability set for requested time
2. Check connected calendar for conflicts
3. Ensure time is not in the past
4. Check minimum booking notice requirements
5. Verify timezone is correct

### Error: "Booking limit reached"

**Solution**: Adjust booking limits
1. Go to event type settings
2. Check "Limits" section
3. Increase max bookings per day/week
4. Or remove limit entirely

### No email notifications received

**Solution**: Check notification settings
1. Verify email address is correct in Cal.com settings
2. Check spam/junk folder
3. Go to Settings → Workflows
4. Ensure "Booking Created" workflow exists and is active
5. Test with a different email address

### Meeting link not generated

**Solution**: Check location configuration
1. Go to event type settings
2. Verify location is set (Google Meet, Zoom, etc.)
3. Ensure connected account (Google/Zoom) is still active
4. Reconnect calendar integration if needed

## Environment Variables Reference

All required environment variables for Cal.com integration:

| Variable | Example | Required | Description |
|----------|---------|----------|-------------|
| `CAL_API_KEY` | `cal_live_abc123...` | Yes | Your Cal.com API key |
| `CAL_EVENT_TYPE_ID` | `123456` | Yes | Event type ID for consultations |
| `CAL_API_VERSION` | `2024-08-13` | No | API version (has default) |
| `CALENDAR_TIMEZONE` | `America/New_York` | Yes | Your timezone |
| `ORGANIZER_EMAIL` | `pablo@levroklabs.com` | No | For reference only |
| `ORGANIZER_NAME` | `Levrok Labs` | No | For reference only |
| `SUPPORT_EMAIL` | `hello@levroklabs.com` | No | For reference only |

## Additional Resources

- [Cal.com Documentation](https://cal.com/docs)
- [API v2 Reference](https://cal.com/docs/api-reference/v2/introduction)
- [Create Booking Endpoint](https://cal.com/docs/api-reference/v2/bookings/create-a-booking)
- [Postman Collection](https://www.postman.com/calcom/cal-com-workspace/collection/bij9x14)
- [Cal.com GitHub](https://github.com/calcom/cal.com)
- [Community Forum](https://github.com/calcom/cal.com/discussions)

## Pricing

Cal.com offers several tiers:

- **Free**: Unlimited event types, basic features
- **Pro ($12/month)**: Custom branding, workflows, integrations
- **Team ($15/user/month)**: Team scheduling, analytics
- **Enterprise**: Custom pricing, SSO, dedicated support

For this integration, the **Free tier** is sufficient for basic scheduling.

## Summary

You've successfully set up Cal.com integration! The schedule-meeting API should now work when:

- Cal.com account is created
- Event type is configured
- API key is generated
- Environment variables are set
- Availability is configured

Your meetings will now:
- ✅ Automatically send confirmation emails
- ✅ Include video meeting links
- ✅ Send reminders before the meeting
- ✅ Allow attendees to reschedule/cancel
- ✅ Check for calendar conflicts
- ✅ Handle timezone conversions

For any issues, check the Cal.com dashboard or review the troubleshooting section above.
