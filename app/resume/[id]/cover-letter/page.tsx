'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { Resume } from '@/lib/types'

const DEMO_RESUME = {
  id: 'resume-001', user_id: 'demo', title: 'Demo',
  content: {
    fullName: 'Alex Chen', jobTitle: 'Senior Software Engineer',
    email: 'alex.chen@email.com', phone: '+1 (555) 123-4567',
    summary: 'Experienced software engineer with 5+ years building scalable web applications.',
    experiences: [{ company: 'TechCorp Inc.', position: 'Senior Software Engineer', startDate: '2021-01', endDate: 'Present', description: 'Led microservices architecture serving 2M+ users.' }],
    educations: [{ school: 'UC Berkeley', degree: 'Bachelor', field: 'Computer Science', graduateYear: '2019' }],
    skills: ['TypeScript', 'React', 'Node.js', 'AWS'],
  },
  created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
}

interface SavedLetter {
  id: string
  job_title: string
  company_name: string
  created_at: string
  letter: string
  word_count: number
}

export default function CoverLetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [resume, setResume] = useState<Resume | null>(null)
  const [jobTitle, setJobTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [result, setResult] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState<SavedLetter[]>([])
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate')

  useEffect(() => {
    if (id === 'demo' || id === 'resume-001') { setResume(DEMO_RESUME as Resume); return }
    const stored = sessionStorage.getItem('cvglow_user')
    if (!stored) { window.location.href = '/auth/login'; return }
    const resumes = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    const found = resumes.find((r: Resume) => r.id === id)
    setResume(found || DEMO_RESUME as Resume)

    const history = localStorage.getItem(`cover_letters_${id}`)
    if (history) setSaved(JSON.parse(history))
  }, [id])

  async function generate() {
    if (!resume || !jobTitle || !jobDesc) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/resumes/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_content: resume.content,
          job_title: jobTitle,
          company_name: companyName,
          job_description: jobDesc,
        }),
      })
      const data = await res.json()
      if (!data.result) throw new Error(data.error || 'Failed')
      setResult(data.result.cover_letter)
      setWordCount(data.result.word_count)

      // Save to history
      const record: SavedLetter = {
        id: Date.now().toString(),
        job_title: jobTitle,
        company_name: companyName,
        created_at: new Date().toISOString(),
        letter: data.result.cover_letter,
        word_count: data.result.word_count,
      }
      const updated = [record, ...saved]
      setSaved(updated)
      localStorage.setItem(`cover_letters_${id}`, JSON.stringify(updated))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function loadFromHistory(record: SavedLetter) {
    setJobTitle(record.job_title)
    setCompanyName(record.company_name)
    setResult(record.letter)
    setWordCount(record.word_count)
    setActiveTab('generate')
  }

  if (!resume) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0A1628', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link href={`/resume/${id}/preview`} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">←</Link>
            <span className="text-sm font-semibold text-gray-800">{resume.title}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#f0fdf4', color: '#059669' }}>Cover Letter</span>
          </div>
          <Link href={`/resume/${id}/customize`} className="text-xs font-medium px-3 py-1.5 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors">
            ✨ AI Customize
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Cover Letter Generator</h1>
          <p className="text-gray-500">AI writes a personalised letter from your resume + the job description.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
          {(['generate', 'history'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {tab === 'history' ? `History (${saved.length})` : tab}
            </button>
          ))}
        </div>

        {activeTab === 'generate' ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Job Title *</label>
                <input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Product Manager"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Company Name</label>
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. HSBC, Cathay Pacific"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-widest mb-1.5">Job Description *</label>
                <textarea
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the full job description here. The more detail, the better the letter."
                  rows={10}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 bg-white resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <button
                onClick={generate}
                disabled={loading || !jobTitle || !jobDesc}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#0A1628' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Writing your letter...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Generate Cover Letter
                  </>
                )}
              </button>

              {/* Resume being used */}
              <div className="p-3 rounded-lg border border-gray-100 bg-white">
                <div className="text-xs text-gray-400 mb-1">Using resume</div>
                <div className="text-sm font-medium text-gray-700">{resume.content.fullName}</div>
                <div className="text-xs text-gray-400">{resume.content.jobTitle}</div>
              </div>
            </div>

            {/* Right: result */}
            <div>
              {result ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-gray-800">Your Cover Letter</span>
                      <span className="ml-2 text-xs text-gray-400">{wordCount} words</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
                      >
                        {copied ? (
                          <><svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Copied!</>
                        ) : (
                          <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{result}</div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400">Saved to history · Edit if needed before sending</p>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-8">
                  <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: '#f1f5f9' }}>
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Your letter will appear here</p>
                  <p className="text-xs text-gray-400">Fill in the job details and click Generate</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* History tab */
          <div>
            {saved.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="font-medium mb-1">No letters yet</p>
                <p className="text-sm">Generate your first cover letter above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {saved.map(record => (
                  <div key={record.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold text-gray-900">{record.job_title}</div>
                        {record.company_name && <div className="text-sm text-gray-500">{record.company_name}</div>}
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(record.created_at).toLocaleDateString('en-HK', { day: 'numeric', month: 'short', year: 'numeric' })} · {record.word_count} words
                        </div>
                      </div>
                      <button
                        onClick={() => loadFromHistory(record)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg shrink-0 transition-colors"
                        style={{ background: '#f1f5f9', color: '#475569' }}
                      >
                        Load
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 line-clamp-2">{record.letter.slice(0, 150)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
