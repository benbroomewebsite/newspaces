'use client'

import { useLayoutEffect } from 'react'
import { session } from '@/lib/session'

// Returning from a project page puts the reader back where they left the front
// page. The position is kept for that one return trip only.
export function ReturnPosition() {
  useLayoutEffect(() => {
    const saved = session.getItem('ns-scroll')
    session.removeItem('ns-scroll')
    // After the router's own scroll to the top of the new page.
    const frame = saved ? requestAnimationFrame(() => window.scrollTo(0, Number(saved))) : 0
    const remember = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('a[href^="/work/"]')) session.setItem('ns-scroll', String(window.scrollY))
    }
    document.addEventListener('click', remember)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('click', remember)
    }
  }, [])
  return null
}
