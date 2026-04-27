# CVGlow Dev Log

---

## 2026-04-27 — Growth Features Session

### What Was Built

#### ✅ LinkedIn PDF Import
- `app/api/resumes/import-linkedin/route.ts` — POST endpoint, accepts PDF or image
- `GrokClient.parseLinkedInPDF()` — Grok Vision parses LinkedIn export into structured resume fields
- Create Resume page (`app/resume/create/page.tsx`) — LinkedIn import banner at top of form
- Flow: LinkedIn → Me → View Profile → More → Save to PDF → upload → all fields auto-filled

#### ✅ Interview Simulator
- `app/interview/page.tsx` — full mock interview UI
- `app/api/interview/route.ts` — POST endpoint
- `GrokClient.interviewTurn()` — Grok as interviewer: asks questions, scores answers 1-10, gives written feedback
- 8-turn session, progress bar, avg score display, "Practice Again" flow
- Dashboard quick link added
- No data stored (session only) — Supabase will persist sessions later

#### ✅ Supabase Schema (ready to activate)
- `lib/supabase/client.ts` — lazy client with `SUPABASE_ENABLED` flag, falls back to localStorage when not configured
- `lib/supabase/schema.sql` — full production schema:
  - Tables: users, resumes, resume_shares, applications, cover_letters, interview_sessions
  - RLS policies: each user can only see their own data, resume_shares are public reads
  - Triggers: updated_at auto-maintained
- **To activate**: create Supabase project → run schema SQL → add `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel env vars → flip `SUPABASE_ENABLED = true`

#### ✅ WhatsApp Bot (ready to activate)
- `app/api/whatsapp/webhook/route.ts` — Twilio TwiML webhook
- Commands: `help`, `score` (ATS tips), `interview` (STAR method), `jobs` (HK job boards), `app`
- **To activate**: Twilio account → WhatsApp Sandbox → webhook URL → add `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` to Vercel

### Tech Decisions
- Supabase schema written but NOT yet activated — app still runs 100% on localStorage/sessionStorage until credentials added
- Interview simulator is stateless by design for now (no DB dependency)
- WhatsApp bot is pure webhook, no persistent state needed

### Commit
- `21acd21` — deployed to Vercel

---

## 2026-04-26 — Strategic Overhaul Session

### Context
Full strategic review of CVGlow as a product. Identified core positioning problems and prioritized a roadmap to differentiate from commodity resume builders.

### Strategic Analysis Summary
**Problem**: CVGlow was just another resume builder. No moat, no differentiation, no retention mechanism.

**Decision**: Reposition as "AI Job Hunt Copilot for Hong Kong" — focus on the entire job search journey, not just the resume.

**Key Insights**:
- PDF export alone = no retention, users leave after downloading
- Fake "10,000+ users" damages trust with early adopters
- Single template = no "custom" feeling
- Purple #8239f5 is the default SaaS color — no personality
- The AI customization feature (Grok Vision) is the real differentiator — needs to be front and center

### Changes Made This Session

#### ✅ Memory & Documentation
- Saved full strategic analysis to `~/.claude/projects/memory/MEMORY.md`
- Created this DEVLOG.md

#### ✅ AI Resume Customization (previous session)
- `lib/grok-client.ts` — Grok Vision + text API client
- `app/api/jobs/analyze-screenshot/route.ts` — Job screenshot analysis
- `app/api/resumes/customize-for-job/route.ts` — AI resume customization
- `app/resume/[id]/customize/page.tsx` — Full customization UI
- Added "✨ Customize" button to preview page toolbar

#### ✅ Google AdSense Integration (previous session)
- Ad modal with 5-second countdown for Free users
- Every 2 PDF exports triggers ad
- Real AdSense IDs configured: ca-pub-2117567568064203, slot 5901331033
- Vercel env var: NEXT_PUBLIC_ADSENSE_CLIENT_ID

#### ✅ Session 1 (Strategic Overhaul)
- [x] Homepage redesign — new brand, honest copy, Navy + Coral palette
- [x] 5 resume templates — Classic, Tech, Finance, Creative, Minimal
- [x] ATS Score system — Grok scores resume vs job description
- [x] Cover Letter API — Grok generates personalised letters
- [x] Template picker in preview toolbar
- [x] TypeScript fixes (NextAuth, Stripe)

#### ✅ Session 2 (Retention Features)
- [x] Cover Letter UI — full page, history, copy to clipboard
- [x] Application Tracker — /tracker, kanban board, 5 stages
- [x] Resume Share Link — /r/[slug] public page with viral CTA
- [x] Share button in preview toolbar
- [x] Application Tracker link from dashboard

### Tech Decisions
- **No database yet**: Using sessionStorage + localStorage for MVP speed
- **Grok models**: grok-2-vision-1212 for image analysis, grok-4.20-reasoning for text generation
- **No Prisma**: Will add Supabase when retention features require it

### Next Session Priorities
1. Application Tracker (biggest retention driver)
2. LinkedIn import (biggest onboarding friction reducer)
3. WhatsApp Bot (Hong Kong-specific growth)
4. Supabase database (when user base justifies it)

---

## 2026-04-25 — Initial Build

### What Was Built
- Basic resume builder (edit, preview, PDF export)
- Free/Premium pricing model
- Google OAuth + GitHub OAuth setup
- Stripe payment integration (skeleton)
- Demo resume flow

### Stack
- Next.js 16, TypeScript, Tailwind CSS
- Deployed on Vercel
- No database (sessionStorage)
