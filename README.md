# Neural Strategies - AI Agency Landing Page

A modern, minimal landing page inspired by the Lexor Strategies design, built for AI agencies using React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Minimal Design**: Clean, typography-focused layout inspired by premium agencies
- **Minimal Dependencies**: Only essential packages (React + Vite + Tailwind)
- **Responsive**: Optimized for all device sizes
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS, Vite
- **Smooth Animations**: Parallax scrolling and subtle transitions
- **Professional Aesthetic**: Perfect for high-end AI consulting services

## 🚀 Quick Start

```bash
# Remove old node_modules and package-lock.json (if switching from CRA)
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Minimal Dependencies

This project uses only essential dependencies:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

## 📁 Project Structure

```
├── index.html             # Vite entry point
├── src/
│   ├── components/
│   │   ├── About.tsx          # About section with skills
│   │   ├── Contact.tsx        # Contact form and info
│   │   ├── FloatingCTA.tsx    # Bottom-right CTA button
│   │   ├── Hero.tsx           # Main hero section
│   │   ├── Logo.tsx           # Top-left logo
│   │   ├── Services.tsx       # AI services showcase
│   │   └── Sidebar.tsx        # Vertical navigation
│   ├── App.tsx                # Main app component
│   ├── index.css              # Global styles and fonts
│   └── index.tsx              # App entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
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

## 🛠 Customization

### Update Agency Name
Replace "Neural Strategies" in:
- `src/components/Hero.tsx` (line 24)
- `src/components/About.tsx` (line 8)

### Update Logo
Change the logo text in `src/components/Logo.tsx` (line 6):
```tsx
<span className="text-white text-lg font-bold tracking-tight">AI</span>
```

### Update Contact Information
Modify contact details in `src/components/Contact.tsx` (lines 20-30)

### Update Services
Edit the services array in `src/components/Services.tsx` (lines 4-22)

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

- **Vite**: Lightning-fast development and building
- **React 18**: Latest React features and performance
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first styling approach
- **CSS Grid/Flexbox**: Modern layout techniques
- **Custom Animations**: Smooth parallax and transitions

## 🚀 Deployment

The app is ready for deployment to any static hosting service:

```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

Perfect for:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## ⚡ Why Vite?

- **Faster Development**: Instant server start and HMR
- **Smaller Bundle**: Optimized production builds
- **Modern**: Built for modern browsers
- **Simple**: Less configuration than CRA

## 🎨 Color Scheme

- **Primary**: Grays (#f8fafc to #0f172a)
- **Background**: White and light gray
- **Text**: Dark gray hierarchy
- **Accents**: Minimal use for CTAs

This design emphasizes sophistication and professionalism - ideal for positioning your AI agency as premium and trustworthy.
