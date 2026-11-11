'use client'

import { useEffect } from 'react'
import { session } from '@/lib/session'

// Typeface trial: add ?font=msmincho, ?font=shippori or ?font=arial to any URL.
// The choice is remembered for the rest of the browser session.
const fonts = ['msmincho', 'shippori', 'arial']

export function FontTrial() {
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('font')
    if (requested && fonts.includes(requested)) session.setItem('font-trial', requested)
    const font = session.getItem('font-trial')
    if (font) document.documentElement.dataset.font = font
  }, [])
  return null
}
