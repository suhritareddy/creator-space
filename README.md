# Creator Space — AI Reel Script Generator

> **Generate viral scripts, hooks, and thumbnails in seconds.**

An AI-powered platform for content creators to generate short-form social media scripts using Gemini AI. Built as a full-stack Next.js application with workspace organization, multi-platform support, and AI thumbnail generation.

🔗 **Live Demo:** [creator-space-five.vercel.app](https://creator-space-five.vercel.app)

---

## Features

### Core
- **Workspace Organization** — Create multiple workspaces to organize scripts by channel or project
- **AI Script Generation** — Enter topic, niche, platform, and style — Gemini AI generates a complete script package
- **Script Management** — Save, edit, duplicate, and delete scripts across workspaces
- **Content Dashboard** — Clean grid view of all generated scripts with platform badges and previews

### AI Generation (3 Separate Gemini Calls)
- **Call 1 — Title + Hook** → Catchy video title + attention-grabbing opening 3 seconds
- **Call 2 — Script + Scenes** → Full 150-200 word script + scene-by-scene visual breakdown
- **Call 3 — CTA + Hashtags** → Platform-optimized call to action + 8 relevant hashtags

### Thumbnail Generation
- **AI Poster Generation** — FLUX.1-schnell via HuggingFace generates platform-specific thumbnails
- Platform-aware prompts (Instagram square, YouTube 16:9, TikTok vertical, LinkedIn professional)
- Thumbnails saved with scripts and persist across edits

### UX
- **Dark/Light Mode** — Persistent theme toggle with no flash on load
- **Mobile Responsive** — Fully optimized for all screen sizes
- **Copy to Clipboard** — One-click copy for title, script, CTA, individual hashtags, or all hashtags
- **Inline Confirmation** — Delete confirmation without browser alerts on workspace cards

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS + Shadcn UI |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma |
| Auth | Clerk |
| AI Text | Google Gemini 2.5 Flash Lite |
| AI Images | FLUX.1-schnell (HuggingFace) |
| Deployment | Vercel |

---

## AI Architecture

```
User Input (topic + niche + platform + style)
         │
         ▼
┌─────────────────────────────────┐
│   Gemini 2.5 Flash Lite         │
│                                  │
│   Call 1 → Title + Hook         │
│   Call 2 → Script + Scenes      │  (uses title from Call 1)
│   Call 3 → CTA + Hashtags       │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│   FLUX.1-schnell (HuggingFace)  │
│   Call 4 → Thumbnail Image      │  (optional, on demand)
└─────────────────────────────────┘
```

**Why separate calls instead of one prompt:**
Breaking generation into focused steps produces higher quality output — each model call has a single responsibility and the output of Call 1 informs Call 2, creating a coherent script package.

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Accounts for: Clerk, Google AI Studio, HuggingFace

### Environment Variables

Create a `.env.local` file:

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini
GEMINI_API_KEY=

# HuggingFace
HUGGINGFACE_API_KEY=
```

### Installation

```bash
# Clone the repo
git clone https://github.com/suhritareddy/creator-space.git
cd creator-space

# Install dependencies
npm install

# Push database schema
npx prisma migrate dev --name init
npx prisma generate

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Database Schema

```
User
 └── Workspace (many)   ← organizes scripts by channel/project
      └── Script (many) ← stores all generated content
           - topic, niche, platform, style (user inputs)
           - title, hook (Gemini Call 1)
           - script, scenes (Gemini Call 2)
           - cta, hashtags (Gemini Call 3)
           - thumbnailUrl (FLUX generation)
```

---

## Project Structure

```
creator-space/
├── app/
│   ├── (auth)/                  # Clerk auth pages
│   └── (main)/
│       ├── dashboard/           # Workspace grid
│       └── workspace/
│           ├── new/             # Create workspace
│           └── [id]/
│               ├── page.jsx     # Scripts grid
│               └── generate/   # Generate + edit scripts
├── actions/
│   ├── workspaces.js            # Workspace CRUD
│   └── scripts.js               # Script CRUD + AI generation
├── components/
│   └── header.jsx
├── lib/
│   ├── prisma.js
│   └── checkUser.js
└── prisma/
    └── schema.prisma
```

---

## Key Implementation Highlights

**Prompt Engineering**
Script generation is split into 3 focused Gemini calls rather than one large prompt. Each call has a single responsibility — title/hook, script/scenes, CTA/hashtags — and later calls use output from earlier ones to maintain coherence.

**Platform-Aware Thumbnails**
FLUX.1-schnell receives platform-specific style instructions (square format for Instagram, 16:9 for YouTube, vertical for TikTok) producing thumbnails optimized for each platform's aspect ratio and aesthetic.

**Atomic Data Operations**
All database operations use proper error handling with `revalidatePath` after mutations ensuring the UI always reflects current state.

**Auth + Route Protection**
Clerk middleware protects all `/dashboard` and `/workspace` routes. `checkUser` syncs Clerk identity with the database on every authenticated request.

---

## Deployment

Deployed on **Vercel** with automatic deployments on push to `main`. All environment variables configured in Vercel dashboard.

---

## Author

**Suhrita Reddy**

---
