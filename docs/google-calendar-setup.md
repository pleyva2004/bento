# Google Calendar API Setup Guide

This guide walks you through setting up Google Calendar API integration for the schedule-meeting feature. Follow these steps to obtain the necessary credentials and configure your environment.

## Prerequisites

- Google Account with access to Google Cloud Console
- Admin access to the Google Calendar you want to use for scheduling

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project details:
   - **Project name**: "Bento Scheduling" (or your preferred name)
   - **Organization**: Select your organization (optional)
5. Click "Create"
6. Wait for the project to be created (30-60 seconds)

## Step 2: Enable Google Calendar API

1. In your new project, go to "APIs & Services" → "Library"
   - Or visit: https://console.cloud.google.com/apis/library
2. Search for "Google Calendar API"
3. Click on "Google Calendar API"
4. Click the "Enable" button
5. Wait for the API to be enabled

## Step 3: Create Service Account

A service account allows your application to authenticate without user interaction.

1. Go to "APIs & Services" → "Credentials"
   - Or visit: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" at the top
3. Select "Service Account"
4. Fill in the service account details:
   - **Service account name**: "bento-calendar-service"
   - **Service account ID**: Will auto-populate (e.g., `bento-calendar-service`)
   - **Description**: "Service account for Bento calendar scheduling"
5. Click "Create and Continue"
6. Grant service account access (Optional - you can skip this):
   - Click "Continue" (no roles needed for basic calendar access)
7. Grant user access (Optional):
   - Click "Done"

## Step 4: Create and Download Service Account Key

1. On the "Credentials" page, find your newly created service account
2. Click on the service account email (e.g., `bento-calendar-service@project-id.iam.gserviceaccount.com`)
3. Go to the "Keys" tab
4. Click "Add Key" → "Create new key"
5. Choose "JSON" as the key type
6. Click "Create"
7. The JSON file will automatically download to your computer
8. **IMPORTANT**: Save this file securely - you won't be able to download it again

## Step 5: Rename and Move Credentials File

1. Locate the downloaded JSON file (usually in your Downloads folder)
   - It will have a name like: `project-name-abc123.json`
2. Rename it to: `bento-cloud-service-credentials.json`
3. Move the file to your project root directory:
   ```bash
   mv ~/Downloads/project-name-abc123.json /Users/pabloleyva/Code/levrok/bento/bento-cloud-service-credentials.json
   ```

## Step 6: Create or Configure Google Calendar

### Option A: Use Existing Calendar

1. Go to [Google Calendar](https://calendar.google.com)
2. Find the calendar you want to use in the left sidebar
3. Click the three dots next to the calendar name
4. Select "Settings and sharing"
5. Scroll down to "Integrate calendar"
6. Copy the **Calendar ID** (looks like: `example@group.calendar.google.com` or `your-email@gmail.com`)
7. Save this for Step 7

### Option B: Create New Calendar

1. Go to [Google Calendar](https://calendar.google.com)
2. Next to "Other calendars", click the "+" icon
3. Select "Create new calendar"
4. Enter calendar details:
   - **Name**: "Bento Meetings"
   - **Description**: "Scheduled meetings for Bento customers"
   - **Time zone**: Select your timezone
5. Click "Create calendar"
6. Go to the calendar's settings (three dots → Settings and sharing)
7. Scroll down to "Integrate calendar"
8. Copy the **Calendar ID**

## Step 7: Grant Service Account Access to Calendar

**CRITICAL STEP**: The service account must have permission to create events on your calendar.

1. In Google Calendar, go to your target calendar's settings
2. Scroll down to "Share with specific people or groups"
3. Click "Add people and groups"
4. Enter your service account email:
   - Find this in the downloaded JSON file: look for the `client_email` field
   - It looks like: `bento-calendar-service@project-id.iam.gserviceaccount.com`
5. Set permission level to "Make changes to events"
6. Uncheck "Send email notification" (service accounts don't receive emails)
7. Click "Send"

## Step 8: Configure Environment Variables

1. Open your `.env` file in the project root
2. Add or update these variables:

```bash
# Google Calendar Configuration
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CREDENTIALS_PATH=bento-cloud-service-credentials.json

# Meeting Configuration
CALENDAR_TIMEZONE=America/New_York
ORGANIZER_EMAIL=your-email@example.com
ORGANIZER_NAME=Levrok Labs
SUPPORT_EMAIL=hello@levroklabs.com
```

3. Replace the values:
   - `GOOGLE_CALENDAR_ID`: The Calendar ID from Step 6
   - `CALENDAR_TIMEZONE`: Your timezone (e.g., `America/Los_Angeles`, `Europe/London`)
   - `ORGANIZER_EMAIL`: Your email address
   - `ORGANIZER_NAME`: Your name or company name
   - `SUPPORT_EMAIL`: Support contact email

## Step 9: Security Best Practices

### Add credentials file to .gitignore

Ensure your credentials file is NOT committed to git:

1. Open `.gitignore` in your project root
2. Add this line if not already present:
   ```
   bento-cloud-service-credentials.json
   ```

### Protect your credentials

- Never commit credentials to version control
- Never share the JSON file publicly
- Store credentials securely (password manager, secure vault)
- Rotate credentials periodically for production use
- Use different service accounts for dev/staging/production

## Step 10: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test creating a meeting:
   - Open http://localhost:3000
   - Click "Schedule a No-Cost AI audit call"
   - Fill out the form with test data
   - Submit the form

3. Verify the event was created:
   - Open Google Calendar
   - Check for the newly created event
   - Verify the time, attendee, and details are correct

## Troubleshooting

### Error: "Unable to find credentials file"

**Solution**: Verify the file path
```bash
ls bento-cloud-service-credentials.json
```
Should show the file. If not, check the file name and location.

### Error: "Calendar not found" or "Insufficient permissions"

**Solution**: Verify service account has calendar access
1. Check you shared the calendar with the service account email
2. Verify permission level is "Make changes to events"
3. Wait a few minutes for permissions to propagate

### Error: "Invalid credentials"

**Solution**: Re-download credentials
1. Delete the existing JSON file
2. Go to Google Cloud Console → Service Accounts
3. Create a new key for the service account
4. Download and place in project root

### Error: "API not enabled"

**Solution**: Enable the Google Calendar API
1. Go to Google Cloud Console
2. Navigate to "APIs & Services" → "Library"
3. Search for "Google Calendar API"
4. Click "Enable"

### Error: "Quota exceeded"

**Solution**: Check API quotas
1. Go to "APIs & Services" → "Dashboard"
2. Click on "Google Calendar API"
3. Check the quota usage
4. For production, request quota increase if needed

## Environment Variables Reference

All required environment variables for Google Calendar integration:

| Variable | Example | Description |
|----------|---------|-------------|
| `GOOGLE_CALENDAR_ID` | `abc123@group.calendar.google.com` | Your calendar's unique identifier |
| `GOOGLE_CREDENTIALS_PATH` | `bento-cloud-service-credentials.json` | Path to service account JSON file |
| `CALENDAR_TIMEZONE` | `America/New_York` | Timezone for scheduled events |
| `ORGANIZER_EMAIL` | `pablo@levroklabs.com` | Meeting organizer email |
| `ORGANIZER_NAME` | `Levrok Labs` | Meeting organizer name |
| `SUPPORT_EMAIL` | `hello@levroklabs.com` | Support contact email |

## Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [Service Accounts Overview](https://cloud.google.com/iam/docs/service-accounts)
- [Google Calendar API Quickstart](https://developers.google.com/calendar/api/quickstart/nodejs)
- [API Quotas and Limits](https://developers.google.com/calendar/api/guides/quota)

## Production Deployment Notes

For production environments:

1. **Use separate service accounts** for dev/staging/prod
2. **Set up calendar-specific email notifications** in Google Calendar settings
3. **Configure calendar event defaults** (reminders, color coding, etc.)
4. **Monitor API quota usage** to avoid rate limits
5. **Set up calendar backup** in Google Workspace admin (if applicable)
6. **Review service account permissions** regularly
7. **Rotate credentials** every 90 days for security

## Summary

You've successfully set up Google Calendar API integration! The schedule-meeting API should now work correctly when:

- Service account credentials file is in place
- Environment variables are configured
- Service account has calendar access
- Google Calendar API is enabled

If you encounter issues not covered in troubleshooting, check the application logs for detailed error messages.
