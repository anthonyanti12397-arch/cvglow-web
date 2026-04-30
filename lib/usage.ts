/**
 * AI Credits System
 *
 * Free users: 10 credits/day, reset at midnight
 * Premium users: unlimited
 * Watch ad: +5 credits (max 3 ad watches per day)
 *
 * Credit costs:
 *   coach_message     = 1  (AI Career Coach, per message)
 *   ats_score         = 2  (ATS checker)
 *   cover_letter      = 3  (Cover letter generation)
 *   resume_customize  = 3  (AI resume customization)
 *   interview_turn    = 1  (Interview simulator, per turn)
 *   linkedin_import   = 2  (LinkedIn PDF import)
 */

export type AIFeature =
  | 'coach_message'
  | 'ats_score'
  | 'cover_letter'
  | 'resume_customize'
  | 'interview_turn'
  | 'linkedin_import'

export const CREDIT_COSTS: Record<AIFeature, number> = {
  coach_message: 1,
  ats_score: 2,
  cover_letter: 3,
  resume_customize: 3,
  interview_turn: 1,
  linkedin_import: 2,
}

export const FREE_DAILY_CREDITS = 10
export const AD_CREDITS = 5
export const MAX_AD_WATCHES_PER_DAY = 3

interface UsageData {
  date: string         // toDateString() — resets when date changes
  used: number         // credits used today
  adWatches: number    // ad watches today
  bonus: number        // bonus credits earned from ads today
}

const STORAGE_KEY = 'cvglow_ai_usage'

function getToday(): string {
  return new Date().toDateString()
}

function loadUsage(): UsageData {
  if (typeof window === 'undefined') return { date: getToday(), used: 0, adWatches: 0, bonus: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { date: getToday(), used: 0, adWatches: 0, bonus: 0 }
    const data: UsageData = JSON.parse(raw)
    // Reset if it's a new day
    if (data.date !== getToday()) {
      return { date: getToday(), used: 0, adWatches: 0, bonus: 0 }
    }
    return data
  } catch {
    return { date: getToday(), used: 0, adWatches: 0, bonus: 0 }
  }
}

function saveUsage(data: UsageData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function isPremium(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const user = JSON.parse(sessionStorage.getItem('cvglow_user') || '{}')
    return user.subscription_status === 'premium'
  } catch {
    return false
  }
}

/** Returns remaining credits for today */
export function getRemainingCredits(): number {
  if (isPremium()) return Infinity
  const data = loadUsage()
  const total = FREE_DAILY_CREDITS + data.bonus
  return Math.max(0, total - data.used)
}

/** Returns how many ad watches are left today */
export function getRemainingAdWatches(): number {
  const data = loadUsage()
  return Math.max(0, MAX_AD_WATCHES_PER_DAY - data.adWatches)
}

/** Check if user can use a feature */
export function canUseFeature(feature: AIFeature): boolean {
  if (isPremium()) return true
  const cost = CREDIT_COSTS[feature]
  return getRemainingCredits() >= cost
}

/** Deduct credits for a feature use. Returns false if insufficient. */
export function deductCredits(feature: AIFeature): boolean {
  if (isPremium()) return true
  const cost = CREDIT_COSTS[feature]
  const data = loadUsage()
  const total = FREE_DAILY_CREDITS + data.bonus
  if (data.used + cost > total) return false
  data.used += cost
  saveUsage(data)
  return true
}

/** Grant bonus credits after watching an ad. Returns false if daily limit reached. */
export function grantAdCredits(): boolean {
  const data = loadUsage()
  if (data.adWatches >= MAX_AD_WATCHES_PER_DAY) return false
  data.adWatches += 1
  data.bonus += AD_CREDITS
  saveUsage(data)
  return true
}

/** Get full usage snapshot for display */
export function getUsageSnapshot() {
  if (isPremium()) {
    return { isPremium: true, used: 0, total: Infinity, remaining: Infinity, adWatchesLeft: 0 }
  }
  const data = loadUsage()
  const total = FREE_DAILY_CREDITS + data.bonus
  return {
    isPremium: false,
    used: data.used,
    total,
    remaining: Math.max(0, total - data.used),
    adWatchesLeft: Math.max(0, MAX_AD_WATCHES_PER_DAY - data.adWatches),
  }
}

/** Human-readable feature names for UI */
export const FEATURE_NAMES: Record<AIFeature, string> = {
  coach_message: 'AI Coach message',
  ats_score: 'ATS Score check',
  cover_letter: 'Cover Letter',
  resume_customize: 'Resume Customization',
  interview_turn: 'Interview turn',
  linkedin_import: 'LinkedIn Import',
}
