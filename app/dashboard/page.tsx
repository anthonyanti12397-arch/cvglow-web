'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Resume } from '@/lib/types'

const DEMO_RESUMES: Resume[] = [
  {
    id: 'resume-001',
    user_id: 'demo-user-001',
    title: 'Software Engineer Resume',
    content: {
      fullName: 'Alex Chen',
      jobTitle: 'Senior Software Engineer',
      email: 'alex.chen@email.com',
      phone: '+1 (555) 123-4567',
      summary: 'Experienced software engineer with 5+ years building scalable web applications.',
      experiences: [{ company: 'TechCorp Inc.', position: 'Senior Software Engineer', startDate: '2021-01', endDate: 'Present', description: 'Led development of microservices architecture.' }],
      educations: [{ school: 'UC Berkeley', degree: 'Bachelor', field: 'Computer Science', graduateYear: '2019' }],
      skills: ['TypeScript', 'React', 'Node.js', 'AWS'],
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

interface User {
  id: string
  email: string
  full_name: string
  subscription_status: string
  subscription_id?: string
  // SECURITY: Do NOT store sensitive data like passwords, tokens, or credit card info
  // Use secure HTTP-only cookies for auth tokens (handled by NextAuth)
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('cvglow_user')
    if (!stored) {
      router.push('/auth/login')
      return
    }
    const u = JSON.parse(stored)

    // Check if returning from Stripe payment
    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('session_id')

    if (sessionId && u.subscription_status !== 'premium') {
      // User returning from Stripe payment - update to premium
      const updatedUser = {
        ...u,
        subscription_id: sessionId,
        subscription_status: 'premium',
      }
      sessionStorage.setItem('cvglow_user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      // Clean up URL to remove session_id parameter
      window.history.replaceState({}, '', '/dashboard')

      // Show success message
      setTimeout(() => {
        alert('✨ 恭喜！你已升級到 Premium！')
      }, 100)
    } else {
      setUser(u)
    }

    // Load stored resumes + demo
    const storedResumes = sessionStorage.getItem('cvglow_resumes')
    const extra: Resume[] = storedResumes ? JSON.parse(storedResumes) : []
    setResumes([...extra, ...DEMO_RESUMES])
    setLoading(false)
  }, [router])

  const handleDelete = (id: string) => {
    setResumes(prev => {
      const updated = prev.filter(r => r.id !== id)
      const userCreated = updated.filter(r => r.id !== 'resume-001')
      sessionStorage.setItem('cvglow_resumes', JSON.stringify(userCreated))
      return updated
    })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('cvglow_user')
    router.push('/')
  }

  const handleCancelSubscription = async () => {
    if (!user?.subscription_id) {
      alert('No active subscription found')
      return
    }

    const confirmed = confirm(
      'Are you sure you want to cancel your Premium subscription? You will lose access at the end of your billing period.'
    )
    if (!confirmed) return

    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: user.subscription_id }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert('Error: ' + data.error)
        return
      }

      // Update user subscription status in sessionStorage
      const updatedUser = { ...user, subscription_status: 'premium_canceling' }
      sessionStorage.setItem('cvglow_user', JSON.stringify(updatedUser))
      setUser(updatedUser)

      alert(
        `Subscription canceled. You will have access until ${new Date(data.currentPeriodEnd).toLocaleDateString()}.`
      )
    } catch (err) {
      console.error('Cancel error:', err)
      alert('Failed to cancel subscription. Please try again.')
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#0A1628] border-t-transparent animate-spin"></div>
    </div>
  )

  const isPremium = user?.subscription_status === 'premium'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: "linear-gradient(135deg, #0A1628, #0A1628)"}}>
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">CVGlow</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="text-xs text-gray-400 truncate hidden sm:block max-w-[160px]">{user?.email}</span>
            {isPremium ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{background: "#f0f4ff", color: "#0A1628"}}>✨ Premium</span>
                <button
                  onClick={handleCancelSubscription}
                  className="text-xs font-medium px-2.5 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors shrink-0"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <Link href="/pricing" className="text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 transition-colors" style={{borderColor: "#0A1628", color: "#0A1628"}}>Upgrade</Link>
            )}
            <button onClick={handleLogout} className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors shrink-0 border border-gray-200 rounded-lg px-2.5 py-1">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Quick links */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Link href="/tracker" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50" style={{borderColor: '#e2e8f0', color: '#475569'}}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Application Tracker
          </Link>
          <Link href="/interview" className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50" style={{borderColor: '#e2e8f0', color: '#475569'}}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            Interview Simulator
          </Link>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''} · {isPremium ? 'Premium plan' : 'Free plan'}
            </p>
          </div>
          {(isPremium || resumes.length < 1) && (
            <Link
              href="/resume/create"
              className="flex items-center gap-2 text-white font-medium px-4 py-2 rounded-xl text-sm transition-all"
              style={{background: "#0A1628"}}
            >
              <span className="text-lg leading-none">+</span> New Resume
            </Link>
          )}
          {!isPremium && resumes.length >= 1 && (
            <Link href="/pricing" className="flex items-center gap-2 font-medium px-4 py-2 rounded-xl text-sm border transition-all" style={{borderColor: "#0A1628", color: "#0A1628"}}>
              Upgrade for more
            </Link>
          )}
        </div>

        {/* Resume grid */}
        {resumes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-500 mb-6">Create your first resume to get started.</p>
            <Link href="/resume/create" className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl" style={{background: "#0A1628"}}>
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* New resume card */}
            {(isPremium || resumes.length < 1) && (
              <Link href="/resume/create" className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-200 hover:bg-slate-50/50 transition-all group min-h-[180px]">
                <div className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-blue-300 flex items-center justify-center transition-colors">
                  <span className="text-xl text-gray-400 group-hover:text-[#0A1628] transition-colors">+</span>
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-[#0A1628] transition-colors">New Resume</span>
              </Link>
            )}

            {resumes.map(resume => (
              <div key={resume.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-gray-100 transition-shadow">
                {/* Mini preview */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                  <div className="font-semibold text-gray-800 text-sm truncate">{resume.content.fullName}</div>
                  <div className="text-xs truncate" style={{color: "#0A1628"}}>{resume.content.jobTitle}</div>
                  <div className="text-xs text-gray-400 mt-1">{resume.content.email}</div>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {resume.content.skills.slice(0, 3).map(s => (
                      <span key={s} className="bg-white text-gray-500 text-xs px-1.5 py-0.5 rounded border border-gray-200">{s}</span>
                    ))}
                    {resume.content.skills.length > 3 && (
                      <span className="text-gray-400 text-xs px-1.5 py-0.5">+{resume.content.skills.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="font-medium text-gray-800 text-sm truncate">{resume.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Updated {new Date(resume.updated_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/resume/${resume.id}/preview`}
                    className="flex-1 text-center text-xs font-medium py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
                  >
                    Preview
                  </Link>
                  <Link
                    href={`/resume/${resume.id}`}
                    className="flex-1 text-center text-xs font-medium py-2 rounded-lg text-white transition-colors"
                    style={{background: "#0A1628"}}
                  >
                    Edit
                  </Link>
                  <Link
                    href="/jobs"
                    className="px-2.5 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-blue-200 hover:text-[#0A1628] transition-colors text-xs font-medium"
                    title="Find & Apply"
                  >
                    🚀
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="px-2.5 py-2 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Find & Apply banner */}
        <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background: "linear-gradient(135deg, #0A1628, #0A1628)"}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🚀</span>
                <div className="font-bold text-lg">Ready to apply?</div>
              </div>
              <div className="text-slate-200 text-sm">
                Pick a job board, your CV downloads automatically, and we open the listing — all in one click.
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {['JobsDB', 'LinkedIn', 'Indeed', 'Glassdoor', '+more'].map(b => (
                  <span key={b} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{background: 'rgba(255,255,255,0.2)'}}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/jobs"
              className="shrink-0 flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
              style={{color: "#0A1628"}}
            >
              Find & Apply →
            </Link>
          </div>
        </div>

        {/* Upgrade banner for free users */}
        {!isPremium && (
          <div className="mt-4 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{background: "linear-gradient(135deg, #f0f4ff, #ede8ff)"}}>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Unlock unlimited resumes</div>
              <div className="text-sm text-gray-500">Upgrade to Premium for multiple templates, ad-free experience, and more.</div>
            </div>
            <Link href="/pricing" className="shrink-0 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all text-center" style={{background: "#0A1628"}}>
              Upgrade — $3.99/mo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
