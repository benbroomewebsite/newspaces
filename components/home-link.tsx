'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { session } from '@/lib/session'

// The site name: always the front page from the top, never a remembered
// position (that is what "Back to index" is for). On the front page itself it
// scrolls to the top and clears any #section from the address. `current`
// marks it as the section being shown (Work in the header).
export function HomeLink({ className, current, children }: { className?: string; current?: boolean; children: ReactNode }) {
  return <Link className={className} href="/" aria-current={current ? 'page' : undefined} onClick={(event) => {
    session.removeItem('ns-scroll:/')
    if (window.location.pathname !== '/') return
    event.preventDefault()
    if (window.location.hash || window.location.search) window.history.replaceState(null, '', '/')
    window.scrollTo(0, 0)
  }}>{children}</Link>
}
