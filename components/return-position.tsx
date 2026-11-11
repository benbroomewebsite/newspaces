'use client'

import { useLayoutEffect } from 'react'
import { session } from '@/lib/session'

// Returning to a page from one of its projects puts the reader back where they
// left it. Each page keeps its own position, for that one return trip only.
export function ReturnPosition() {
  useLayoutEffect(() => {
    const key = `ns-scroll:${window.location.pathname}`
    const saved = session.getItem(key)
    session.removeItem(key)
    // After the router's own scroll to the top of the new page.
    const frame = saved ? requestAnimationFrame(() => window.scrollTo(0, Number(saved))) : 0
    const remember = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href^="/work/"], a[href^="/programmes/"]')) session.setItem(key, String(window.scrollY))
    }
    document.addEventListener('click', remember)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', remember)
    }
  }, [])
  return null
}
