// Search engines and sharing metadata use the public domain, including on previews.
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
export const siteIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true'
export const siteName = 'New Spaces'
export const siteTagline = 'Art in Underused Space'
export const siteDescription = 'Exhibitions, performances, talks and artist grants by New Spaces, presenting art in underused space.'
export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString()
export const mediaBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(/\/$/, '')
