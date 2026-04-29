import Link from 'next/link'
import { INDUSTRIES } from '@/lib/industries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hong Kong Resume Templates by Industry | CVGlow',
  description: 'Free professional resume templates tailored for Hong Kong job seekers — Finance, Technology, Marketing, Healthcare, and more. ATS-optimised, bilingual-ready.',
  keywords: 'Hong Kong resume template, HK CV template, resume template finance, resume template technology, 香港履歷範本',
  openGraph: {
    title: 'Hong Kong Resume Templates by Industry | CVGlow',
    description: 'Professional resume templates built for the HK job market. Free ATS checker included.',
    url: 'https://cvglow-web.vercel.app/templates',
  },
}

export default function TemplatesIndexPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: '#0A1628' }}>CV</div>
            <span className="font-bold text-gray-900">CVGlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/ats" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Free ATS Check</Link>
            <Link href="/auth/signup" className="text-sm font-semibold text-white px-4 py-1.5 rounded-lg" style={{ background: '#0A1628' }}>Get Started Free</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Hong Kong Resume Templates
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Industry-specific templates built for the HK job market. ATS-optimised. Use any of them free.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDUSTRIES.map(industry => (
            <Link
              key={industry.slug}
              href={`/templates/${industry.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg hover:border-gray-200 transition-all"
            >
              <div className="text-3xl mb-3">{industry.icon}</div>
              <h2 className="font-bold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                {industry.name} Resume
              </h2>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{industry.shortDesc}</p>
              <div className="flex flex-wrap gap-1.5">
                {industry.topSkills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500">{skill}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-gray-500 mb-4">Not sure which template to use?</p>
          <Link href="/auth/signup" className="inline-block px-8 py-3.5 rounded-xl text-white font-bold" style={{ background: '#0A1628' }}>
            Build My Resume — AI Picks the Best Template
          </Link>
        </div>
      </div>
    </div>
  )
}
