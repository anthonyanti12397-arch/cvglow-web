import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getIndustryBySlug, generateStaticParams as genParams, INDUSTRIES } from '@/lib/industries'
import type { Metadata } from 'next'

export { genParams as generateStaticParams }

export async function generateMetadata({ params }: { params: Promise<{ industry: string }> }): Promise<Metadata> {
  const { industry: slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) return {}
  return {
    title: `${industry.name} Resume Template Hong Kong | CVGlow`,
    description: `Free ${industry.name} resume template built for the Hong Kong job market. ${industry.shortDesc} ATS-optimised. Download and customise free.`,
    keywords: `${industry.name} resume Hong Kong, ${industry.nameZh} 履歷, HK ${industry.name} CV template, ${industry.topSkills.slice(0, 3).join(', ')}`,
    openGraph: {
      title: `${industry.name} Resume Template — Hong Kong | CVGlow`,
      description: industry.longDesc,
      url: `https://cvglow-web.vercel.app/templates/${slug}`,
    },
  }
}

export default async function IndustryTemplatePage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry: slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) notFound()

  const related = INDUSTRIES.filter(i => i.slug !== slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ background: '#0A1628' }}>CV</div>
            <span className="font-bold text-gray-900">CVGlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">All Templates</Link>
            <Link href="/ats" className="text-sm text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">Free ATS Check</Link>
            <Link href="/auth/signup" className="text-sm font-semibold text-white px-4 py-1.5 rounded-lg" style={{ background: '#0A1628' }}>Use This Template Free</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <span>/</span>
          <Link href="/templates" className="hover:text-gray-600">Templates</Link>
          <span>/</span>
          <span className="text-gray-600">{industry.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="text-4xl mb-4">{industry.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              {industry.name} Resume Template
              <span className="text-gray-400 font-normal"> — Hong Kong</span>
            </h1>
            <p className="text-gray-500 text-sm mb-2">{industry.nameZh} 履歷範本</p>
            <p className="text-gray-600 leading-relaxed mb-8">{industry.longDesc}</p>

            {/* Sample bullets */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-8">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Sample Resume Bullet Points</h2>
              <div className="space-y-3">
                {industry.sampleBullets.map((bullet, i) => (
                  <div key={i} className="flex gap-3 text-sm text-gray-700">
                    <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4">CVGlow AI writes bullets like these, customised for your experience.</p>
            </div>

            {/* Top skills */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 mb-4">Must-Have Skills for {industry.name} in HK</h2>
              <div className="flex flex-wrap gap-2">
                {industry.topSkills.map(skill => (
                  <span key={skill} className="text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 bg-gray-50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Job titles */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 mb-4">Common Job Titles</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {industry.topJobTitles.map(title => (
                  <div key={title} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                    {title}
                  </div>
                ))}
              </div>
            </div>

            {/* Top employers */}
            <div className="mb-8">
              <h2 className="font-bold text-gray-900 mb-4">Top Employers Hiring in HK</h2>
              <div className="flex flex-wrap gap-2">
                {industry.topEmployers.map(emp => (
                  <span key={emp} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: '#f0f4ff', color: '#3730a3' }}>
                    {emp}
                  </span>
                ))}
              </div>
            </div>

            {/* Salary */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8">
              <div className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">Typical Salary Range in Hong Kong</div>
              <div className="text-2xl font-bold text-green-800">{industry.salaryRange}</div>
              <div className="text-xs text-green-600 mt-1">Based on market data for mid-level roles, 2024–2025</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* CTA */}
            <div className="rounded-2xl p-6 text-center sticky top-20" style={{ background: '#0A1628' }}>
              <div className="text-3xl mb-3">{industry.icon}</div>
              <h3 className="font-bold text-white text-lg mb-2">Use This Template</h3>
              <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
                AI customises it to any job description. Adds missing keywords. Writes your bullets.
              </p>
              <Link
                href="/auth/signup"
                className="block w-full py-3 rounded-xl font-bold text-sm mb-3 transition-colors"
                style={{ background: '#FF6B5B', color: 'white' }}
              >
                Build Free Resume →
              </Link>
              <Link
                href="/ats"
                className="block w-full py-2.5 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: '#334155', color: '#94a3b8' }}
              >
                Check ATS Score First
              </Link>
            </div>

            {/* ATS tip */}
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <div className="font-semibold text-orange-900 text-sm mb-2">💡 ATS Tip for {industry.name}</div>
              <p className="text-xs text-orange-800 leading-relaxed">
                Hong Kong ATS systems often filter for exact keyword matches. Include the job title from the listing verbatim in your summary, and mirror the skills section wording exactly as written in the JD.
              </p>
              <Link href="/ats" className="text-xs font-semibold text-orange-700 mt-3 block hover:text-orange-900">
                Check your ATS score free →
              </Link>
            </div>
          </div>
        </div>

        {/* Related templates */}
        <div className="mt-14 pt-10 border-t border-gray-100">
          <h2 className="font-bold text-gray-900 mb-5">Other Industry Templates</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.slug} href={`/templates/${r.slug}`} className="group bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md p-5 transition-all">
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{r.name}</div>
                <div className="text-xs text-gray-400 mt-1">{r.salaryRange}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16 py-8 px-4 text-center">
        <p className="text-xs text-gray-400">
          CVGlow — AI resume builder for Hong Kong job seekers · <Link href="/ats" className="hover:text-gray-600">Free ATS Checker</Link> · <Link href="/templates" className="hover:text-gray-600">All Templates</Link>
        </p>
      </footer>
    </div>
  )
}
