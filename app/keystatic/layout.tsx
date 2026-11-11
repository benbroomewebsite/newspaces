import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { editorEnabled } from '../../keystatic.config'
import KeystaticApp from './keystatic'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = { metadataBase: siteUrl, title: 'Editor — New Spaces', icons: { icon: '/icon.svg' }, robots: { index: false, follow: false } }

export default function Layout() {
  if (!editorEnabled) notFound()
  return <html lang="en">
    <body><KeystaticApp /></body>
  </html>
}
