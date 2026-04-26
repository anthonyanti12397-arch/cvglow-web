'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ResumePreview from '@/components/ResumePreview'
import AdModal from '@/components/AdModal'
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

export default function ResumePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [resume, setResume] = useState<Resume | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [showAdModal, setShowAdModal] = useState(false)
  const [pendingDownload, setPendingDownload] = useState(false)
  const [isFreePlan, setIsFreePlan] = useState(false)

  useEffect(() => {
    if (id === 'demo') {
      setResume(DEMO_RESUME)
      return
    }
    const stored = sessionStorage.getItem('cvglow_user')
    if (!stored) { router.push('/auth/login'); return }

    // 检查用户是否为free计划
    try {
      const user = JSON.parse(stored)
      setIsFreePlan(user.subscription_status === 'free' || !user.subscription_status)
    } catch (e) {
      setIsFreePlan(true)
    }

    if (id === 'resume-001') { setResume(DEMO_RESUME); return }
    const resumes = JSON.parse(sessionStorage.getItem('cvglow_resumes') || '[]')
    const found = resumes.find((r: Resume) => r.id === id)
    if (found) setResume(found)
    else setResume(DEMO_RESUME)
  }, [id, router])

  const handleDownload = async () => {
    // 获取当前下载计数
    const currentCount = parseInt(sessionStorage.getItem('pdf_export_count') || '0')
    const newCount = currentCount + 1

    // 更新计数
    sessionStorage.setItem('pdf_export_count', newCount.toString())

    // 检查是否需要显示广告（free用户，每2份PDF）
    if (isFreePlan && newCount % 2 === 0) {
      setPendingDownload(true)
      setShowAdModal(true)
      return
    }

    // 直接执行下载
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
    if (pendingDownload) {
      setPendingDownload(false)
      await executePdfDownload()
    }
  }

  if (!resume) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
    </div>
  )

  return (
    <>
      <AdModal isOpen={showAdModal} onClose={handleAdModalClose} minShowDuration={5} />
      <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm transition-colors shrink-0">←</Link>
            <span className="text-sm font-medium text-gray-700 truncate hidden sm:block">{resume.title}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href={`/resume/${id}`} className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 transition-colors">
              Edit
            </Link>
            <Link
              href={`/resume/${id}/customize`}
              className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg border border-orange-200 text-orange-600 hover:bg-orange-50 transition-colors"
            >
              ✨ Customize
            </Link>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg text-white transition-all disabled:opacity-60 whitespace-nowrap"
              style={{background: "#8239f5"}}
            >
              {downloading ? (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : '↓'}
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white shadow-xl rounded-sm overflow-hidden">
          <div id="resume-content">
            <ResumePreview content={resume.content} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
