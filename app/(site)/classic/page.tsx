import type { Metadata } from 'next'
import { Portfolio } from '@/components/portfolio'

// Ben's original list index, kept for comparison while the new front page is
// reviewed. Remove it, with components/portfolio.tsx, once a layout is chosen.
export const metadata: Metadata = { title: 'Classic index', robots: { index: false, follow: false } }

export default function ClassicPage() {
  return <Portfolio />
}
