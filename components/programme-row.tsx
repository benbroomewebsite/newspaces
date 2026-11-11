'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'
import { session } from '@/lib/session'

export type RowImage = { src: string; alt: string; width: number; height: number; caption?: string; href?: string }
export type RowProps = { id: string; name: string; href: string; short: string; preview: string; images: RowImage[] }

// Which rows are open is kept for the visit, so returning from a project page
// finds the front page as it was left.
const OPEN = 'ns-open'
const openRows = (): string[] => {
  try {
    return JSON.parse(session.getItem(OPEN) ?? '[]')
  } catch {
    return []
  }
}

// A programme as one thin white box across the page: its name and a line about
// it. The first press of the name opens a preview (the text on the left, images
// to the right); pressing the name again, or the link under the text, goes to
// its page. Without scripts the name is an ordinary link.
export function ProgrammeRow({ id, name, href, short, preview, images }: RowProps) {
  const [open, setOpen] = useState(false)
  // The preview's images load the first time it opens, then stay.
  const [shown, setShown] = useState(false)
  // A preview restored on return appears at once, without the opening motion.
  const [instant, setInstant] = useState(false)
  const body = `${id}-preview`

  useLayoutEffect(() => {
    if (!openRows().includes(id)) return
    setOpen(true)
    setShown(true)
    setInstant(true)
  }, [id])

  const toggle = (next: boolean) => {
    setOpen(next)
    setInstant(false)
    if (next) setShown(true)
    const others = openRows().filter((row) => row !== id)
    session.setItem(OPEN, JSON.stringify(next ? [...others, id] : others))
  }

  return <article className={`ns-row${open ? ' is-open' : ''}`} data-instant={instant || undefined}>
    <div className="ns-row-bar" onClick={() => !open && toggle(true)}>
      <Link className="ns-row-title" href={href} aria-expanded={open} aria-controls={body} onClick={(event) => {
        if (open) return
        event.preventDefault()
        event.stopPropagation()
        toggle(true)
      }}>{name}</Link>
      <p className="ns-row-short">{short}</p>
      <button type="button" className="ns-row-toggle" aria-expanded={open} aria-controls={body} aria-label={`${open ? 'Close' : 'Open'} ${name}`} onClick={(event) => {
        event.stopPropagation()
        toggle(!open)
      }}>{open ? '−' : '+'}</button>
    </div>
    <div id={body} className="ns-row-body" inert={!open}>
      <div className="ns-row-inner">
        {shown && <>
          <div className="ns-row-text">
            <p>{preview}</p>
            <Link href={href}>↳ Go to {name}</Link>
          </div>
          <div className="ns-row-strip">
            {images.map((image, index) => {
              const picture = <Image src={image.src} alt={image.alt} width={image.width} height={image.height} loading={index < 4 ? 'eager' : 'lazy'} />
              return image.href
                ? <Link key={image.src} className="ns-row-image" href={image.href}>{picture}{image.caption && <span>{image.caption}</span>}</Link>
                : <figure key={image.src} className="ns-row-image">{picture}</figure>
            })}
          </div>
        </>}
      </div>
    </div>
  </article>
}
