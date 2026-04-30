'use client'

import { useEffect, useState } from 'react'
import { grantAdCredits, getRemainingAdWatches, AD_CREDITS, MAX_AD_WATCHES_PER_DAY } from '@/lib/usage'
import Link from 'next/link'

interface EarnCreditsModalProps {
  isOpen: boolean
  featureName: string       // e.g. "AI Coach message"
  creditCost: number        // how many credits this feature costs
  onEarned: () => void      // called when credits granted + user can proceed
  onClose: () => void
}

export default function EarnCreditsModal({
  isOpen,
  featureName,
  creditCost,
  onEarned,
  onClose,
}: EarnCreditsModalProps) {
  const [phase, setPhase] = useState<'confirm' | 'watching' | 'earned' | 'no_ads_left'>('confirm')
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isOpen) {
      setPhase('confirm')
      setCountdown(5)
    }
  }, [isOpen])

  useEffect(() => {
    if (phase !== 'watching') return
    if (countdown <= 0) {
      // Grant credits
      const ok = grantAdCredits()
      setPhase(ok ? 'earned' : 'no_ads_left')
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, countdown])

  const startWatching = () => {
    if (getRemainingAdWatches() <= 0) {
      setPhase('no_ads_left')
      return
    }
    setPhase('watching')
    setCountdown(5)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">

        {phase === 'confirm' && (
          <>
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Out of AI Credits</h3>
              <p className="text-gray-500 text-sm mb-1">
                <strong>{featureName}</strong> costs {creditCost} credit{creditCost > 1 ? 's' : ''}.
              </p>
              <p className="text-gray-500 text-sm mb-5">
                Watch a short ad to earn <strong>{AD_CREDITS} credits</strong> and continue.
              </p>
              <div className="text-xs text-gray-400 mb-5">
                {getRemainingAdWatches()} of {MAX_AD_WATCHES_PER_DAY} free ad watches left today
              </div>
              <button
                onClick={startWatching}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm mb-3"
                style={{background: '#0A1628'}}
              >
                Watch Ad (+{AD_CREDITS} credits)
              </button>
              <Link
                href="/pricing"
                className="block w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm text-center hover:bg-gray-50 transition-colors"
              >
                Upgrade Premium — Unlimited ✨
              </Link>
            </div>
            <button onClick={onClose} className="w-full py-3 text-xs text-gray-400 border-t hover:text-gray-600 transition-colors">
              Cancel
            </button>
          </>
        )}

        {phase === 'watching' && (
          <div className="p-6">
            {/* AdSense slot */}
            <div className="bg-gradient-to-b from-slate-50 to-blue-50 rounded-xl min-h-[200px] flex items-center justify-center mb-4 border border-gray-100">
              <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-2117567568064203'}
                data-ad-slot="5901331033"
                data-ad-format="rectangle"
                data-full-width-responsive="true"
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{countdown}</div>
              <p className="text-sm text-gray-500">Earning {AD_CREDITS} credits...</p>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0A1628] rounded-full transition-all duration-1000"
                  style={{width: `${((5 - countdown) / 5) * 100}%`}}
                />
              </div>
            </div>
          </div>
        )}

        {phase === 'earned' && (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">+{AD_CREDITS} Credits Earned!</h3>
            <p className="text-gray-500 text-sm mb-5">You can now use {featureName}.</p>
            <button
              onClick={onEarned}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm"
              style={{background: '#0A1628'}}
            >
              Continue →
            </button>
          </div>
        )}

        {phase === 'no_ads_left' && (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">😅</div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">No More Ads Today</h3>
            <p className="text-gray-500 text-sm mb-5">
              You&apos;ve watched {MAX_AD_WATCHES_PER_DAY} ads today. Credits reset at midnight.
            </p>
            <Link
              href="/pricing"
              className="block w-full py-3 rounded-xl text-white font-semibold text-sm text-center mb-3"
              style={{background: '#0A1628'}}
            >
              Upgrade for Unlimited Access
            </Link>
            <button onClick={onClose} className="w-full py-3 text-sm text-gray-400 border border-gray-200 rounded-xl hover:bg-gray-50">
              Come back tomorrow
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
