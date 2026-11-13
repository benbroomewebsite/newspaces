import Image from 'next/image'
import Link from 'next/link'
import { contact } from '@/lib/bio'
import { mediaHref } from '@/lib/media'
import { placeholder } from '@/lib/placeholder'
import { coverOf, type Programme, programmes } from '@/lib/programmes'
import { headerStyle, siteName, siteTagline } from '@/lib/site'
import type { Work } from '@/lib/works'
import { HomeLink } from '@/components/home-link'
import { ProgrammeList } from '@/components/programme-list'
import { ReturnPosition } from '@/components/return-position'
import { type Pool, type Slide, Slideshow } from '@/components/slideshow'
import './home.css'

// The New Spaces front page, built on Daniel's Triple Phase portfolio
// (triple-phase.com/portfolio): name box and notch with the description box
// beneath, over a slideshow of photographs from the programmes that fills the
// first screen; about, trustees and contact follow in rule bands. The projects
// are reached through the slideshow's buttons rather than laid out here.

const venueOnly = (venue: string) => venue.replace(/,\s*[^,]+$/, '')

export function Home() {
  return <main className="ns ns-home">
    <ReturnPosition />
    <h1 className="sr-only">{siteName} — {siteTagline}</h1>
    <Header />
    <p className="ns-hooder-text">{placeholder.description}</p>
    <Photographs />
    <Information />
  </main>
}

// The text-first front page (/text), after Ben's note that the words matter
// more than the pictures: no white boxes, a plain header as on Ben's
// portfolio, the description beneath the name at the header's size, then the
// programmes as a list between rules, each row opening in place (see
// ProgrammeList), all within the first screen.
export function TextHome() {
  return <main className="ns ns-text">
    <ReturnPosition />
    <h1 className="sr-only">{siteName} — {siteTagline}</h1>
    <header className="ns-plain-head">
      <HomeLink className="ns-plain-name">{siteName}</HomeLink>
      <nav aria-label="Sections"><HomeLink current>Work</HomeLink>, <a href="#about">About</a>, <a href="#trustees">Trustees</a>, <a href="#contact">Contact</a></nav>
    </header>
    <p className="ns-lede">{placeholder.description}</p>
    <ProgrammeList entries={programmes.map((programme) => ({
      id: programme.id, name: programme.name, years: programme.years, href: programme.href,
      text: programme.text || placeholder.programme, more: moreOf(programme), images: picturesOf(programme),
    }))} />
    <Information />
  </main>
}

// Four photographs for a programme's row (one small, three when it opens),
// each from a different project, or for a single project from a different
// artist where its photographs say whose work they show (Rooms of
// Neighbours). Its chosen photographs come first, then the projects' covers,
// then landscape photographs, then any. Each is labelled with the project or
// artist it shows, and opens that project.
function picturesOf(programme: Programme) {
  const single = programme.works.length === 1
  const all = programme.works.flatMap((work) => work.images.map((image) => ({ work, image, key: single ? image.group || image.src : work.slug })))
  const covers = new Set(programme.works.map(coverOf))
  const order = (entry: (typeof all)[number]) => {
    const chosen = programme.photographs.indexOf(entry.image.src)
    if (chosen >= 0) return chosen
    if (covers.has(entry.image.src)) return 100
    return (entry.image.width || 0) > (entry.image.height || 0) ? 200 : 300
  }
  const seen = new Set<string>()
  return [...all].sort((a, b) => order(a) - order(b)).filter(({ key }) => !seen.has(key) && seen.add(key)).slice(0, 4)
    .map(({ work, image }) => ({
      src: mediaHref(image.src), alt: image.alt || work.title,
      label: single ? image.group || '' : work.indexTitle, href: `/work/${work.slug}`,
    }))
}

// The rest of a programme's description, shown when its row opens: for a
// single project, its own description after the sentence already shown;
// otherwise placeholder copy until New Spaces writes one.
function moreOf(programme: Programme) {
  const own = programme.works.length === 1 ? programme.works[0].description.trim() : ''
  const rest = own.startsWith(programme.text) ? own.slice(programme.text.length).trim() : ''
  return rest ? rest.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) : [placeholder.about]
}

// Name box and section box (joined by a notch, if headerStyle.notch). Work,
// the projects, is the current section wherever this header appears; the
// others stay grey until pointed at, as on Daniel's portfolio.
export function Header() {
  return <header className="ns-head" data-notch={headerStyle.notch || undefined} data-full={headerStyle.fullWidth || undefined}>
    <HomeLink className="ns-head-name">{siteName}</HomeLink>
    <nav className="ns-head-nav" aria-label="Sections">
      <HomeLink current>Work</HomeLink>, <a href="/#about">About</a>, <a href="/#trustees">Trustees</a>, <a href="/#contact">Contact</a>
    </nav>
  </header>
}

// The opening slideshow shows one photograph per programme in turn, and each
// programme offers several to take turns with (see Slideshow): its chosen
// photographs where lib/programmes.ts names them; otherwise, for a programme
// of several projects, one from each project (its cover, or its first large
// landscape one); for a single project, just its cover. Only photographs at
// least 2000px wide and wider than tall join, so they fill the screen sharply
// (Artist Membership's are all upright, so it keeps its cover).
const LARGE = 2000

function Photographs() {
  const large = (image: Work['images'][number]) => (image.width || 0) > (image.height || 0) && (image.width || 0) >= LARGE
  const slide = (work: Work, image: Work['images'][number], programme: string): Slide =>
    ({ src: mediaHref(image.src), alt: image.alt || work.title, title: work.indexTitle, href: `/work/${work.slug}`, programme })

  const pools: Pool[] = programmes.map((programme) => {
    const cover = (work: Work) => work.images.find((image) => image.src === coverOf(work))
    let pool: Slide[]
    if (programme.photographs.length) {
      pool = programme.photographs.flatMap((src) => programme.works.flatMap((work) =>
        work.images.filter((image) => image.src === src).map((image) => slide(work, image, programme.name))))
    } else if (programme.works.length === 1) {
      const work = programme.works[0]
      const image = cover(work) ?? work.images[0]
      pool = image ? [slide(work, image, programme.name)] : []
    } else {
      pool = programme.works.flatMap((work) => {
        const own = cover(work)
        const hero = own && large(own) ? own : work.images.find(large)
        return hero ? [slide(work, hero, programme.name)] : []
      })
    }
    return { name: programme.name, href: programme.href, pool }
  }).filter((entry) => entry.pool.length)

  return <Slideshow pools={pools} />
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

// About, trustees and contact, in rule bands at the foot of the page (the
// meeting notes: "about section, mission statement, trustees, all on the main site").
function Information() {
  const channels = [
    contact.email && { name: 'email', label: contact.email, href: `mailto:${contact.email}` },
    contact.instagram && { name: 'Instagram', label: 'Instagram', href: contact.instagram },
  ].filter(Boolean) as { name: string; label: string; href: string }[]

  return <section className="ns-info" aria-label="Information">
    <div className="ns-band" id="about"><h2>{siteName}</h2><h2>About</h2></div>
    <div className="ns-cols"><p className="ns-cols-about">{placeholder.about}</p></div>
    <div className="ns-band" id="trustees"><h2>Trustees</h2></div>
    <div className="ns-cols"><p>{placeholder.line}.</p></div>
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
      : <p className="ns-flow">{placeholder.line}.</p>}
  </section>
}
