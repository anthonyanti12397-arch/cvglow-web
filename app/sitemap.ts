import { MetadataRoute } from 'next'
import { INDUSTRIES } from '@/lib/industries'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cvglow-web.vercel.app'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/ats`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/templates`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/interview`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/auth/signup`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${base}/auth/login`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map(industry => ({
    url: `${base}/templates/${industry.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...industryPages]
}
