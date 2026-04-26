'use client'

import { useEffect, useState, use } from 'react'
import ResumePreview from '@/components/ResumePreview'
import { Resume } from '@/lib/types'
import { TemplateId } from '@/lib/templates'
import Link from 'next/link'

export default function PublicResumePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [resume, setResume] = useState<Resume | null>(null)
  const [template, setTemplate] = useState<TemplateId>('classic')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Look up shared resume from localStorage
    // Format: cvglow_share_{slug} = { resumeId, template }
    const shareData = localStorage.getItem(`cvglow_share_${slug}`)
    if (!shareData) { setNotFound(true); return }

    const { resumeId, templateId } = JSON.parse(shareData)
    if (templateId) setTemplate(templateId)

    const resumes = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    const found = resumes.find((r: Resume) => r.id === resumeId)
    if (found) setResume(found)
    else setNotFound(true)
  }, [slug])

  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{ background: '#f1f5f9' }}>
        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-gray-700 mb-2">Resume not found</h1>
      <p className="text-sm text-gray-400 mb-6">This link may have expired or been removed.</p>
      <Link href="/" className="text-sm font-medium px-5 py-2.5 rounded-xl text-white" style={{ background: '#0A1628' }}>
        Create Your Resume
      </Link>
    </div>
  )

  if (!resume) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#0A1628', borderTopColor: 'transparent' }} />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Slim banner */}
      <div className="py-2 px-4 text-center" style={{ background: '#0A1628' }}>
        <span className="text-xs text-blue-200">
          Made with{' '}
          <Link href="/" className="text-white font-semibold hover:underline">CVGlow</Link>
          {' '}· AI-powered resume builder for Hong Kong
        </span>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white shadow-xl rounded-sm overflow-hidden">
          <ResumePreview content={resume.content} template={template} />
        </div>

        {/* CTA */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Want a resume like this?</p>
          <Link
            href="/auth/signup"
            className="inline-block px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-sm"
            style={{ background: '#0A1628' }}
          >
            Build Yours Free — CVGlow
          </Link>
        </div>
      </div>
    </div>
  )
}
