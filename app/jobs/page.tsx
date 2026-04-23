'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Resume } from '@/lib/types'

const DEMO_RESUME: Resume = {
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
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const JOB_BOARDS = [
  {
    id: 'jobsdb',
    name: 'JobsDB',
    region: 'Hong Kong & Asia',
    logo: '🏢',
    color: '#e8183c',
    bg: '#fff0f3',
    description: 'Hong Kong\'s #1 job platform. Thousands of roles across all industries.',
    getUrl: (title: string) => `https://hk.jobsdb.com/jobs/${encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase())}`,
    popular: true,
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    region: 'Global',
    logo: '💼',
    color: '#0a66c2',
    bg: '#f0f7ff',
    description: 'World\'s largest professional network. Apply with Easy Apply in one click.',
    getUrl: (title: string) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}&location=Hong+Kong`,
    popular: true,
  },
  {
    id: 'indeed',
    name: 'Indeed',
    region: 'Global',
    logo: '🔍',
    color: '#2164f3',
    bg: '#f0f4ff',
    description: 'Millions of jobs worldwide. Upload your CVGlow PDF directly.',
    getUrl: (title: string) => `https://hk.indeed.com/jobs?q=${encodeURIComponent(title)}&l=Hong+Kong`,
    popular: false,
  },
  {
    id: 'glassdoor',
    name: 'Glassdoor',
    region: 'Global',
    logo: '🔮',
    color: '#0caa41',
    bg: '#f0faf4',
    description: 'See salaries, company reviews, and interview tips before you apply.',
    getUrl: (title: string) => `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(title)}`,
    popular: false,
  },
  {
    id: 'ctgoodjobs',
    name: 'CTgoodjobs',
    region: 'Hong Kong',
    logo: '🌟',
    color: '#f97316',
    bg: '#fff7f0',
    description: 'Leading Hong Kong job portal. Popular for finance, tech and management roles.',
    getUrl: (title: string) => `https://www.ctgoodjobs.hk/jobs/${encodeURIComponent(title.replace(/\s+/g, '-').toLowerCase())}`,
    popular: false,
  },
  {
    id: 'seek',
    name: 'SEEK',
    region: 'APAC',
    logo: '🎯',
    color: '#1c9b6c',
    bg: '#f0faf6',
    description: 'Top platform in Australia, NZ, and Southeast Asia.',
    getUrl: (title: string) => `https://www.seek.com.au/jobs?q=${encodeURIComponent(title)}`,
    popular: false,
  },
]

interface User { email: string; full_name: string; subscription_status: string }

export default function JobsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [applying, setApplying] = useState<string | null>(null)
  const [applied, setApplied] = useState<string | null>(null)
  const [showKit, setShowKit] = useState(false)
  const [tailorStatus, setTailorStatus] = useState<string | null>(null)
  const [renderContent, setRenderContent] = useState(selectedResume?.content || DEMO_RESUME.content)

  useEffect(() => {
    const stored = sessionStorage.getItem('cvglow_user')
    if (!stored) { router.push('/auth/login'); return }
    setUser(JSON.parse(stored))
    const userResumes: Resume[] = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    const all = [...userResumes, DEMO_RESUME]
    setResumes(all)
    setSelectedResume(all[0])
  }, [router])

  const handleApply = async (boardId: string, boardUrl: string) => {
    if (!selectedResume) return
    setApplying(boardId)
    setTailorStatus('Tailoring your CV with AI...')

    let contentToRender = selectedResume.content

    // Step 1: AI tailor the CV for this job
    try {
      const res = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeContent: selectedResume.content,
          jobTitle: selectedResume.content.jobTitle,
          jobDescription: `Job board: ${boardId}. Target role: ${selectedResume.content.jobTitle}`,
        }),
      })
      if (res.ok) {
        const { tailored } = await res.json()
        if (tailored) contentToRender = tailored
      }
    } catch (e) {
      console.error('Tailor failed, using original CV:', e)
    }

    setTailorStatus('Generating PDF...')

    // Step 2: Render tailored CV and download PDF
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { jsPDF } = await import('jspdf')
      const el = document.getElementById('hidden-resume-render')
      if (el) {
        // Inject tailored content into the hidden render element
        setRenderContent(contentToRender)
        el.style.display = 'block'
        await new Promise(r => setTimeout(r, 400))
        const canvas = await html2canvas(el, { scale: 1.5, useCORS: true })
        el.style.display = 'none'
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
        const w = pdf.internal.pageSize.getWidth()
        const h = (canvas.height * w) / canvas.width
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h)
        pdf.save(`${contentToRender.fullName}_CVGlow_${boardId}.pdf`)
      }
    } catch (e) {
      console.error(e)
    }

    setTailorStatus(null)
    setApplying(null)
    setApplied(boardId)
    setTimeout(() => setApplied(null), 3000)

    // Step 3: Open job board
    window.open(boardUrl, '_blank')
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{borderColor: "#8239f5", borderTopColor: "transparent"}}></div>
    </div>
  )

  const jobTitle = selectedResume?.content.jobTitle || ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{background: "linear-gradient(135deg, #8f5ff7, #6d1ee8)"}}>
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-gray-900 hidden sm:block">CVGlow</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 transition-colors">Dashboard</Link>
            <span className="font-medium" style={{color: "#8239f5"}}>Find Jobs</span>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Find & Apply in One Click</h1>
          <p className="text-gray-500">Your CV downloads automatically, then we open the job board — ready to paste and apply.</p>
        </div>

        {/* Resume selector */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Applying with</div>
              <select
                className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                value={selectedResume?.id || ''}
                onChange={e => setSelectedResume(resumes.find(r => r.id === e.target.value) || null)}
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.title} — {r.content.fullName}</option>
                ))}
              </select>
              {selectedResume && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{selectedResume.content.jobTitle}</span>
                  {selectedResume.content.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-full" style={{background: "#f8f7ff", color: "#6d1ee8"}}>{s}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/resume/${selectedResume?.id}/preview`} className="text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
                Preview
              </Link>
              <Link href={`/resume/${selectedResume?.id}`} className="text-xs font-medium px-3 py-2 rounded-lg text-white transition-colors" style={{background: "#8239f5"}}>
                Edit CV
              </Link>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
          {[
            { step: '1', label: 'Pick a job board below' },
            { step: '2', label: 'Your CV PDF downloads' },
            { step: '3', label: 'Job board opens with your title' },
            { step: '4', label: 'Upload PDF & apply' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-2 shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{background: "#8239f5"}}>{s.step}</div>
              <span className="text-xs text-gray-600 whitespace-nowrap">{s.label}</span>
              {i < 3 && <span className="text-gray-300 text-xs ml-1">→</span>}
            </div>
          ))}
        </div>

        {/* Popular boards */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Popular in Hong Kong</div>
          <div className="grid sm:grid-cols-2 gap-4">
            {JOB_BOARDS.filter(b => b.popular).map(board => {
              const url = board.getUrl(jobTitle)
              const isApplying = applying === board.id
              const isDone = applied === board.id
              return (
                <div key={board.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-gray-100 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background: board.bg}}>{board.logo}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{board.name}</div>
                        <div className="text-xs text-gray-400">{board.region}</div>
                      </div>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full" style={{background: "#f8f7ff", color: "#6d1ee8"}}>Popular</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{board.description}</p>
                  {jobTitle && (
                    <div className="text-xs text-gray-400 mb-3 flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>Will search: <span className="font-medium text-gray-600">&quot;{jobTitle}&quot;</span></span>
                    </div>
                  )}
                  <button
                    onClick={() => handleApply(board.id, url)}
                    disabled={isApplying || !selectedResume}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                    style={{background: isDone ? '#16a34a' : board.color, color: 'white'}}
                  >
                    {isApplying ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> {tailorStatus || 'Preparing...'}</>
                    ) : isDone ? (
                      <>✓ CV Downloaded — Check new tab</>
                    ) : (
                      <>✨ AI Tailor CV + Open {board.name}</>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* More boards */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 mt-6">More Job Boards</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3">
            {JOB_BOARDS.filter(b => !b.popular).map(board => {
              const url = board.getUrl(jobTitle)
              const isApplying = applying === board.id
              const isDone = applied === board.id
              return (
                <div key={board.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{background: board.bg}}>{board.logo}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm">{board.name}</div>
                    <div className="text-xs text-gray-400 truncate">{board.description}</div>
                  </div>
                  <button
                    onClick={() => handleApply(board.id, url)}
                    disabled={isApplying || !selectedResume}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all disabled:opacity-60 text-white"
                    style={{background: isDone ? '#16a34a' : board.color}}
                  >
                    {isApplying ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                     : isDone ? '✓ Done'
                     : '✨ Apply'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Apply Kit */}
        <div className="rounded-2xl border-2 p-6" style={{borderColor: "#dcd5ff", background: "#f8f7ff"}}>
          <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📦</span>
                <h2 className="font-bold text-gray-900">Quick Apply Kit</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                Your complete application package: CV PDF + a tailored cover letter template + a checklist for each platform. Everything you need to apply faster.
              </p>
            </div>
            <button
              onClick={() => setShowKit(!showKit)}
              className="shrink-0 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors text-white"
              style={{background: "#8239f5"}}
            >
              {showKit ? 'Hide Kit' : 'View Apply Kit'}
            </button>
          </div>

          {showKit && (
            <div className="mt-6 space-y-4">
              {/* Cover Letter Template */}
              {selectedResume && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">✉️</span>
                    <h3 className="font-semibold text-gray-900">Cover Letter Template</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">Ready to copy</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed font-mono whitespace-pre-wrap border border-gray-100">
{`Dear Hiring Manager,

I am writing to express my strong interest in the [Position] role at [Company].

As a ${selectedResume.content.jobTitle} with experience at ${selectedResume.content.experiences[0]?.company || 'leading companies'}, I bring a proven track record of delivering results. ${selectedResume.content.summary || ''}

My core skills include ${selectedResume.content.skills.slice(0, 4).join(', ')}, which I believe align well with your requirements.

I have attached my CV for your review and would welcome the opportunity to discuss how I can contribute to your team.

Best regards,
${selectedResume.content.fullName}
${selectedResume.content.email}${selectedResume.content.phone ? '\n' + selectedResume.content.phone : ''}`}
                  </div>
                  <button
                    onClick={() => {
                      const text = document.querySelector('.font-mono')?.textContent || ''
                      navigator.clipboard.writeText(text).then(() => alert('Cover letter copied to clipboard!'))
                    }}
                    className="mt-3 text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors"
                  >
                    📋 Copy to clipboard
                  </button>
                </div>
              )}

              {/* Platform Checklist */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">✅</span>
                  <h3 className="font-semibold text-gray-900">Platform Upload Guide</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'JobsDB', steps: ['Click "Upload Resume" on your profile', 'Select the downloaded CVGlow PDF', 'Apply to jobs with "Quick Apply"'] },
                    { name: 'LinkedIn', steps: ['Go to Settings → Job Application Settings', 'Upload CV under "Resume"', 'Use "Easy Apply" on job listings'] },
                    { name: 'Indeed', steps: ['Go to Profile → Resume', 'Click "Upload a resume"', 'Use "Apply Now" to auto-fill from your CV'] },
                  ].map(platform => (
                    <div key={platform.name} className="border border-gray-100 rounded-lg p-3">
                      <div className="font-medium text-gray-800 text-sm mb-2">{platform.name}</div>
                      <ol className="space-y-1">
                        {platform.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                            <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden resume render for PDF */}
      <div id="hidden-resume-render" style={{display: 'none', position: 'fixed', top: '-9999px', left: 0, width: '794px', background: 'white', padding: '32px'}}>
        <div>
          <div style={{borderBottom: '2px solid #8239f5', paddingBottom: '16px', marginBottom: '16px'}}>
            <h1 style={{fontSize: '28px', fontWeight: 'bold', margin: 0}}>{renderContent.fullName}</h1>
            <p style={{color: '#8239f5', fontWeight: '600', margin: '4px 0'}}>{renderContent.jobTitle}</p>
            <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>{renderContent.email}{renderContent.phone ? ` · ${renderContent.phone}` : ''}</p>
          </div>
          {renderContent.summary && <p style={{fontSize: '14px', color: '#374151', marginBottom: '16px'}}>{renderContent.summary}</p>}
          {renderContent.experiences?.map((exp, i) => (
            <div key={i} style={{marginBottom: '12px'}}>
              <strong style={{fontSize: '14px'}}>{exp.position}</strong> — <span style={{color: '#8239f5', fontSize: '14px'}}>{exp.company}</span>
              <div style={{fontSize: '12px', color: '#6b7280'}}>{exp.startDate} – {exp.endDate}</div>
              <div style={{fontSize: '13px', color: '#374151', marginTop: '4px'}}>{exp.description}</div>
            </div>
          ))}
          <div style={{marginTop: '12px'}}>
            <strong style={{fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px'}}>Skills</strong>
            <div style={{marginTop: '6px'}}>{renderContent.skills.join(' · ')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
