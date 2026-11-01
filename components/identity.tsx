import Link from 'next/link'
import { siteName, siteTagline } from '@/lib/site'

export function Identity({ className = '', tagline = true }: { className?: string; tagline?: boolean }) {
  return <header className={`identity ${className}`.trim()}>
    <Link href="/"><strong>{siteName}</strong></Link>
    {tagline && <p>: {siteTagline}</p>}
  </header>
}
