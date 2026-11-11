import { siteName, siteTagline } from '@/lib/site'
import { HomeLink } from '@/components/home-link'

export function Identity({ className = '', tagline = true }: { className?: string; tagline?: boolean }) {
  return <header className={`identity ${className}`.trim()}>
    <HomeLink><strong>{siteName}</strong></HomeLink>
    {tagline && <p>: {siteTagline}</p>}
  </header>
}
