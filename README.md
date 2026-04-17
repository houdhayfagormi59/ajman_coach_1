# 🧡 Ajman Coach Pro v2.0 — Advanced Football Player Management

Professional full-stack football player management system built for coaches in Ajman, UAE. **Enhanced edition** with photo uploads, scouting/recruitment, tactical boards, team management, pie charts, and comprehensive analytics.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Supabase](https://img.shields.io/badge/Supabase-Postgres-green) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

---

## ✨ NEW Features in v2.0

### 📸 **Photo Management**
- Upload player photos directly (JPG/PNG, auto-resize)
- Supabase Storage integration
- Photo uploads for recruitment prospects
- Automatic cloud backup

### 👥 **Advanced Player Management**
- Age groups: U6 to U23 + Senior
- WhatsApp contact numbers for each player
- Team assignment (multi-team support)
- Player status tracking (fit/injured/recovering/inactive)

### 🏆 **Team Management**
- Create teams by age group or division
- View players grouped by team
- Team-specific sessions and training
- Performance analytics by team

### 🎯 **Scouting & Recruitment**
- **New Scouting Department** — track future players
- Record prospect contact info, phone, WhatsApp
- Track status: interested → contacted → trial → signed
- Upload prospect photos
- Trial date management
- Scout notes per prospect
- Recruitment pipeline visualization

### 📊 **Enhanced Analytics**
- **Pie Charts** — injury distribution, players by team, performance by team
- Player statistics and status breakdown
- Team performance comparison
- Recruitment funnel tracking

### 🎮 **Tactical Board**
- Formation selection (4-3-3, 4-2-3-1, 3-5-2, 5-3-2, 4-4-2, 3-4-3)
- Visual tactical field display
- Tactical notes per session
- Store formations with training sessions

### 📱 **Performance Tracking**
- Filter by player and team
- Performance progress chart (rating, goals, assists)
- Team-specific match statistics
- Pass accuracy, shots, tackles tracking

### 🧢 **Ajman Club Branding**
- Your official Ajman Club logo
- Orange & white theme (#EA580C, #FB923C, #FED7AA)
- Professional reports with Ajman branding
- Custom favicon

---

## 🏗️ Full Feature List

| Feature | Details |
|---------|---------|
| **Players** | 200+ fields, photo upload, age groups U6–Senior, WhatsApp, team assignment |
| **Teams** | Multiple squads, age groups, divisions, team dashboards |
| **Injuries** | Auto-status sync, severity tracking, expected return dates, pie chart analysis |
| **Performance** | Match stats, rating, goals/assists, progress charts, team breakdowns |
| **Sessions** | Tactical board, player attendance, focus areas, location tracking |
| **Scouting** | Recruitment pipeline, contact tracking, trial scheduling, status workflow |
| **Reports** | PDF with evaluation, injury history, stats, Ajman branding |
| **Dashboard** | Pie charts, stats cards, team analytics, injury breakdown, recruitment success |
| **Auth** | Email/password, coach isolation via RLS, secure session handling |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ajman-coach-pro
npm install
```

### 2. Create Supabase Project
Go to [supabase.com](https://supabase.com) → **New Project**

### 3. Setup Database
- **Supabase Dashboard** → **SQL Editor**
- Paste entire `supabase/schema.sql`
- Click **Run**

This creates 10 tables with Row-Level Security:
- `coaches`, `teams`, `players`, `injuries`, `performances`, `sessions`, `session_players`, `evaluations`, `recruitment`

### 4. Configure Storage Buckets
In **Supabase Dashboard** → **Storage**:

Create 2 public buckets:
1. `player_photos` — for player photos
2. `recruitment_photos` — for prospect photos

### 5. Set Environment Variables
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. Disable Email Confirmation (Dev)
**Supabase Auth** → **Providers** → **Email** → Turn **OFF** "Confirm email"

### 7. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → **Create Account** → Dashboard

---

## 📁 Project Structure

```
ajman-coach-pro/
├── public/
│   ├── ajman-logo.png          Your official Ajman Club logo
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx        Enhanced dashboard with pie charts
│   │   │   ├── players/        Player CRUD + photo upload
│   │   │   ├── teams/          Team management
│   │   │   ├── injuries/       Injury tracking + pie chart
│   │   │   ├── performance/    Match stats + team breakdown
│   │   │   ├── sessions/       Training with tactical board
│   │   │   ├── scouting/       🆕 Recruitment pipeline
│   │   │   └── reports/        PDF generation + evaluation
│   │   ├── (auth)/             Login/signup
│   │   └── api/                REST endpoints
│   ├── components/
│   │   ├── PlayerForm.tsx      Photo upload + new fields
│   │   ├── RecruitmentForm.tsx 🆕 Scouting form
│   │   ├── TacticalBoard.tsx   🆕 Formation selector
│   │   ├── PieChart.tsx        🆕 Analytics charts
│   │   ├── PhotoUpload.tsx     🆕 File upload component
│   │   └── ...
│   └── lib/
│       ├── supabase/           Auth clients
│       ├── pdf/                Report generator
│       ├── types.ts            TypeScript interfaces
│       └── utils.ts            Helpers
└── supabase/schema.sql         Database schema + RLS
```

---

## 🔒 Security

✅ **Row-Level Security** — Each coach sees only their data  
✅ **Auth Cookies** — httpOnly, secure via @supabase/ssr  
✅ **Middleware Protection** — /dashboard and /api routes authenticated  
✅ **Automatic Coach Sync** — Postgres trigger on signup  
✅ **Field Validation** — Server-side and client-side  

---

## 🌐 Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. Import on Vercel.com
# Select repository → Import

# 3. Add environment variables
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY

# 4. Deploy
```

---

## 📋 API Endpoints

```
POST   /api/players                 Create player
PATCH  /api/players/[id]            Update player (photo auto-uploads)
DELETE /api/players/[id]            Delete player

POST   /api/injuries                Record injury
PATCH  /api/injuries/[id]           Update status (auto-syncs player status)
DELETE /api/injuries/[id]

POST   /api/performances            Log match performance
DELETE /api/performances/[id]

POST   /api/sessions                Create training session
DELETE /api/sessions/[id]

POST   /api/recruitment             Add prospect
PATCH  /api/recruitment/[id]        Update prospect
DELETE /api/recruitment/[id]

POST   /api/teams                   Create team
POST   /api/upload                  Upload photos

GET    /api/reports/[playerId]      Generate PDF report (streamed)
```

---

## 🎨 Customization

### Change Orange Theme
Edit `tailwind.config.ts`:
```ts
brand: {
  500: '#F97316',     // Change orange
  600: '#EA580C',
  // ...
}
```

### Replace Ajman Logo
Replace `public/ajman-logo.png` with your club logo (keep filename same).

### Update Coach Club Name
Users can edit in **Settings** (extend dashboard layout if needed).

---

## 🐛 Troubleshooting

**Photos not uploading?**
- Check Supabase Storage buckets exist (`player_photos`, `recruitment_photos`)
- Verify buckets are public (Settings → Bucket Policies)

**Players not appearing in teams?**
- Ensure team is created first
- Assign player to team when creating

**Auth loop?**
- Clear cookies: DevTools → Application → Cookies → Delete all
- Check `.env.local` has correct Supabase keys

**RLS blocking queries?**
- Check Supabase RLS policies (Settings → Authentication)
- Ensure `coach_id = auth.uid()` is on all policies

---

## 📞 Support

Built for coaches in **Ajman, UAE** 🇦🇪

- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- GitHub issues: Create a new issue

---

## 📝 License

Personal / Club use in Ajman, UAE.

---

**Made with ❤️ for football**
