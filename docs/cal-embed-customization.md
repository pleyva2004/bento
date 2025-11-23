# Cal.com Embed Customization Guide

Complete guide to customizing the Cal.com embed appearance, animations, and dimensions.

---

## 🎨 Current Settings Applied

Your `FloatingCTA-CalEmbed.tsx` now has full control over:
- ✅ Animation speed and easing
- ✅ Modal dimensions (width/height)
- ✅ Visual effects (blur, shadows, border radius)
- ✅ Both light and dark themes

---

## 📐 Dimension Controls

### Modal Size

```typescript
"--cal-modal-width": "900px",           // Fixed width
"--cal-modal-max-width": "95vw",        // Max width (responsive)
"--cal-modal-height": "auto",           // Height (auto adjusts to content)
"--cal-modal-max-height": "90vh",       // Max height (90% of viewport)
```

### Common Dimension Presets

| Use Case | Width | Max Width | Max Height |
|----------|-------|-----------|------------|
| **Small** (mobile-first) | `600px` | `95vw` | `85vh` |
| **Medium** (default) | `800px` | `95vw` | `90vh` |
| **Large** (desktop) | `900px` | `95vw` | `90vh` |
| **Extra Large** | `1100px` | `98vw` | `95vh` |
| **Full Screen** | `100vw` | `100vw` | `100vh` |

---

## ⚡ Animation Controls

### Speed Settings

```typescript
"--cal-animation-speed": "300ms",      // Modal fade in/out
```

| Value | Feel | Best For |
|-------|------|----------|
| `100ms` | Very snappy | Minimal, fast interfaces |
| `150ms` | Quick | Default, responsive feel |
| `300ms` | Smooth | Professional, polished (current) |
| `500ms` | Dramatic | High-end, luxury brands |
| `800ms` | Slow | Probably too slow |

### Easing Functions

```typescript
"--cal-animation-easing": "ease-out",
```

| Value | Effect |
|-------|--------|
| `ease-out` | Fast start, slow end (natural) ✅ |
| `ease-in` | Slow start, fast end |
| `ease-in-out` | Smooth both ends |
| `linear` | Constant speed |
| `cubic-bezier(0.4, 0, 0.2, 1)` | Custom curve |

---

## 🎭 Visual Effects

### Background Blur

```typescript
"--cal-backdrop-blur": "4px",
```

| Value | Effect |
|-------|--------|
| `0px` | No blur, sharp background |
| `2px` | Subtle blur |
| `4px` | Noticeable blur (current) ✅ |
| `8px` | Heavy blur |
| `12px` | Very blurred background |

### Border Radius (Corners)

```typescript
"--cal-border-radius": "16px",
```

| Value | Style |
|-------|-------|
| `0px` | Sharp corners (boxy) |
| `8px` | Slightly rounded |
| `12px` | Rounded |
| `16px` | Well rounded (current) ✅ |
| `24px` | Very rounded |
| `999px` | Pill shape (if small enough) |

### Shadow

```typescript
"--cal-shadow": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
```

| Value | Effect |
|-------|--------|
| `none` | No shadow (flat) |
| `0 4px 6px rgba(0,0,0,0.1)` | Subtle shadow |
| `0 10px 25px rgba(0,0,0,0.15)` | Medium shadow |
| `0 25px 50px -12px rgba(0,0,0,0.25)` | Large shadow (current) ✅ |
| `0 50px 100px rgba(0,0,0,0.3)` | Dramatic shadow |

---

## 🎯 Quick Presets

### Preset 1: Minimal & Fast

```typescript
"cssVarsPerTheme": {
  "light": {
    "--cal-animation-speed": "150ms",
    "--cal-animation-easing": "ease-out",
    "--cal-modal-width": "700px",
    "--cal-modal-max-width": "90vw",
    "--cal-modal-max-height": "85vh",
    "--cal-backdrop-blur": "2px",
    "--cal-border-radius": "8px",
    "--cal-shadow": "0 4px 6px rgba(0,0,0,0.1)",
  }
}
```

### Preset 2: Professional & Smooth (Current)

```typescript
"cssVarsPerTheme": {
  "light": {
    "--cal-animation-speed": "300ms",
    "--cal-animation-easing": "ease-out",
    "--cal-modal-width": "900px",
    "--cal-modal-max-width": "95vw",
    "--cal-modal-max-height": "90vh",
    "--cal-backdrop-blur": "4px",
    "--cal-border-radius": "16px",
    "--cal-shadow": "0 25px 50px -12px rgba(0,0,0,0.25)",
  }
}
```

### Preset 3: Luxurious & Dramatic

```typescript
"cssVarsPerTheme": {
  "light": {
    "--cal-animation-speed": "500ms",
    "--cal-animation-easing": "cubic-bezier(0.4, 0, 0.2, 1)",
    "--cal-modal-width": "1100px",
    "--cal-modal-max-width": "98vw",
    "--cal-modal-max-height": "95vh",
    "--cal-backdrop-blur": "8px",
    "--cal-border-radius": "24px",
    "--cal-shadow": "0 50px 100px rgba(0,0,0,0.3)",
  }
}
```

### Preset 4: Mobile-First Compact

```typescript
"cssVarsPerTheme": {
  "light": {
    "--cal-animation-speed": "200ms",
    "--cal-animation-easing": "ease-out",
    "--cal-modal-width": "600px",
    "--cal-modal-max-width": "95vw",
    "--cal-modal-max-height": "80vh",
    "--cal-backdrop-blur": "3px",
    "--cal-border-radius": "12px",
    "--cal-shadow": "0 10px 25px rgba(0,0,0,0.15)",
  }
}
```

---

## 🔧 Additional Cal.com Config Options

### Layout Options

```typescript
data-cal-config='{
  "layout": "week_view"     // or "month_view", "column_view"
}'
```

### Hide/Show Elements

```typescript
cal("ui", {
  "hideEventTypeDetails": false,        // Show event details
  "hideBranding": true,                 // Hide Cal.com branding (Pro plan)
  "hideGdprBanner": true,              // Hide GDPR banner
})
```

### Theme

```typescript
cal("ui", {
  "theme": "light",    // or "dark", "auto"
})
```

---

## 💡 Pro Tips

1. **Match Your Brand**: Adjust `--cal-border-radius` to match your site's design language
2. **Performance**: Faster animations (`150ms`) feel more responsive on slower devices
3. **Mobile**: Consider smaller `--cal-modal-width` values (under `700px`) for mobile-first designs
4. **Accessibility**: Don't go below `150ms` for animations - users need time to perceive changes
5. **Testing**: Test your settings on different screen sizes and devices

---

## 🚀 Making Changes

To customize, edit: `components/layout/FloatingCTA-CalEmbed.tsx`

Find the `cssVarsPerTheme` section and adjust the values. Changes will hot-reload automatically!

---

## 📱 Responsive Behavior

The current settings automatically adapt:
- **Desktop**: Full 900px width modal
- **Tablet**: Constrained by 95vw max-width
- **Mobile**: Constrained by 95vw, smaller height (90vh)

To customize for specific breakpoints, you could use CSS media queries in your global styles:

```css
/* In globals.css */
@media (max-width: 768px) {
  [data-cal-namespace="levrok-labs"] {
    --cal-modal-width: 600px !important;
  }
}
```

---

## 🎨 Your Current Setup

- **Animation**: 300ms smooth ease-out
- **Width**: 900px (max 95vw)
- **Height**: Auto (max 90vh)
- **Blur**: 4px backdrop blur
- **Corners**: 16px rounded
- **Shadow**: Large depth shadow

Happy customizing! 🚀

