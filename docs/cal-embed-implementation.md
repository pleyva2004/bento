# Cal.com Embed Implementation Guide

I've created **3 different implementation options** for you. Choose the one that fits your needs best.

## Package Status
✅ `@calcom/embed-react` is already installed in your package.json

---

## Option 1: Custom Button with Cal.com Modal (RECOMMENDED)
**File**: `components/layout/FloatingCTA-CalEmbed.tsx`

### What it does:
- Keeps your custom floating button design
- Opens Cal.com's booking interface in a modal
- Maintains your brand aesthetic

### How to implement:
1. Open `app/layout.tsx` or wherever you import FloatingCTA
2. Replace the import:

```typescript
// Change this:
import FloatingCTA from '@/components/layout/FloatingCTA';

// To this:
import FloatingCTA from '@/components/layout/FloatingCTA-CalEmbed';
```

### Pros:
- ✅ Keep your custom button styling
- ✅ No custom form code to maintain
- ✅ Cal.com handles availability automatically
- ✅ Built-in email notifications
- ✅ Time zone handling is automatic

### Cons:
- ❌ Lose the custom form fields (company name, niche)
- ❌ Cal.com branding may show

---

## Option 2: Cal.com Floating Button
**File**: `components/layout/FloatingCTA-CalFloating.tsx`

### What it does:
- Cal.com injects their own floating button
- Completely managed by Cal.com
- Simplest implementation

### How to implement:
1. Open `app/layout.tsx` or wherever you import FloatingCTA
2. Replace the import:

```typescript
// Change this:
import FloatingCTA from '@/components/layout/FloatingCTA';

// To this:
import FloatingCTA from '@/components/layout/FloatingCTA-CalFloating';
```

### Pros:
- ✅ Simplest code (almost nothing to maintain)
- ✅ Cal.com handles everything
- ✅ Always up-to-date with Cal.com features

### Cons:
- ❌ Limited control over styling
- ❌ Button position may not match your design exactly
- ❌ Cal.com branding visible

---

## Option 3: Modal with Embedded Cal.com
**File**: `components/features/SchedulingModal-CalEmbed.tsx`

### What it does:
- Keeps your modal design
- Embeds Cal.com booking interface inside
- Best of both worlds

### How to implement:
1. Open `components/layout/FloatingCTA.tsx`
2. Update the import:

```typescript
// Change this:
import SchedulingModal from '../features/SchedulingModal';

// To this:
import SchedulingModal from '../features/SchedulingModal-CalEmbed';
```

### Pros:
- ✅ Keep your modal design and animations
- ✅ Cal.com handles booking logic
- ✅ More control over the experience

### Cons:
- ❌ Still need to maintain modal code
- ❌ Embedded view might be cramped on mobile

---

## Customization Options

All implementations support these Cal.com config options:

```typescript
cal("ui", {
  "hideEventTypeDetails": false,    // Show/hide event details
  "layout": "week_view",             // or "month_view", "column_view"
  "styles": {
    "branding": {
      "brandColor": "#111827"        // Your brand color
    }
  }
});
```

---

## What You Can Remove After Switching

Once you switch to Cal.com embed, you can delete:
- `components/features/SchedulingModal.tsx` (old version)
- `components/features/SchedulingForm.tsx`
- `components/features/CalendarPicker.tsx`
- `components/features/ConfirmationScreen.tsx`
- `app/api/schedule-meeting/route.ts`
- `lib/cal-api.ts`

**This will remove ~800 lines of code!**

---

## My Recommendation

Start with **Option 1** (FloatingCTA-CalEmbed) because:
1. Keeps your custom button that users already see
2. Cal.com handles all the complex availability logic
3. You can always switch to Option 3 later if you want more control

---

## Testing

After implementing, test by:
1. Click the floating button
2. Cal.com modal should open
3. Select a date/time
4. Fill out the form
5. Meeting should be booked automatically
6. Check your Cal.com dashboard for the booking

---

## Need Help?

- Cal.com Embed Docs: https://cal.com/docs/platform/embed
- Your Cal.com link: `pablo-leyva-0g1kbd/levrok-labs`

