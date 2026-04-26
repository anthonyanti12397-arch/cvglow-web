# CVGlow Dev Log

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

#### 🔄 This Session — In Progress
- [ ] Homepage redesign (honest copy, new positioning)
- [ ] 5 new resume templates
- [ ] ATS Score system
- [ ] AI Cover Letter generator
- [ ] Brand update (no emoji icons)
- [ ] Resume share links

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
