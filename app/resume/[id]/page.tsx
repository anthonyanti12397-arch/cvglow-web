'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ResumePreview from '@/components/ResumePreview'
import { ResumeContent, Experience, Education, Resume } from '@/lib/types'

const DEMO_CONTENT: ResumeContent = {
  fullName: 'Alex Chen',
  jobTitle: 'Senior Software Engineer',
  email: 'alex.chen@email.com',
  phone: '+1 (555) 123-4567',
  summary: 'Experienced software engineer with 5+ years building scalable web applications.',
  experiences: [{ company: 'TechCorp Inc.', position: 'Senior Software Engineer', startDate: '2021-01', endDate: 'Present', description: 'Led development of microservices architecture serving 2M+ users.' }],
  educations: [{ school: 'UC Berkeley', degree: 'Bachelor', field: 'Computer Science', graduateYear: '2019' }],
  skills: ['TypeScript', 'React', 'Node.js', 'AWS'],
}

export default function EditResumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [content, setContent] = useState<ResumeContent>(DEMO_CONTENT)
  const [title, setTitle] = useState('My Resume')
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('cvglow_user')
    if (!stored) { router.push('/auth/login'); return }
    if (id === 'resume-001') {
      setContent(DEMO_CONTENT)
      setTitle('Software Engineer Resume')
      return
    }
    const resumes: Resume[] = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    const found = resumes.find(r => r.id === id)
    if (found) { setContent(found.content); setTitle(found.title) }
  }, [id, router])

  const update = (field: keyof ResumeContent, value: unknown) => {
    setContent(prev => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const updateExp = (idx: number, field: keyof Experience, value: string) => {
    const updated = [...content.experiences]
    updated[idx] = { ...updated[idx], [field]: value }
    update('experiences', updated)
  }

  const updateEdu = (idx: number, field: keyof Education, value: string) => {
    const updated = [...content.educations]
    updated[idx] = { ...updated[idx], [field]: value }
    update('educations', updated)
  }

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !content.skills.includes(trimmed)) update('skills', [...content.skills, trimmed])
    setSkillInput('')
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const resumes: Resume[] = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    const updated = resumes.map(r => r.id === id ? { ...r, title, content, updated_at: new Date().toISOString() } : r)
    if (id === 'resume-001') {
      // Demo resume — just show saved
    } else {
      sessionStorage.setItem('cvglow_resumes', JSON.stringify(updated))
    }
    setSaving(false)
    setSaved(true)
  }

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all"
  const labelCls = "block text-xs font-medium text-gray-500 mb-1"

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">← Dashboard</Link>
            <div className="w-px h-4 bg-gray-200"></div>
            <input value={title} onChange={e => setTitle(e.target.value)} className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none w-48" />
          </div>
          <div className="flex items-center gap-3">
            {saved && <span className="text-green-600 text-sm font-medium">✓ Saved</span>}
            <Link href={`/resume/${id}/preview`} className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
              Preview
            </Link>
            <button onClick={handleSave} disabled={saving} className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-all disabled:opacity-60" style={{background: "#0A1628"}}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className={labelCls}>Full Name</label><input className={inputCls} value={content.fullName} onChange={e => update('fullName', e.target.value)} /></div>
                <div className="col-span-2"><label className={labelCls}>Job Title</label><input className={inputCls} value={content.jobTitle} onChange={e => update('jobTitle', e.target.value)} /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} value={content.email} onChange={e => update('email', e.target.value)} /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={content.phone} onChange={e => update('phone', e.target.value)} /></div>
                <div className="col-span-2"><label className={labelCls}>Summary</label><textarea className={`${inputCls} resize-none h-24`} value={content.summary} onChange={e => update('summary', e.target.value)} /></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-900">Work Experience</h2>
                <button onClick={() => update('experiences', [...content.experiences, { company: '', position: '', startDate: '', endDate: '', description: '' }])} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors" style={{color: "#0A1628", borderColor: "#0A1628"}}>+ Add</button>
              </div>
              <div className="space-y-4">
                {content.experiences.map((exp, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between"><span className="text-xs text-gray-400">Experience {i + 1}</span>{i > 0 && <button onClick={() => update('experiences', content.experiences.filter((_, idx) => idx !== i))} className="text-xs text-gray-400 hover:text-red-500">Remove</button>}</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className={labelCls}>Company</label><input className={inputCls} value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} /></div>
                      <div><label className={labelCls}>Position</label><input className={inputCls} value={exp.position} onChange={e => updateExp(i, 'position', e.target.value)} /></div>
                      <div><label className={labelCls}>Start</label><input className={inputCls} placeholder="2021-01" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)} /></div>
                      <div><label className={labelCls}>End</label><input className={inputCls} placeholder="Present" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)} /></div>
                      <div className="col-span-2"><label className={labelCls}>Description</label><textarea className={`${inputCls} resize-none h-20`} value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex gap-2 mb-3">
                <input className={`${inputCls} flex-1`} placeholder="Add a skill..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }} />
                <button onClick={addSkill} className="px-3 py-2 rounded-lg text-sm font-medium text-white" style={{background: "#0A1628"}}>Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {content.skills.map(skill => (
                  <span key={skill} className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full" style={{background: "#f0f4ff", color: "#0A1628"}}>
                    {skill}
                    <button onClick={() => update('skills', content.skills.filter(s => s !== skill))} className="text-slate-400 hover:text-[#0A1628] text-xs">✕</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-20 h-fit">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Live Preview</span>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Auto-updating</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="scale-[0.75] origin-top-left w-[133%]">
                <ResumePreview content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
