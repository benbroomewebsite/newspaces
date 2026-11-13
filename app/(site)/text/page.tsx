import type { Metadata } from 'next'
import { TextHome } from '@/components/home'

// The text-first front page, kept beside the slideshow at / while the two are
// compared. Remove whichever is not chosen.
export const metadata: Metadata = { title: 'Front page, text first', robots: { index: false, follow: false } }

export default function TextPage() {
  return <TextHome />
}
