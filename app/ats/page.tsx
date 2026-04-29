'use client'

import { useState } from 'react'
import Link from 'next/link'

const SAMPLE_JD = `We are looking for a Senior Software Engineer to join our team in Hong Kong.

Requirements:
- 5+ years of experience with React, TypeScript, and Node.js
- Experience with cloud platforms (AWS, GCP, or Azure)
- Strong understanding of REST APIs and microservices architecture
- Experience with CI/CD pipelines and Docker
- Excellent communication skills in English and Cantonese

Nice to have:
- Experience with Next.js
- Knowledge of financial services domain
- Bachelor's degree in Computer Science or related field`

const SAMPLE_RESUME = `Alex Chen
Senior Software Engineer
alex.chen@email.com | +852 9123 4567

SUMMARY
Experienced software engineer with 6 years building web applications for fintech companies.

EXPERIENCE
Senior Engineer — HSBC Digital, Hong Kong (2021–Present)
• Led migration of legacy banking portal to React/TypeScript
• Deployed microservices on AWS ECS, reduced latency by 40%
• Mentored team of 4 junior engineers

Software Engineer — Klook, Hong Kong (2019–2021)
• Built traveler-facing features using React and Node.js
• Integrated payment gateways (Stripe, PayMe)

EDUCATION
BSc Computer Science — HKUST, 2019

SKILLS
TypeScript, React, Node.js, AWS, Docker, REST APIs, PostgreSQL, Git`

interface ATSResult {
  score: number
  verdict: string
  matchedKeywords: string[]
  missingKeywords: string[]
  strengths: string[]
  improvements: string[]
}

export default function ATSPage() {
  const [resume, setResume] = useState('')
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ATSResult | null>(null)
  const [error, setError] = useState('')
  const [showGate, setShowGate] = useState(false)

  const handleScore = async () => {
    if (!resume.trim() || !jd.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/resumes/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: { summary: resume },
          jobTitle: 'Position',
          jobDescription: jd,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scoring failed')
      setResult(data)
      setShowGate(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const loadSample = () => {
    setResume(SAMPLE_RESUME)
    setJd(SAMPLE_JD)
    setResult(null)
    setShowGate(false)
  }

  const scoreColor = (s: number) => s >= 80 ? '#059669' : s >= 60 ? '#d97706' : '#dc2626'
  const scoreBg = (s: number) => s >= 80 ? '#f0fdf4' : s >= 60 ? '#fffbeb' : '#fff5f5'
  const scoreBorder = (s: number) => s >= 80 ? '#bbf7d0' : s >= 60 ? '#fde68a' : '#fecaca'

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: '#0A1628' }}>CV</div>
            <span className="font-bold text-gray-900">CVGlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="text-sm font-semibold text-white px-4 py-1.5 rounded-lg" style={{ background: '#0A1628' }}>Free Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border mb-4" style={{ borderColor: '#e2e8f0', color: '#64748b' }}>
            Free tool · No signup needed
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">ATS Resume Scorer</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Paste your resume and a job description. Get an instant ATS score with keyword gaps and fix suggestions.
          </p>
          <button onClick={loadSample} className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 underline underline-offset-2">
            Load sample (HK Software Engineer)
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {/* Resume input */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Your Resume (paste as text)</label>
            <textarea
              value={resume}
              onChange={e => { setResume(e.target.value); setResult(null); setShowGate(false) }}
              placeholder="Paste your full resume here — name, experience, skills, education..."
              rows={16}
              className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-gray-400 resize-none placeholder-gray-300"
            />
            <div className="text-xs text-gray-400 mt-1.5 text-right">{resume.length > 0 ? `${resume.split(/\s+/).filter(Boolean).length} words` : 'Minimum 100 words recommended'}</div>
          </div>

          {/* JD input */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Job Description</label>
            <textarea
              value={jd}
              onChange={e => { setJd(e.target.value); setResult(null); setShowGate(false) }}
              placeholder="Paste the full job description from JobsDB, LinkedIn, Indeed..."
              rows={16}
              className="w-full text-sm text-gray-800 border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-gray-400 resize-none placeholder-gray-300"
            />
            <div className="text-xs text-gray-400 mt-1.5 text-right">{jd.length > 0 ? `${jd.split(/\s+/).filter(Boolean).length} words` : 'Paste from any job board'}</div>
          </div>
        </div>

        <div className="flex justify-center mb-10">
          <button
            onClick={handleScore}
            disabled={loading || !resume.trim() || !jd.trim()}
            className="flex items-center gap-2.5 text-white font-bold px-8 py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            style={{ background: '#0A1628' }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analysing with AI...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Check My ATS Score →
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl border" style={{ background: '#fff5f5', borderColor: '#fecaca', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="relative">
            {/* Score card — always visible */}
            <div className="rounded-2xl border p-6 mb-5 text-center" style={{ background: scoreBg(result.score), borderColor: scoreBorder(result.score) }}>
              <div className="text-6xl font-black mb-1" style={{ color: scoreColor(result.score) }}>{result.score}</div>
              <div className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: scoreColor(result.score) }}>out of 100</div>
              <div className="font-semibold text-gray-800 text-lg">{result.verdict}</div>
            </div>

            {/* Keyword preview — always visible */}
            <div className="grid md:grid-cols-2 gap-4 mb-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">✅ Matched Keywords ({result.matchedKeywords.length})</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.slice(0, 6).map(k => (
                    <span key={k} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#f0fdf4', color: '#166534' }}>{k}</span>
                  ))}
                  {result.matchedKeywords.length > 6 && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium text-gray-400 border border-gray-200">+{result.matchedKeywords.length - 6} more</span>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">❌ Missing Keywords ({result.missingKeywords.length})</div>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.slice(0, 6).map(k => (
                    <span key={k} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#fff5f5', color: '#dc2626' }}>{k}</span>
                  ))}
                  {result.missingKeywords.length > 6 && (
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium text-gray-400 border border-gray-200">+{result.missingKeywords.length - 6} more</span>
                  )}
                </div>
              </div>
            </div>

            {/* Gate — full analysis behind signup */}
            {showGate && (
              <div className="relative">
                {/* Blurred preview of strengths/improvements */}
                <div className="grid md:grid-cols-2 gap-4 mb-5 select-none pointer-events-none" style={{ filter: 'blur(4px)', opacity: 0.4 }}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Strengths</div>
                    {(result.strengths || []).map((s, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700 mb-2"><span className="text-green-500 shrink-0">✓</span>{s}</div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">How to Fix It</div>
                    {(result.improvements || []).map((s, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700 mb-2"><span className="text-orange-500 shrink-0">→</span>{s}</div>
                    ))}
                  </div>
                </div>

                {/* Gate overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center max-w-sm mx-4">
                    <div className="text-3xl mb-3">🔓</div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">See your full analysis</h3>
                    <p className="text-sm text-gray-500 mb-5">
                      Get the complete fix list, strengths breakdown, and build a tailored resume — free, no card needed.
                    </p>
                    <Link
                      href="/auth/signup"
                      className="block w-full py-3 rounded-xl text-white font-bold text-sm mb-3"
                      style={{ background: '#0A1628' }}
                    >
                      Create Free Account →
                    </Link>
                    <Link href="/auth/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                      Already have an account? Sign in
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        {!result && (
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { icon: '📋', title: 'Paste your resume', desc: 'Copy your resume text — no PDF needed' },
              { icon: '🔍', title: 'Add the job description', desc: 'From JobsDB, LinkedIn, Indeed, or any board' },
              { icon: '📊', title: 'Get your ATS score', desc: 'See exactly what keywords you\'re missing' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{item.title}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl p-6 sm:p-8 text-center" style={{ background: '#0A1628' }}>
          <h2 className="text-xl font-bold text-white mb-2">Fix your resume with AI</h2>
          <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
            CVGlow rewrites your resume for each job — adds the missing keywords, restructures bullet points, and generates a tailored cover letter. Free to start.
          </p>
          <Link href="/auth/signup" className="inline-block px-8 py-3 rounded-xl font-bold text-sm" style={{ background: '#FF6B5B', color: 'white' }}>
            Build My Resume Free →
          </Link>
        </div>
      </div>
    </div>
  )
}
