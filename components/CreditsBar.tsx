'use client'

import { useEffect, useState } from 'react'
import { getUsageSnapshot, FREE_DAILY_CREDITS } from '@/lib/usage'
import Link from 'next/link'

export default function CreditsBar() {
  const [snap, setSnap] = useState({ isPremium: false, used: 0, total: FREE_DAILY_CREDITS, remaining: FREE_DAILY_CREDITS, adWatchesLeft: 3 })

  useEffect(() => {
    setSnap(getUsageSnapshot())
  }, [])

  if (snap.isPremium) return null // premium users don't need to see this

  const pct = Math.min(100, (snap.used / snap.total) * 100)
  const low = snap.remaining <= 3

  return (
    <div className={`rounded-xl border px-4 py-3 mb-5 ${low ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{low ? '⚠️' : '⚡'}</span>
          <span className="text-xs font-semibold text-gray-700">
            AI Credits: <span className={low ? 'text-amber-600' : 'text-gray-900'}>{snap.remaining}</span>
            <span className="text-gray-400"> / {snap.total} today</span>
          </span>
        </div>
        <Link href="/pricing" className="text-xs font-medium text-[#0A1628] hover:underline">
          Upgrade →
        </Link>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${low ? 'bg-amber-400' : 'bg-[#0A1628]'}`}
          style={{width: `${pct}%`}}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-gray-400">Resets at midnight</span>
        <span className="text-xs text-gray-400">{snap.adWatchesLeft} ad watches left</span>
      </div>
    </div>
  )
}
