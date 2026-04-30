'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useToast } from '@/components/Toast'

export default function PricingPage() {
  const [upgrading, setUpgrading] = useState(false)
  const { show: showToast, toastEl } = useToast()

  const handleUpgrade = async () => {
    setUpgrading(true)
    try {
      const user = JSON.parse(sessionStorage.getItem('cvglow_user') || '{}')

      if (!user.email) {
        showToast('Please sign in first to upgrade', 'error')
        setTimeout(() => { window.location.href = '/auth/login' }, 1000)
        return
      }

      // Call checkout API
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1234567890',
          email: user.email,
        }),
      })

      const { url, error } = await res.json()

      if (error) {
        showToast('Error: ' + error, 'error')
        setUpgrading(false)
        return
      }

      // Redirect to Stripe Checkout
      if (url) {
        sessionStorage.setItem('stripe_upgrade_email', user.email)
        window.location.href = url
      }
    } catch (err) {
      console.error('Upgrade error:', err)
      showToast('Payment error. Please try again.', 'error')
      setUpgrading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {toastEl}
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: "linear-gradient(135deg, #0A1628, #0A1628)"}}>
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">CVGlow</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Simple, honest pricing</h1>
          <p className="text-gray-500 text-lg mb-12">Start free. Upgrade when you need more power.</p>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
            {/* Free */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 text-left">
              <div className="mb-6">
                <div className="font-bold text-gray-900 text-xl mb-1">Free</div>
                <div className="text-4xl font-bold text-gray-900 mt-2">$0<span className="text-base font-normal text-gray-400">/month</span></div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  { text: '1 resume', ok: true },
                  { text: 'Basic template', ok: true },
                  { text: 'PDF download', ok: true },
                  { text: 'Cloud storage', ok: true },
                  { text: 'Multiple resumes', ok: false },
                  { text: 'Premium templates', ok: false },
                  { text: 'Ad-free experience', ok: false },
                ].map(f => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    <span className={f.ok ? 'text-green-500' : 'text-gray-300'}>
                      {f.ok ? '✓' : '✕'}
                    </span>
                    <span className={f.ok ? 'text-gray-700' : 'text-gray-400'}>{f.text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup" className="block text-center border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors">
                Get Started Free
              </Link>
            </div>

            {/* Premium */}
            <div className="rounded-3xl p-8 text-left text-white relative overflow-hidden" style={{background: "linear-gradient(135deg, #0A1628, #1a3a6b)"}}>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{background: "rgba(255,255,255,0.1)"}}></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full" style={{background: "rgba(255,255,255,0.05)"}}></div>
              <div className="relative">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-bold text-xl">Premium</div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background: "rgba(255,255,255,0.2)"}}>Most Popular</span>
                  </div>
                  <div className="text-4xl font-bold mt-2">$3.99<span className="text-base font-normal text-slate-300">/month</span></div>
                  <div className="text-slate-300 text-sm mt-1">3-day free trial · Then $3.99/mo · Cancel anytime</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited resumes',
                    'Multiple premium templates',
                    'Ad-free experience',
                    'Priority support',
                    'PDF download',
                    'Cloud storage',
                    'Early access to new features',
                  ].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-200">
                      <span className="text-white font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="w-full bg-white font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-70"
                  style={{color: "#0A1628"}}
                >
                  {upgrading ? 'Redirecting to payment...' : 'Start Free Trial →'}
                </button>
                <p className="text-xs text-slate-300 text-center mt-3">3 days free · No charge until trial ends · Cancel anytime</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="text-left max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll keep access until the end of your billing period." },
                { q: "Is there a free trial?", a: "Yes — Premium comes with a 3-day free trial. You won't be charged until the trial ends, and you can cancel anytime before that." },
                { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex) via Stripe's secure payment gateway." },
                { q: "Is my data secure?", a: "Yes. All data is encrypted and stored securely. We never share your personal information." },
              ].map(item => (
                <div key={item.q} className="border border-gray-100 rounded-xl p-5">
                  <div className="font-semibold text-gray-900 mb-2">{item.q}</div>
                  <div className="text-gray-500 text-sm">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
