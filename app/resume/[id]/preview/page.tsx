'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ResumePreview from '@/components/ResumePreview'
import AdModal from '@/components/AdModal'
import { Resume } from '@/lib/types'
import { TEMPLATES, TemplateId } from '@/lib/templates'

const DEMO_RESUME: Resume = {
  id: 'resume-001',
  user_id: 'demo-user-001',
  title: 'Software Engineer Resume',
  content: {
    fullName: 'Alex Chen',
    jobTitle: 'Senior Software Engineer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 123-4567',
    summary: 'Experienced software engineer with 5+ years building scalable web applications. Passionate about clean code and user experience.',
    experiences: [
      { company: 'TechCorp Inc.', position: 'Senior Software Engineer', startDate: '2021-01', endDate: 'Present', description: 'Led development of microservices architecture serving 2M+ users. Reduced API response time by 40%.' },
      { company: 'StartupXYZ', position: 'Software Engineer', startDate: '2019-06', endDate: '2020-12', description: 'Built React frontend and Node.js backend for SaaS platform. Shipped 3 major features per quarter.' },
    ],
    educations: [{ school: 'University of California, Berkeley', degree: 'Bachelor', field: 'Computer Science', graduateYear: '2019' }],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL'],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

interface ATSResult {
  score: number
  verdict: string
  matched_keywords: string[]
  missing_keywords: string[]
  strengths: string[]
  improvements: string[]
  summary: string
}

export default function ResumePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [pendingDownload, setPendingDownload] = useState(false)
  const [isFreePlan, setIsFreePlan] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('classic')
  const [showTemplates, setShowTemplates] = useState(false)

  // ATS Score state
  const [showATSPanel, setShowATSPanel] = useState(false)
  const [atsJobTitle, setAtsJobTitle] = useState('')
  const [atsJobDesc, setAtsJobDesc] = useState('')
  const [atsResult, setAtsResult] = useState<ATSResult | null>(null)
  const [atsLoading, setAtsLoading] = useState(false)

  useEffect(() => {
    if (id === 'demo') { setResume(DEMO_RESUME); return }
    const stored = sessionStorage.getItem('cvglow_user')
    if (!stored) { router.push('/auth/login'); return }
    try {
      const user = JSON.parse(stored)
      setIsFreePlan(user.subscription_status === 'free' || !user.subscription_status)
    } catch { setIsFreePlan(true) }

    if (id === 'resume-001') { setResume(DEMO_RESUME); return }
    const resumes = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    const found = resumes.find((r: Resume) => r.id === id)
    setResume(found || DEMO_RESUME)

    // Restore saved template
    const saved = localStorage.getItem(`template_${id}`) as TemplateId | null
    if (saved) setActiveTemplate(saved)
  }, [id, router])

  const handleTemplateChange = (t: TemplateId) => {
    setActiveTemplate(t)
    localStorage.setItem(`template_${id}`, t)
    setShowTemplates(false)
  }

  const handleDownload = async () => {
    const currentCount = parseInt(sessionStorage.getItem('pdf_export_count') || '0')
    const newCount = currentCount + 1
    sessionStorage.setItem('pdf_export_count', newCount.toString())
    if (isFreePlan && newCount % 2 === 0) {
      setPendingDownload(true)
      setShowAdModal(true)
      return
    }
    await executePdfDownload()
  }

  const executePdfDownload = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')
      const element = document.getElementById('resume-content')
      if (!element) return
      const canvas = await html2canvas(element, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${resume?.content.fullName || 'resume'}_CVGlow.pdf`)
    } catch (e) {
      console.error(e)
      alert('PDF download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const handleAdModalClose = async () => {
    setShowAdModal(false)
    if (pendingDownload) { setPendingDownload(false); await executePdfDownload() }
  }

  const handleATSScore = async () => {
    if (!resume || !atsJobTitle || !atsJobDesc) return
    setAtsLoading(true)
    try {
      const res = await fetch('/api/resumes/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_content: resume.content,
          job_title: atsJobTitle,
          job_description: atsJobDesc,
        }),
      })
      const data = await res.json()
      if (data.result) setAtsResult(data.result)
    } catch { alert('ATS scoring failed. Try again.') }
    finally { setAtsLoading(false) }
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return '#059669'
    if (score >= 60) return '#d97706'
    return '#dc2626'
  }

  if (!resume) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{borderColor: "#0A1628", borderTopColor: "transparent"}}></div>
    </div>
  )

  return (
    <>
      <AdModal isOpen={showAdModal} onClose={handleAdModalClose} minShowDuration={5} />
      <div className="min-h-screen bg-gray-50">

        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm transition-colors shrink-0">←</Link>
              <span className="text-sm font-medium text-gray-700 truncate hidden sm:block">{resume.title}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Template picker */}
              <div className="relative">
                <button
                  onClick={() => setShowTemplates(v => !v)}
                  className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-400 transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  {TEMPLATES.find(t => t.id === activeTemplate)?.name ?? 'Template'}
                </button>

                {showTemplates && (
                  <div className="absolute top-full mt-1 right-0 bg-white rounded-xl border border-gray-200 shadow-xl p-3 z-50 w-72">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 px-1">Choose Template</div>
                    <div className="space-y-1">
                      {TEMPLATES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => handleTemplateChange(t.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-3 ${activeTemplate === t.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        >
                          <div className="w-8 h-8 rounded-md shrink-0" style={{background: t.preview}}></div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">{t.name}</div>
                            <div className="text-xs text-gray-400">{t.bestFor}</div>
                          </div>
                          {activeTemplate === t.id && (
                            <svg className="w-4 h-4 text-green-500 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ATS Score */}
              <button
                onClick={() => setShowATSPanel(v => !v)}
                className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ATS Score
              </button>

              <Link
                href={`/resume/${id}/customize`}
                className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors"
              >
                ✨ Customize
              </Link>

              <Link
                href={`/resume/${id}`}
                className="text-xs sm:text-sm font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
              >
                Edit
              </Link>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg text-white transition-all disabled:opacity-60"
                style={{background: "#0A1628"}}
              >
                {downloading
                  ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                }
                {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>

        {/* ATS Score Panel */}
        {showATSPanel && (
          <div className="bg-white border-b border-gray-200 print:hidden">
            <div className="max-w-4xl mx-auto px-4 py-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">ATS Score Check</h3>
                <button onClick={() => setShowATSPanel(false)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
              </div>

              {!atsResult ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    value={atsJobTitle}
                    onChange={e => setAtsJobTitle(e.target.value)}
                    placeholder="Job title (e.g. Senior Product Manager)"
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300"
                  />
                  <div className="sm:col-span-2">
                    <textarea
                      value={atsJobDesc}
                      onChange={e => setAtsJobDesc(e.target.value)}
                      placeholder="Paste the full job description here..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-300 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleATSScore}
                    disabled={atsLoading || !atsJobTitle || !atsJobDesc}
                    className="px-5 py-2 text-white text-sm font-semibold rounded-lg disabled:opacity-50 transition-opacity"
                    style={{background: "#0A1628"}}
                  >
                    {atsLoading ? 'Analysing...' : 'Get My ATS Score'}
                  </button>
                </div>
              ) : (
                <div>
                  {/* Score */}
                  <div className="flex items-center gap-6 mb-5 p-4 rounded-xl" style={{background: "#f8fafc"}}>
                    <div className="text-center">
                      <div className="text-5xl font-bold" style={{color: scoreColor(atsResult.score)}}>{atsResult.score}</div>
                      <div className="text-xs text-gray-400 mt-0.5">/ 100</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold mb-0.5" style={{color: scoreColor(atsResult.score)}}>{atsResult.verdict}</div>
                      <div className="text-sm text-gray-600">{atsResult.summary}</div>
                    </div>
                    <button onClick={() => setAtsResult(null)} className="ml-auto text-xs text-blue-600 hover:underline shrink-0">Re-run</button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {atsResult.strengths.length > 0 && (
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Strengths</div>
                        <ul className="space-y-1">
                          {atsResult.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-green-500 shrink-0">✓</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {atsResult.improvements.length > 0 && (
                      <div>
                        <div className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-2">Improvements</div>
                        <ul className="space-y-1">
                          {atsResult.improvements.map((s, i) => (
                            <li key={i} className="text-sm text-gray-600 flex gap-2">
                              <span className="text-orange-400 shrink-0">→</span>{s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {atsResult.missing_keywords.length > 0 && (
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-red-500 mb-2">Missing Keywords</div>
                      <div className="flex flex-wrap gap-1.5">
                        {atsResult.missing_keywords.map((k, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-md border" style={{background: "#fff5f5", borderColor: "#fecaca", color: "#dc2626"}}>
                            {k}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resume */}
        <div className="max-w-4xl mx-auto py-8 px-4">
          {/* Template label */}
          <div className="flex items-center justify-between mb-3 print:hidden">
            <span className="text-xs text-gray-400">Template: <strong className="text-gray-600">{TEMPLATES.find(t => t.id === activeTemplate)?.name}</strong></span>
            <span className="text-xs text-gray-400">{TEMPLATES.find(t => t.id === activeTemplate)?.bestFor}</span>
          </div>

          <div className="bg-white shadow-xl rounded-sm overflow-hidden">
            <div id="resume-content">
              <ResumePreview content={resume.content} template={activeTemplate} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
