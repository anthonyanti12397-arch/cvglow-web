import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/resume/', '/tracker/', '/auth/'],
    },
    sitemap: 'https://cvglow-web.vercel.app/sitemap.xml',
  }
}
