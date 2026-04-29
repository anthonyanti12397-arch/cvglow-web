'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ResumePreview from '@/components/ResumePreview'
import { ResumeContent, Experience, Education } from '@/lib/types'

const emptyContent: ResumeContent = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  summary: '',
  experiences: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
  educations: [{ school: '', degree: 'Bachelor', field: '', graduateYear: '' }],
  skills: [],
}

export default function CreateResumePage() {
  const router = useRouter()
  const [content, setContent] = useState<ResumeContent>(emptyContent)
  const [title, setTitle] = useState('My Resume')
  const [skillInput, setSkillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')

  useEffect(() => {
    const stored = sessionStorage.getItem('cvglow_user')
    if (!stored) router.push('/auth/login')
  }, [router])

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
    if (trimmed && !content.skills.includes(trimmed)) {
      update('skills', [...content.skills, trimmed])
    }
    setSkillInput('')
  }

  const removeSkill = (skill: string) => {
    update('skills', content.skills.filter(s => s !== skill))
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const newResume = {
      id: `resume-${Date.now()}`,
      user_id: 'demo-user-001',
      title,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    const existing = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    sessionStorage.setItem('cvglow_resumes', JSON.stringify([newResume, ...existing]))
    setSaving(false)
    setSaved(true)
    setTimeout(() => router.push('/dashboard'), 800)
  }

  const handleLinkedInImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImporting(true)
    setImportError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/resumes/import-linkedin', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')
      setContent({
        fullName: data.fullName || '',
        jobTitle: data.jobTitle || '',
        email: data.email || '',
        phone: data.phone || '',
        summary: data.summary || '',
        experiences: data.experiences?.length ? data.experiences : emptyContent.experiences,
        educations: data.educations?.length ? data.educations : emptyContent.educations,
        skills: data.skills || [],
      })
      if (data.fullName) setTitle(`${data.fullName} — Resume`)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-900 transition-all"
  const labelCls = "block text-xs font-medium text-gray-500 mb-1"

  const formContent = (
    <div className="space-y-5">
      {/* LinkedIn Import Banner */}
      <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#0077B5' }}>
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-sm mb-0.5">Import from LinkedIn</div>
            <div className="text-xs text-gray-500 mb-3">
              Export your LinkedIn profile as PDF: LinkedIn → Me → View Profile → More → Save to PDF
            </div>
            {importError && <div className="text-xs text-red-600 mb-2">{importError}</div>}
            <label className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${importing ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`} style={{ background: '#0077B5', color: 'white' }}>
              {importing ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Importing...
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  Upload LinkedIn PDF
                </>
              )}
              <input type="file" accept=".pdf,image/*" className="hidden" onChange={handleLinkedInImport} disabled={importing} />
            </label>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Full Name *</label>
            <input className={inputCls} placeholder="Alex Chen" value={content.fullName} onChange={e => update('fullName', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Job Title *</label>
            <input className={inputCls} placeholder="Senior Software Engineer" value={content.jobTitle} onChange={e => update('jobTitle', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Email *</label>
              <input className={inputCls} placeholder="alex@email.com" value={content.email} onChange={e => update('email', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="+1 (555) 123-4567" value={content.phone} onChange={e => update('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Professional Summary</label>
            <textarea className={`${inputCls} resize-none h-24`} placeholder="Brief overview of your experience and goals..." value={content.summary} onChange={e => update('summary', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Work Experience</h2>
          <button onClick={() => update('experiences', [...content.experiences, { company: '', position: '', startDate: '', endDate: '', description: '' }])} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors" style={{color: "#0A1628", borderColor: "#0A1628"}}>+ Add</button>
        </div>
        <div className="space-y-5">
          {content.experiences.map((exp, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">Experience {i + 1}</span>
                {i > 0 && <button onClick={() => update('experiences', content.experiences.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 text-xs transition-colors">Remove</button>}
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Company</label>
                    <input className={inputCls} placeholder="TechCorp Inc." value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Position</label>
                    <input className={inputCls} placeholder="Software Engineer" value={exp.position} onChange={e => updateExp(i, 'position', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Start Date</label>
                    <input className={inputCls} placeholder="2021-01" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>End Date</label>
                    <input className={inputCls} placeholder="Present" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea className={`${inputCls} resize-none h-20`} placeholder="Key achievements and responsibilities..." value={exp.description} onChange={e => updateExp(i, 'description', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Education</h2>
          <button onClick={() => update('educations', [...content.educations, { school: '', degree: 'Bachelor', field: '', graduateYear: '' }])} className="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors" style={{color: "#0A1628", borderColor: "#0A1628"}}>+ Add</button>
        </div>
        <div className="space-y-4">
          {content.educations.map((edu, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400">Education {i + 1}</span>
                {i > 0 && <button onClick={() => update('educations', content.educations.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 text-xs transition-colors">Remove</button>}
              </div>
              <div>
                <label className={labelCls}>School</label>
                <input className={inputCls} placeholder="UC Berkeley" value={edu.school} onChange={e => updateEdu(i, 'school', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Degree</label>
                  <select className={inputCls} value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)}>
                    <option>Bachelor</option><option>Master</option><option>PhD</option><option>Associate</option><option>Diploma</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Grad Year</label>
                  <input className={inputCls} placeholder="2019" value={edu.graduateYear} onChange={e => updateEdu(i, 'graduateYear', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Field of Study</label>
                <input className={inputCls} placeholder="Computer Science" value={edu.field} onChange={e => updateEdu(i, 'field', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Skills</h2>
        <div className="flex gap-2 mb-3">
          <input className={`${inputCls} flex-1`} placeholder="e.g. React, Python, Figma" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }} />
          <button onClick={addSkill} className="px-3 py-2 rounded-lg text-sm font-medium text-white" style={{background: "#0A1628"}}>Add</button>
        </div>
        {content.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {content.skills.map(skill => (
              <span key={skill} className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full" style={{background: "#f0f4ff", color: "#0A1628"}}>
                {skill}
                <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-[#0A1628] text-xs">✕</button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Add skills like React, TypeScript, Python...</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 transition-colors text-sm shrink-0">← Back</Link>
            <div className="w-px h-4 bg-gray-200 shrink-0 hidden sm:block"></div>
            <input value={title} onChange={e => setTitle(e.target.value)} className="text-sm font-medium text-gray-900 bg-transparent border-none outline-none min-w-0 w-32 sm:w-48 truncate hidden sm:block" />
          </div>
          {/* Mobile tab switcher */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 lg:hidden">
            <button onClick={() => setMobileTab('edit')} className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${mobileTab === 'edit' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Edit</button>
            <button onClick={() => setMobileTab('preview')} className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${mobileTab === 'preview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Preview</button>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {saved && <span className="text-green-600 text-xs sm:text-sm font-medium">✓ Saved</span>}
            <button onClick={handleSave} disabled={saving} className="text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-all disabled:opacity-60 whitespace-nowrap" style={{background: "#0A1628"}}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Desktop: side by side. Mobile: tab-switched */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6">
          {/* Form — hidden on mobile when preview tab active */}
          <div className={`space-y-5 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
            {formContent}
          </div>

          {/* Preview */}
          <div className={`lg:sticky lg:top-20 h-fit ${mobileTab === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">Live Preview</span>
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Auto-updating
              </div>
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
