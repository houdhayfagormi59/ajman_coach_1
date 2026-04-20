# Ajman Coach Pro v3.0

Professional football player management system for Ajman Club, UAE.

## What's Fixed & New

### Bug Fixes
- `Badge`: added `inactive` variant (was crashing the build)
- `player.team`: replaced with `player.age_group` in 6 files (field didn't exist)
- `cookiesToSet`: added TypeScript type annotations in supabase files
- `force-dynamic`: added to all server-rendered pages (fixes Vercel prerender crash)
- `API /players`: fixed `team: body.team` → proper `team_id`, `age_group` fields
- Dark mode: full CSS variable system so ALL components work in both themes
- Mobile: hamburger menu sidebar for phones/tablets

### Training Session Builder
- 4 collapsible sections (Warm-up, Technical, Tactical, Match Play)
- Each section has a full SVG football pitch
- 7 drawing tools: Players, Balls, Cones, Mini Goals, Arrows, Dashed pass lines
- Drag & drop on pitch
- Undo / Redo history
- Export to SVG
- 8 formations: 4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 4-4-2, 3-4-3, 4-1-4-1, 5-4-1

### Scouting System
- 4 categories: Technical (4 sliders), Physical (4), Tactical (3), Psychological (4)
- 15 rating sliders (1-10 scale)
- Auto-calculated overall score
- Auto-recommendation: Sign / Extend Trial / Monitor / Pass
- Color-coded progress bars per category

### Video Analysis
- Video player with URL-based loading
- Frame-by-frame navigation (±1 frame, ±5 seconds)
- Annotation system: tag moments as pass/shot/tackle/goal/foul/note
- Click annotation to seek to timestamp
- Auto-save annotations to database

### Dark Mode
- Toggle in sidebar footer
- Persists via localStorage
- All components support both themes

---

## Setup Guide

### 1. Install
```bash
npm install
```

### 2. Create Supabase Project
Go to https://supabase.com → New Project (free tier works)

### 3. Run Database Schema
Supabase Dashboard → SQL Editor → paste `supabase/schema.sql` → Run

### 4. Create Storage Buckets
Supabase → Storage → create 2 **public** buckets:
- `player_photos`
- `recruitment_photos`

### 5. Environment Variables
```bash
cp .env.example .env.local
```
Fill from Supabase → Project Settings → API:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 6. Disable Email Confirmation (dev)
Supabase → Authentication → Providers → Email → toggle OFF "Confirm email"

### 7. Run
```bash
npm run dev
```
→ http://localhost:3000 → Create Account → Dashboard

### Common Errors
- **"relation does not exist"** → Run schema.sql in SQL Editor
- **Photos not uploading** → Create Storage buckets and make them public
- **Auth loop** → Clear browser cookies, check .env.local keys
- **404 on Vercel** → Make sure env vars are set in Vercel Settings

---

## Deploy to Vercel (FREE)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "v3"
git remote add origin https://github.com/YOUR_USER/ajman-coach-pro.git
git push -u origin main
```

### Step 2: Import on Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repo
4. Framework: Next.js (auto-detected)

### Step 3: Set Environment Variables
In Vercel → Project Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Step 4: Deploy
Click Deploy → wait ~1 minute → your app is live!

### Alternative: Netlify
1. Push to GitHub (same as above)
2. Go to https://netlify.com → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Site Settings

---

## Project Structure
```
src/
├── app/
│   ├── (auth)/            Login + Signup
│   ├── api/               API routes
│   └── dashboard/
│       ├── page.tsx        Dashboard (3 pie charts)
│       ├── teams/          Team management
│       ├── players/        Player CRUD + photo
│       ├── injuries/       Injury tracking
│       ├── performance/    Match stats
│       ├── sessions/       Training builder (4 sections)
│       ├── video/          Video analysis + annotations
│       ├── reports/        PDF generation
│       └── scouting/       Recruitment + evaluation
├── components/
│   ├── TacticalBoard.tsx   SVG pitch with drag & drop
│   ├── SessionBuilder.tsx  4-section session builder
│   ├── ScoutingEvaluation.tsx  15-slider rating system
│   └── ...                 20 reusable components
└── lib/
    ├── types.ts            TypeScript interfaces
    ├── utils.ts            Helper functions
    ├── supabase/           Auth clients
    └── pdf/                Report generator
```
