# LEVROK Labs

> **Building Intelligence for Growing Organizations**

AI consulting agency specializing in intelligent data systems for family-owned businesses.

## What We Do

**AI Strategy & Implementation**
Transform your business with custom AI solutions that drive real results.

**No-Cost AI Audits**
Schedule a consultation to explore AI opportunities specific to your industry.

**Proven Results**
Expert team combining technical expertise with strategic business insight.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

Next.js 14 • React 18 • TypeScript • Tailwind CSS • OpenAI API • Google Calendar API

## Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - Complete technical architecture
- [Customization](#customization) - How to personalize the site

## Customization

**Update Branding**
- Company name: `lib/openai.ts`, `components/sections/Hero.tsx`
- Logo: `components/layout/Logo.tsx`
- Colors: `tailwind.config.js`

**Environment Variables**
Create `.env.local`:
```env
OPENAI_API_KEY=your_key
GOOGLE_CALENDAR_ID=your_calendar@group.calendar.google.com
ORGANIZER_EMAIL=your@email.com
```

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Optimized for Vercel deployment. Also compatible with Netlify, Railway, or any Node.js host.

---

**Contact:** hello@levroklabs.com
**Website:** [levroklabs.com](https://levroklabs.com)
