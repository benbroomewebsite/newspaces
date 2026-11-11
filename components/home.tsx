import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { contact } from '@/lib/bio'
import { mediaHref } from '@/lib/media'
import { coverOf, type Programme, programmes } from '@/lib/programmes'
import { siteName, siteTagline } from '@/lib/site'
import type { Work } from '@/lib/works'
import { ReturnPosition } from '@/components/return-position'
import './home.css'

// The New Spaces front page, built on Daniel's Triple Phase portfolio
// (triple-phase.com/portfolio): name box and notch, a description box beneath,
// image cards 1px apart and rule bands for the information, set in Ben's font.
// The programmes lead; programmes of several projects follow as sections.

// Placeholder copy until New Spaces supplies its own description, mission and trustees.
const placeholder = {
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  mission: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
}

const venueOnly = (venue: string) => venue.replace(/,\s*[^,]+$/, '')
const sections = programmes.filter((programme) => programme.works.length > 1)

export function Home() {
  return <main className="ns ns-home" style={{ '--ns-count': programmes.length } as CSSProperties}>
    <ReturnPosition />
    <h1 className="sr-only">{siteName} — {siteTagline}</h1>
    <Header />

    <section className="ns-programmes" aria-label="Programmes">
      {programmes.map((programme, index) => <ProgrammeCard key={programme.id} programme={programme} eager={index < 4} />)}
    </section>

    {sections.map((programme) => <section key={programme.id} id={programme.id} className="ns-section" aria-label={programme.name}>
      <div className="ns-band"><h2>{programme.name}</h2><h2>{programme.years}</h2></div>
      <div className="ns-work">
        {programme.works.map((work) => <ProjectCard key={work.slug} work={work} />)}
      </div>
    </section>)}

    <Information />
  </main>
}

// Name box and section box joined by a notch; the description and contact boxes hang beneath.
function Header() {
  return <>
    <header className="ns-head">
      <Link className="ns-head-name" href="/">{siteName}</Link>
      <nav className="ns-head-nav" aria-label="Sections"><a href="#about">About</a>, <a href="#contact">Contact</a></nav>
    </header>
    <div className="ns-hooder">
      <p className="ns-hooder-text">{placeholder.description}</p>
      <div className="ns-hooder-info">
        <p>
          {siteTagline}<br /><br />
          {contact.instagram ? <a href={contact.instagram} target="_blank" rel="noreferrer">Instagram</a> : 'Instagram'}
        </p>
        <p>
          Contact:<br />
          {contact.email ? <a href={`mailto:${contact.email}`}>{contact.email}</a> : 'To be confirmed'}
        </p>
      </div>
    </div>
  </>
}

// A programme of one project opens it; a programme of several jumps to its section.
function ProgrammeCard({ programme, eager }: { programme: Programme; eager: boolean }) {
  const venues = [...new Set(programme.works.map((work) => venueOnly(work.publication)))].join(', ')
  const card = <>
    <span className="ns-card-meta"><span>{programme.years}</span></span>
    <h2 className="ns-card-title">{programme.name}</h2>
    <span className="ns-card-media ns-card-media-tall">
      {programme.cover && <Image src={mediaHref(programme.cover)} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" loading={eager ? 'eager' : 'lazy'} />}
    </span>
    <span className="ns-card-tags">{programme.text || venues}</span>
  </>
  return programme.href
    ? <Link className="ns-card" href={programme.href}>{card}</Link>
    : <a className="ns-card" href={`#${programme.id}`}>{card}</a>
}

function ProjectCard({ work }: { work: Work }) {
  const cover = coverOf(work)
  return <Link className="ns-card" href={`/work/${work.slug}`}>
    <span className="ns-card-meta"><span>{work.date}</span><span>{work.type}</span></span>
    <h3 className="ns-card-title">{work.indexTitle}</h3>
    <span className="ns-card-media">
      {cover && <Image src={mediaHref(cover)} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />}
    </span>
    <span className="ns-card-tags">{venueOnly(work.publication)}</span>
  </Link>
}

// Rule bands: About and Mission in two columns, Trustees, then Contact as flowing text.
function Information() {
  const channels = [
    contact.email && { name: 'email', label: contact.email, href: `mailto:${contact.email}` },
    contact.instagram && { name: 'Instagram', label: 'Instagram', href: contact.instagram },
  ].filter(Boolean) as { name: string; label: string; href: string }[]

  return <section className="ns-info" aria-label="Information">
    <div className="ns-band" id="about"><h2>{siteName}</h2><h2>About</h2></div>
    <div className="ns-cols">
      <p>{siteName}<br />{siteTagline}</p>
      <p>{placeholder.about}</p>
    </div>
    <div className="ns-band"><h2>Mission</h2><h2>Trustees</h2></div>
    <div className="ns-cols">
      <p>{placeholder.mission}</p>
      <p>To be confirmed.</p>
    </div>
    <div className="ns-band" id="contact"><h2>Contact</h2></div>
    {channels.length
      ? <>
        <p className="ns-flow">
          Get in touch through{' '}
          {channels.map((channel, index) => <span key={channel.name}><sup>{index + 1}</sup>{channel.name}{index < channels.length - 1 ? ' or ' : '.'}</span>)}
        </p>
        <ul className="ns-pills">
          {channels.map((channel) => <li key={channel.name}><a className="ns-pill" href={channel.href} {...(channel.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{channel.label}</a></li>)}
        </ul>
      </>
      : <p className="ns-flow">Contact details to follow.</p>}
  </section>
}
