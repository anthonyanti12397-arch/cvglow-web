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

interface User { email: string; full_name: string; subscription_status: string }

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
    setUser(u)
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
    </div>
  )

  const isPremium = user?.subscription_status === 'premium'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: "linear-gradient(135deg, #8f5ff7, #6d1ee8)"}}>
              <span className="text-white font-bold text-sm">CV</span>
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">CVGlow</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <span className="text-xs text-gray-400 truncate hidden sm:block max-w-[160px]">{user?.email}</span>
            {isPremium ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0" style={{background: "#f8f7ff", color: "#6d1ee8"}}>✨ Premium</span>
            ) : (
              <Link href="/pricing" className="text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 transition-colors" style={{borderColor: "#8239f5", color: "#8239f5"}}>Upgrade</Link>
            )}
            <button onClick={handleLogout} className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors shrink-0 border border-gray-200 rounded-lg px-2.5 py-1">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
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
              style={{background: "#8239f5"}}
            >
              <span className="text-lg leading-none">+</span> New Resume
            </Link>
          )}
          {!isPremium && resumes.length >= 1 && (
            <Link href="/pricing" className="flex items-center gap-2 font-medium px-4 py-2 rounded-xl text-sm border transition-all" style={{borderColor: "#8239f5", color: "#8239f5"}}>
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
            <Link href="/resume/create" className="inline-flex items-center gap-2 text-white font-medium px-6 py-3 rounded-xl" style={{background: "#8239f5"}}>
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* New resume card */}
            {(isPremium || resumes.length < 1) && (
              <Link href="/resume/create" className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-purple-300 hover:bg-purple-50/50 transition-all group min-h-[180px]">
                <div className="w-10 h-10 rounded-xl border-2 border-dashed border-gray-300 group-hover:border-purple-400 flex items-center justify-center transition-colors">
                  <span className="text-xl text-gray-400 group-hover:text-purple-500 transition-colors">+</span>
                </div>
                <span className="text-sm font-medium text-gray-500 group-hover:text-purple-600 transition-colors">New Resume</span>
              </Link>
            )}

            {resumes.map(resume => (
              <div key={resume.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:shadow-gray-100 transition-shadow">
                {/* Mini preview */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4 border border-gray-100">
                  <div className="font-semibold text-gray-800 text-sm truncate">{resume.content.fullName}</div>
                  <div className="text-xs truncate" style={{color: "#8239f5"}}>{resume.content.jobTitle}</div>
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
                    style={{background: "#8239f5"}}
                  >
                    Edit
                  </Link>
                  <Link
                    href="/jobs"
                    className="px-2.5 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-colors text-xs font-medium"
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
        <div className="mt-8 rounded-2xl p-5 sm:p-6" style={{background: "linear-gradient(135deg, #8239f5, #6d1ee8)"}}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🚀</span>
                <div className="font-bold text-lg">Ready to apply?</div>
              </div>
              <div className="text-purple-100 text-sm">
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
              className="shrink-0 flex items-center justify-center gap-2 bg-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-purple-50 transition-colors whitespace-nowrap"
              style={{color: "#6d1ee8"}}
            >
              Find & Apply →
            </Link>
          </div>
        </div>

        {/* Upgrade banner for free users */}
        {!isPremium && (
          <div className="mt-4 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{background: "linear-gradient(135deg, #f8f7ff, #ede8ff)"}}>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Unlock unlimited resumes</div>
              <div className="text-sm text-gray-500">Upgrade to Premium for multiple templates, ad-free experience, and more.</div>
            </div>
            <Link href="/pricing" className="shrink-0 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all text-center" style={{background: "#8239f5"}}>
              Upgrade — $3.99/mo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
