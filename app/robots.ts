import type { MetadataRoute } from 'next'
import { absoluteUrl, siteIndexable, siteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  if (!siteIndexable) return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/keystatic', '/api/'] }, sitemap: absoluteUrl('/sitemap.xml'), host: siteUrl.origin }
}
