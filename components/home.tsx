'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { aboutParagraphs, contact } from '@/lib/bio'
import { mediaHref } from '@/lib/media'
import { coverOf, type Programme, programmeById, programmes, programmeWorks } from '@/lib/programmes'
import { session } from '@/lib/session'
import { siteName, siteTagline } from '@/lib/site'
import type { Work } from '@/lib/works'
import './home.css'

// The New Spaces front page: Ben's typeface, ink and paper set in the Triple
// Phase portfolio's grey page, boxes, cards and rule bands. Two layouts are on
// trial: Boxes (cards across the page) and List (rows with a large preview).
// ?layout=boxes or ?layout=list chooses one; the switch at the foot of the
// screen is for review and goes once one is chosen.

type Layout = 'boxes' | 'list'
const layouts: Layout[] = ['boxes', 'list']

// "Goldsmiths CCA, London" → "Goldsmiths CCA", as on Ben's index.
const venueOnly = (venue: string) => venue.replace(/,\s*[^,]+$/, '')
const plural = (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`

export function Home() {
  const rootRef = useRef<HTMLElement>(null)
  const headRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<string | null>(null)
  const [layout, setLayout] = useState<Layout>('boxes')
  const selected = programmeById(filter)
  const shown = selected ? selected.works : programmeWorks

  // The address takes precedence over the choices remembered for this visit.
  // A saved scroll position belongs to one return trip from a project page.
  useLayoutEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedFilter = params.get('filter') ?? session.getItem('ns-filter')
    const requestedLayout = params.get('layout') ?? session.getItem('ns-layout')
    if (programmeById(requestedFilter)) setFilter(requestedFilter)
    if (layouts.includes(requestedLayout as Layout)) setLayout(requestedLayout as Layout)
    const scroll = session.getItem('ns-scroll')
    session.removeItem('ns-scroll')
    if (scroll) requestAnimationFrame(() => window.scrollTo(0, Number(scroll)))
  }, [])

  // The sticky preview in the list sits just below the header, whatever its height.
  useLayoutEffect(() => {
    const head = headRef.current
    const root = rootRef.current
    if (!head || !root) return
    const observer = new ResizeObserver(() => root.style.setProperty('--ns-head-h', `${head.offsetHeight}px`))
    observer.observe(head)
    return () => observer.disconnect()
  }, [])

  const remember = (key: string, value: string | null) => {
    if (value) session.setItem(key, value)
    else session.removeItem(key)
    const params = new URLSearchParams(window.location.search)
    if (value) params.set(key.replace('ns-', ''), value)
    else params.delete(key.replace('ns-', ''))
    window.history.replaceState(null, '', params.size ? `?${params}` : window.location.pathname)
  }
  const chooseFilter = (id: string | null) => {
    setFilter(id)
    remember('ns-filter', id)
    window.scrollTo(0, 0)
  }
  const chooseLayout = (next: Layout) => {
    setLayout(next)
    remember('ns-layout', next)
  }
  const leaving = () => session.setItem('ns-scroll', String(window.scrollY))

  return <main ref={rootRef} className={`ns ns-home ns-layout-${layout}`} style={{ '--ns-count': programmes.length } as CSSProperties}>
    <h1 className="sr-only">{siteName} — {siteTagline}</h1>
    <header ref={headRef} className="ns-head">
      <Link className="ns-head-name" href="/" onClick={() => chooseFilter(null)}>{siteName}</Link>
      <nav className="ns-head-filters" aria-label="Programmes">
        <button type="button" aria-pressed={!selected} onClick={() => chooseFilter(null)}>All</button>
        {programmes.map((programme) => <button key={programme.id} type="button" aria-pressed={selected === programme} onClick={() => chooseFilter(selected === programme ? null : programme.id)}>
          {programme.name}
        </button>)}
      </nav>
      <nav className="ns-head-links" aria-label="Information"><a href="#about">About</a>, <a href="#contact">Contact</a></nav>
    </header>

    {layout === 'boxes'
      ? <Boxes selected={selected} shown={shown} onFilter={chooseFilter} onLeave={leaving} />
      : <List key={filter ?? 'all'} selected={selected} onFilter={chooseFilter} onLeave={leaving} />}

    <Information />

    <div className="ns-switch" role="group" aria-label="Layout on trial">
      <span>Layout</span>
      {layouts.map((option) => <button key={option} type="button" aria-pressed={layout === option} onClick={() => chooseLayout(option)}>
        {option === 'boxes' ? 'Boxes' : 'List'}
      </button>)}
    </div>
  </main>
}

type ViewProps = { selected?: Programme; onFilter: (id: string | null) => void; onLeave: () => void }

// Boxes: the programmes fill the first screen; every project follows as a card.
function Boxes({ selected, shown, onFilter, onLeave }: ViewProps & { shown: Work[] }) {
  return <>
    {selected
      ? <Intro programme={selected} />
      : <section className="ns-programmes" aria-label="Programmes">
        {programmes.map((programme) => <ProgrammeCard key={programme.id} programme={programme} onFilter={onFilter} onLeave={onLeave} />)}
      </section>}
    <div className="ns-band"><h2>{selected ? selected.name : 'All projects'}</h2><h2>{plural(shown.length)}</h2></div>
    <section className="ns-work" aria-label={selected ? selected.name : 'All projects'}>
      {shown.map((work, index) => <ProjectCard key={work.slug} work={work} eager={Boolean(selected) && index < 3} onLeave={onLeave} />)}
    </section>
  </>
}

function ProgrammeCard({ programme, onFilter, onLeave }: { programme: Programme; onFilter: (id: string) => void; onLeave: () => void }) {
  return <Link className="ns-card ns-card-programme" href={programme.href ?? `/?filter=${programme.id}`} onClick={(event) => {
    if (programme.href) return onLeave()
    event.preventDefault()
    onFilter(programme.id)
  }}>
    <span className="ns-card-meta"><span>{programme.years}</span><span>{plural(programme.works.length)}</span></span>
    <span className="ns-card-title">{programme.name}</span>
    <span className="ns-card-media">
      {programme.cover && <Image src={mediaHref(programme.cover)} alt="" fill sizes="(max-width: 640px) 100vw, 25vw" loading="eager" />}
    </span>
    {programme.text && <span className="ns-card-foot">{programme.text}</span>}
  </Link>
}

function ProjectCard({ work, eager, onLeave }: { work: Work; eager: boolean; onLeave: () => void }) {
  const cover = coverOf(work)
  return <Link className="ns-card" href={`/work/${work.slug}`} onClick={onLeave}>
    <span className="ns-card-meta"><span>{work.date}</span><span>{work.programme}</span></span>
    <span className="ns-card-title">{work.indexTitle}</span>
    <span className="ns-card-media">
      {cover && <Image src={mediaHref(cover)} alt="" fill sizes="(max-width: 640px) 100vw, 33vw" loading={eager ? 'eager' : 'lazy'} />}
    </span>
    <span className="ns-card-foot">{venueOnly(work.publication)}</span>
  </Link>
}

// A chosen programme: its name and text as one bold paragraph, as on the Triple Phase project pages.
function Intro({ programme }: { programme: Programme }) {
  return <p className="ns-intro">
    <strong>{programme.name}</strong> ({programme.years}, {plural(programme.works.length)}).{programme.text && ` ${programme.text}`}
  </p>
}

// List: programmes as headings over rows divided by rules. Pointing at a row
// shows its images and text in the large panel beside the list, which keeps
// the rows still; opening images inside the list would push the rows below
// out from under the pointer.
function List({ selected, onFilter, onLeave }: ViewProps) {
  const [active, setActive] = useState<Work | null>(null)
  const groups = selected ? [selected] : programmes
  const preview = (work: Work) => {
    if (window.matchMedia('(hover: hover) and (min-width: 801px)').matches) setActive(work)
  }

  return <div className="ns-list">
    <div className="ns-list-rows">
      {selected && <Intro programme={selected} />}
      {groups.map((programme) => <section key={programme.id} className="ns-list-group" aria-label={programme.name}>
        <h2 className="ns-list-heading">
          <button type="button" onClick={() => onFilter(selected ? null : programme.id)}>{programme.name}</button>
          <span>{programme.years}</span>
          <span>{plural(programme.works.length)}</span>
        </h2>
        {programme.cover && <span className="ns-list-cover"><Image src={mediaHref(programme.cover)} alt="" fill sizes="100vw" /></span>}
        <ul>
          {programme.works.map((work) => <li key={work.slug}>
            <Link className="ns-row" href={`/work/${work.slug}`} data-active={active === work || undefined} onClick={onLeave}
              onMouseEnter={() => preview(work)} onFocus={() => preview(work)}>
              <span>{work.indexTitle}</span>
              <span>{venueOnly(work.publication)}</span>
              <span>{work.date}</span>
            </Link>
          </li>)}
        </ul>
      </section>)}
    </div>
    <aside className="ns-preview" aria-live="polite">
      {active ? <Preview key={active.slug} work={active} /> : <Idle groups={groups} />}
    </aside>
  </div>
}

// A heading line such as "The Judging Panel:" is joined to the paragraph it introduces.
function excerpt(description: string) {
  const [first = '', second] = description.split(/\n\n+/).map((paragraph) => paragraph.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const text = first.length < 40 && second ? `${first.replace(/[:;]?$/, ':')} ${second}` : first
  return text.length > 280 ? `${text.slice(0, 280).replace(/\s+\S*$/, '')}…` : text
}

function Preview({ work }: { work: Work }) {
  const cover = coverOf(work)
  const sources = [...new Set([cover, ...work.images.map((image) => image.src)].filter(Boolean))].slice(0, 4) as string[]
  const text = excerpt(work.description)
  return <article className="ns-preview-work">
    <div className={`ns-preview-images${sources.length > 1 ? ' has-strip' : ''}`}>
      {sources.map((src, index) => <span key={src}>
        <Image src={mediaHref(src)} alt="" fill sizes={index ? '15vw' : '50vw'} loading="eager" />
      </span>)}
    </div>
    <div className="ns-preview-text">
      <h2>{work.title}</h2>
      <p>{[work.programme, work.publication, work.date].filter(Boolean).join(' · ')}</p>
      {text && <p className="ns-preview-excerpt">{text}</p>}
    </div>
  </article>
}

// Before anything is pointed at: the programmes' own images.
function Idle({ groups }: { groups: Programme[] }) {
  return <div className={`ns-preview-idle ns-preview-idle-${groups.length}`}>
    {groups.map((programme) => <figure key={programme.id}>
      {programme.cover && <Image src={mediaHref(programme.cover)} alt="" fill sizes="25vw" loading="eager" />}
      <figcaption>{programme.name}</figcaption>
    </figure>)}
  </div>
}

// About, mission, trustees and contact, in rule bands on the same page.
// Mission and trustees await approved wording.
function Information() {
  return <section className="ns-info" aria-label="Information">
    <div className="ns-band" id="about"><h2>About</h2><h2>Mission</h2></div>
    <div className="ns-cols">
      <div>{aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <p className="ns-pending">To be confirmed.</p>
    </div>
    <div className="ns-band" id="trustees"><h2>Trustees</h2></div>
    <div className="ns-cols"><p className="ns-pending">To be confirmed.</p></div>
    <div className="ns-band" id="contact"><h2>Contact</h2></div>
    <p className="ns-flow">
      {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : <span className="ns-pending">Contact details to be confirmed.</span>}
      {contact.instagram && <> <a href={contact.instagram} target="_blank" rel="noreferrer">↳ Instagram</a></>}
    </p>
  </section>
}
