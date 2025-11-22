# Bento Architecture

## Overview
Modern Next.js 14 app using App Router with organized component structure and extracted business logic.

## Directory Structure

```
bento/
├── app/                    # Next.js 14 App Router
├── components/             # React components (organized by purpose)
└── lib/                    # Shared utilities and business logic
```

## App Directory (`app/`)
Next.js App Router structure with layouts and API routes.

```
app/
├── layout.tsx             # Root layout (replaces _app + _document)
├── page.tsx               # Home page (/)
├── globals.css            # Global styles
└── api/                   # API Route Handlers
    ├── chat/route.ts      # POST /api/chat - OpenAI integration
    └── schedule-meeting/route.ts  # POST /api/schedule-meeting
```

**Key Points:**
- `layout.tsx` defines HTML structure, metadata, and fonts
- `page.tsx` is a client component (`'use client'`) for interactivity
- API routes use Next.js 13+ Route Handlers (`NextRequest`/`NextResponse`)

## Components Directory (`components/`)
Organized by component purpose for better maintainability.

```
components/
├── layout/                # Persistent UI elements
│   ├── Logo.tsx          # Top-left logo
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── FloatingCTA.tsx   # Floating CTA button
├── sections/             # Page content sections
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Services.tsx      # Services section
│   └── Contact.tsx       # Contact section
└── features/             # Interactive features
    ├── ChatInput.tsx     # AI chat interface
    ├── SchedulingModal.tsx       # Booking modal
    ├── SchedulingForm.tsx        # Meeting form
    ├── CalendarPicker.tsx        # Date/time picker
    ├── ConfirmationScreen.tsx    # Booking confirmation
    └── TryOurAI.tsx              # Decorative element
```

**Organization:**
- **layout/** - Components used across all pages
- **sections/** - Large page sections (hero, about, etc.)
- **features/** - Complex interactive components

## Library Directory (`lib/`)
Shared utilities, types, and business logic extracted from API routes.

```
lib/
├── types.ts              # All TypeScript types and type guards
├── openai.ts            # OpenAI API integration
└── google-calendar.ts   # Google Calendar API integration
```

**Benefits:**
- API routes stay clean and focused on HTTP handling
- Business logic is reusable and testable
- Types are centralized and consistent

## Data Flow

### Chat Feature
```
ChatInput → POST /api/chat → lib/openai.ts → OpenAI API → Response
```

### Meeting Scheduling
```
FloatingCTA → SchedulingModal → SchedulingForm
  → POST /api/schedule-meeting
  → lib/google-calendar.ts
  → Google Calendar API
  → ConfirmationScreen
```

## Import Paths
TypeScript path aliases for cleaner imports:

```typescript
import Sidebar from '@/components/layout/Sidebar';
import { getChatResponse } from '@/lib/openai';
import type { ChatRequest } from '@/lib/types';
```

Configured in `tsconfig.json`:
- `@/components/*` → `components/*`
- `@/lib/*` → `lib/*`
- `@/app/*` → `app/*`

## Key Technologies
- **Next.js 14** - App Router with Server Components
- **React 18** - Client components for interactivity
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling

## Migration Notes
Migrated from Pages Router to App Router:
- `pages/` → `app/` directory
- `pages/api/` → `app/api/` with Route Handlers
- Extracted API logic → `lib/` utilities
- Reorganized components by purpose
- Centralized types in `lib/types.ts`

