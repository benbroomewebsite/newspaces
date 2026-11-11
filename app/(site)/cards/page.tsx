import type { Metadata } from 'next'
import { Home } from '@/components/home'

// The image-card front page, kept beside the row layout at / while the two
// are compared. Remove whichever is not chosen.
export const metadata: Metadata = { title: 'Front page with cards', robots: { index: false, follow: false } }

export default function CardsPage() {
  return <Home layout="cards" />
}
