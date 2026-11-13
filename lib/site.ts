// Search engines and sharing metadata use the public domain, including on previews.
export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
export const siteIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === 'true'
export const siteName = 'New Spaces'
export const siteTagline = 'Art in Underused Space'
export const siteDescription = 'Exhibitions, performances, talks and artist grants by New Spaces, presenting art in underused space.'
export const absoluteUrl = (path: string) => new URL(path, siteUrl).toString()
export const mediaBaseUrl = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '').replace(/\/$/, '')

// The typeface for the whole site. 'msmincho' is Ben's; 'shippori' and 'arial'
// are the other trials (see app/globals.css and components/font-trial.tsx).
export type SiteFont = 'helvetica' | 'msmincho' | 'shippori' | 'arial'
export const siteFont: SiteFont = 'helvetica'

// Header trials (components/home.tsx, home.css). notch: the white tab over the
// gap between the name and the sections, from Daniel's portfolio. fullWidth:
// the sections box runs to the right margin; otherwise it ends just after
// "Contact", with the same white at its right as at its left.
export const headerStyle = { notch: false, fullWidth: false }
