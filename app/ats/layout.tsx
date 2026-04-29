import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free ATS Resume Checker — Hong Kong | CVGlow',
  description: 'Paste your resume and a job description to instantly see your ATS score, missing keywords, and how to fix it. Free, no signup needed. Built for Hong Kong job seekers.',
  keywords: 'ATS checker Hong Kong, resume ATS score, ATS resume test, keyword gap analysis, 香港履歷 ATS',
  openGraph: {
    title: 'Free ATS Resume Checker — Hong Kong',
    description: 'Instant ATS score. See exactly which keywords you\'re missing before you apply. 100% free.',
    url: 'https://cvglow-web.vercel.app/ats',
  },
}

export default function ATSLayout({ children }: { children: React.ReactNode }) {
  return children
}
