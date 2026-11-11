import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { contact } from '@/lib/bio'
import { mediaHref } from '@/lib/media'
import { placeholder } from '@/lib/placeholder'
import { coverOf, excerpt, type Programme, programmes } from '@/lib/programmes'
import { siteName, siteTagline } from '@/lib/site'
import type { Work } from '@/lib/works'
import { ReturnPosition } from '@/components/return-position'
import './home.css'

// The New Spaces front page, built on Daniel's Triple Phase portfolio
// (triple-phase.com/portfolio): name box and notch, a description box beneath,
// white boxes on Ben's paper and rule bands for the information, set in Ben's
// font. The programmes show as wide boxes with their text and images (/), or
// as image cards (/cards), while the two are compared.

const venueOnly = (venue: string) => venue.replace(/,\s*[^,]+$/, '')

export function Home({ layout = 'rows' }: { layout?: 'rows' | 'cards' }) {
  return <main className="ns ns-home" style={{ '--ns-count': programmes.length } as CSSProperties}>
    <ReturnPosition />
    <h1 className="sr-only">{siteName} — {siteTagline}</h1>
    <Header />
    <Description />

    {layout === 'rows'
      ? <section className="ns-rows" aria-label="Programmes">
        {programmes.map((programme, index) => <ProgrammeRow key={programme.id} programme={programme} eager={index < 2} />)}
      </section>
      : <section className="ns-programmes" aria-label="Programmes">
        {programmes.map((programme) => <ProgrammeCard key={programme.id} programme={programme} />)}
      </section>}

    <Information />
  </main>
}

// Name box and section box joined by a notch.
export function Header() {
  return <header className="ns-head">
    <Link className="ns-head-name" href="/">{siteName}</Link>
    <nav className="ns-head-nav" aria-label="Sections"><a href="/#about">About</a>, <a href="/#contact">Contact</a></nav>
  </header>
}

// The description and contact boxes that hang beneath the header.
function Description() {
  return <div className="ns-hooder">
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
}

// A programme as one wide white box: its name, text and a link on the left,
// three images to the right at one height, the last running off the edge
// (they scroll sideways, without a visible bar). A single project shows its
// own images; a programme of several shows one image from each of its latest
// projects, linking to it. The name goes to the programme's page.
const PREVIEW_IMAGES = 3
type PreviewImage = { src: string; alt: string; width: number; height: number; href?: string }

function ProgrammeRow({ programme, eager }: { programme: Programme; eager: boolean }) {
  const single = programme.works.length === 1 ? programme.works[0] : undefined
  const sized = (work: Work, src: string): PreviewImage => {
    const image = work.images.find((candidate) => candidate.src === src)
    return { src: mediaHref(src), alt: image?.alt || work.title, width: image?.width || 1500, height: image?.height || 1000 }
  }
  const images: PreviewImage[] = single
    ? single.images.slice(0, PREVIEW_IMAGES).map((image) => sized(single, image.src))
    : programme.works.slice(0, PREVIEW_IMAGES).flatMap((work) => {
      const cover = coverOf(work)
      return cover ? [{ ...sized(work, cover), href: `/work/${work.slug}` }] : []
    })
  const text = (single && excerpt(single.description)) || programme.text || placeholder.programme

  return <article className="ns-row" aria-labelledby={`${programme.id}-name`}>
    <div className="ns-row-text">
      <h2 id={`${programme.id}-name`}><Link className="ns-row-title" href={programme.href}>{programme.name}</Link></h2>
      <p>{text}</p>
      <Link href={programme.href}>↳ Go to {programme.name}</Link>
    </div>
    <div className="ns-row-strip" role="group" aria-label={`${programme.name} images`} tabIndex={0}>
      {images.map((image) => {
        const picture = <Image src={image.src} alt={image.alt} width={image.width} height={image.height} loading={eager ? 'eager' : 'lazy'} />
        return image.href
          ? <Link key={image.src} className="ns-row-image" href={image.href}>{picture}</Link>
          : <figure key={image.src} className="ns-row-image">{picture}</figure>
      })}
    </div>
  </article>
}

function ProgrammeCard({ programme }: { programme: Programme }) {
  const venues = [...new Set(programme.works.map((work) => venueOnly(work.publication)))].join(', ')
  return <Link className="ns-card" href={programme.href}>
    <span className="ns-card-meta"><span>{programme.years}</span></span>
    <h2 className="ns-card-title">{programme.name}</h2>
    <span className="ns-card-media ns-card-media-tall">
      {programme.cover && <Image src={mediaHref(programme.cover)} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" loading="eager" />}
    </span>
    <span className="ns-card-tags">{programme.text || venues}</span>
  </Link>
}

export function ProjectCard({ work }: { work: Work }) {
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

// The description and contact, in rule bands at the foot of the page.
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
