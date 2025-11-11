# Levrok Labs - AI Consulting Landing Page

A modern, minimal landing page for Levrok Labs, an AI consulting company specializing in helping family-owned businesses implement AI solutions. Built with Next.js, React, TypeScript, and Tailwind CSS.

## ✨ Features

- **AI Chat Interface**: Interactive chatbot powered by OpenAI GPT-3.5
- **Meeting Scheduling**: Integrated Google Calendar booking system
- **Minimal Design**: Clean, typography-focused layout
- **Responsive**: Optimized for all device sizes
- **Modern Tech Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Smooth Animations**: Elegant transitions and loading states
- **Professional Aesthetic**: Perfect for high-end AI consulting services

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Dependencies

This project uses the following key dependencies:

```json
{
  "dependencies": {
    "@google-apps/meet": "^0.7.0",
    "@google-cloud/local-auth": "^2.1.1",
    "googleapis": "^105.0.0",
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^10.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0"
  }
}
```

## 📁 Project Structure

```
├── pages/
│   ├── api/
│   │   ├── chat.js              # OpenAI chat API endpoint
│   │   └── schedule-meeting.js  # Google Calendar integration
│   ├── _app.js                  # Next.js app wrapper
│   ├── _document.js             # Custom document
│   └── index.js                 # Home page
├── src/
│   ├── components/
│   │   ├── CalendarPicker.tsx   # Date/time picker
│   │   ├── ChatInput.tsx        # AI chat interface
│   │   ├── ConfirmationScreen.tsx # Booking confirmation
│   │   ├── FloatingCTA.tsx      # Floating CTA button
│   │   ├── Hero.tsx             # Main hero section
│   │   ├── Logo.tsx             # Top-left logo
│   │   ├── SchedulingForm.tsx   # Meeting form
│   │   ├── SchedulingModal.tsx  # Booking modal
│   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   └── TryOurAI.tsx         # Decorative element
│   └── index.css                # Global styles and fonts
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── .env.example
```

## 🎨 Design Features

### Layout
- **Vertical Navigation**: Left sidebar with rotated text links
- **Large Typography**: Massive background text with clean hierarchy
- **Floating Elements**: Logo (top-left) and CTA (bottom-right)
- **Minimal Color Palette**: Grays with subtle accents

### Typography
- **Font**: Inter (imported from Google Fonts)
- **Hierarchy**: Light to normal weights for professional appearance
- **Responsive**: Scales beautifully across devices

### Sections
1. **Hero** - Main introduction with parallax background text
2. **About** - Company overview with skill progress bars
3. **Services** - AI solutions in card layout
4. **Contact** - Contact form and information

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_CALENDAR_ID=your_calendar_id@group.calendar.google.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
```

### Google Calendar Setup

1. Create a Google Cloud project
2. Enable the Google Calendar API
3. Create a service account and download credentials as `bento-cloud-service-credentials.json`
4. Place the credentials file in the project root
5. Share your Google Calendar with the service account email

### OpenAI Setup

1. Sign up for an OpenAI account
2. Generate an API key from the dashboard
3. Add the key to your `.env` file

## 🛠 Customization

### Update Company Name
Change "Levrok Labs" in:
- `src/components/Hero.tsx`
- `src/components/ChatInput.tsx`
- `pages/api/chat.js` (system prompt)
- `pages/api/schedule-meeting.js`

### Update Logo
Modify the logo in `src/components/Logo.tsx`

### Customize AI Prompt
Edit the system prompt in `pages/api/chat.js` to match your business

## 🎯 Key Design Principles

1. **Minimal**: Focus on content, not decoration
2. **Professional**: Clean lines and sophisticated typography
3. **Modern**: Contemporary web design trends
4. **Trustworthy**: Builds confidence for AI consulting services

## 📱 Responsive Design

- **Desktop**: Full experience with all animations
- **Tablet**: Optimized typography and spacing
- **Mobile**: Simplified layout while maintaining elegance

## 🔧 Technical Details

- **Next.js 14**: Server-side rendering and API routes
- **React 18**: Latest React features and performance
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first styling approach
- **OpenAI API**: GPT-3.5 powered chatbot
- **Google Calendar API**: Automated meeting scheduling
- **Custom Animations**: Smooth transitions and loading states

## 🚀 Deployment

Deploy to Vercel (recommended for Next.js):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

Also compatible with:
- Netlify
- AWS Amplify
- Railway
- Any Node.js hosting platform

**Important**: Make sure to set your environment variables in your hosting platform's dashboard.

## 🔒 Security Notes

- Never commit `.env` or `bento-cloud-service-credentials.json` to version control
- Add these files to `.gitignore`
- Store sensitive credentials in your hosting platform's environment variables
- Consider implementing rate limiting for API routes in production

## 🎨 Color Scheme

- **Primary**: Grays (#f8fafc to #0f172a)
- **Background**: White and light gray
- **Text**: Dark gray hierarchy
- **Accents**: Minimal use for CTAs

This design emphasizes sophistication and professionalism - ideal for positioning your AI agency as premium and trustworthy.
