'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type MouseEvent, type SyntheticEvent, useEffect, useRef, useState } from 'react'

export type Picture = { src: string; alt: string; label: string; href: string }
export type ListEntry = { id: string; name: string; years: string; href: string; text: string; more: string[]; images: Picture[] }

const loaded = (event: SyntheticEvent<HTMLImageElement>) => { event.currentTarget.dataset.loaded = '' }
/** How long the first photographs may take before the rest are shown regardless. */
const PATIENCE = 2500

// The programmes as a list between rules: name and years on the left, a
// photograph, then the description further across. Everything is there from
// the start; the photographs show blurred once all have loaded and come into
// focus together. A row opens in place: the rest of the description and three
// more photographs (to the page's right edge, each from a different project
// or artist) appear at once, the photographs briefly blurred, and an outlined
// button under the name, its name, opens the programme, or, while a photograph is
// pointed at, the project it shows (as does clicking the photograph itself).
// About three rows fill the first screen.
export function ProgrammeList({ entries }: { entries: ListEntry[] }) {
  const [open, setOpen] = useState<string[]>([])
  const [pointed, setPointed] = useState<Record<string, Picture | undefined>>({})
  const [ready, setReady] = useState(false)
  const list = useRef<HTMLElement>(null)
  const thumbs = useRef(0)
  const router = useRouter()
  const toggle = (id: string) => setOpen((all) => (all.includes(id) ? all.filter((each) => each !== id) : [...all, id]))
  const total = entries.filter((entry) => entry.images.length).length

  // How far down the page the list starts, so the rows can share the rest of the screen.
  useEffect(() => {
    const element = list.current
    if (!element) return
    const measure = () => element.style.setProperty('--ns-above', `${element.getBoundingClientRect().top + window.scrollY}px`)
    measure()
    window.addEventListener('resize', measure)
    const timer = window.setTimeout(() => setReady(true), PATIENCE)
    return () => { window.removeEventListener('resize', measure); window.clearTimeout(timer) }
  }, [])

  const thumbLoaded = (event: SyntheticEvent<HTMLImageElement>) => {
    loaded(event)
    thumbs.current += 1
    if (thumbs.current >= total) setReady(true)
  }

  return <section ref={list} className="ns-list" aria-label="Programmes" data-ready={ready || undefined}>
    {entries.map((entry, n) => {
      const shown = open.includes(entry.id)
      const [thumb, ...more] = entry.images
      const panel = `ns-row-${entry.id}`
      const target = pointed[entry.id]
      const point = (picture?: Picture) => setPointed((all) => ({ ...all, [entry.id]: picture?.label ? picture : undefined }))
      const pointing = (picture: Picture) => ({ onPointerEnter: () => point(picture), onPointerLeave: () => point(), onFocus: () => point(picture), onBlur: () => point() })
      return <article key={entry.id} className="ns-row" data-open={shown || undefined} onClick={(event) => {
        if ((event.target as HTMLElement).closest('a, button')) return
        if (window.getSelection()?.toString()) return
        toggle(entry.id)
      }}>
        <div className="ns-row-head">
          <h2><button type="button" aria-expanded={shown} aria-controls={panel} onClick={() => toggle(entry.id)}>{entry.name}</button></h2>
          <p className="ns-row-years">{entry.years}</p>
          <div className="ns-row-more" aria-hidden={!shown}>
            <Link className="ns-button ns-row-go" href={target?.href ?? entry.href} tabIndex={shown ? undefined : -1}>{target?.label ?? entry.name} →</Link>
          </div>
        </div>
        {/* Closed, the photograph opens the row; open, it opens the project it shows. */}
        <span className="ns-row-thumb" {...(thumb && shown ? { ...pointing(thumb), 'data-link': '', onClick: (event: MouseEvent) => { event.stopPropagation(); router.push(thumb.href) } } : {})}>
          {thumb && <Image src={thumb.src} alt="" fill sizes="(max-width: 640px) 34vw, 30vw" loading={n < 5 ? 'eager' : 'lazy'} onLoad={thumbLoaded} />}
        </span>
        <div className="ns-row-text">
          <p className="ns-row-lead">{entry.text}</p>
          <div className="ns-row-more" aria-hidden={!shown}>
            {entry.more.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className="ns-row-more ns-row-panel" id={panel} aria-hidden={!shown}>
          {more.length > 0 && <div className="ns-row-images">
            {more.slice(0, 3).map((picture) => <Link key={picture.src} href={picture.href} tabIndex={shown ? undefined : -1} {...pointing(picture)}>
              <Image src={picture.src} alt={picture.label ? `${picture.alt} (${picture.label})` : picture.alt} fill sizes="(max-width: 640px) 33vw, 25vw" loading="eager" onLoad={loaded} />
            </Link>)}
          </div>}
        </div>
      </article>
    })}
  </section>
}

