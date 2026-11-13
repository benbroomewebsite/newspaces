import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { FontTrial } from '@/components/font-trial'
import { siteDescription, siteFont, siteIndexable, siteName, siteUrl } from '@/lib/site'
import { contact } from '@/lib/bio'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: siteUrl,
  robots: { index: siteIndexable, follow: siteIndexable },
  title: { default: 'New Spaces', template: '%s — New Spaces' },
  description: siteDescription,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName, title: 'New Spaces — Art in Underused Space', description: siteDescription, images: ['/opengraph-image'] },
  twitter: { card: 'summary_large_image', title: 'New Spaces — Art in Underused Space', description: siteDescription, images: ['/opengraph-image'] },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png?v=white',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png?v=white',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg?v=white',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png?v=white',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = { '@context': 'https://schema.org', '@type': 'Organization', name: siteName, url: siteUrl.toString(), email: contact.email || undefined, sameAs: contact.instagram ? [contact.instagram] : undefined }
  return (
    <html lang="en" data-font={siteFont}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }} />
        <FontTrial />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
