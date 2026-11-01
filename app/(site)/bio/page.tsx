import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { aboutParagraphs, contact, portrait } from '@/lib/bio'
import { Identity } from '@/components/identity'

export const metadata: Metadata = { title: 'Bio', description: aboutParagraphs.join(' '), alternates: { canonical: '/bio' }, openGraph: { title: 'New Spaces — Bio', description: aboutParagraphs.join(' '), url: '/bio' } }

export default function BioPage() {
  return <main className="project-page bio-shell">
    <h1 className="sr-only">New Spaces — About</h1>
    <aside className="project-navigation" aria-label="About New Spaces">
      <Identity tagline={false} />

      <nav className="bio-return" aria-label="Portfolio navigation">
        <Link href="/">← Selected work</Link>
      </nav>

      <article className="project-info bio-copy">
        {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>

      <footer className="contact">
        <a href={`mailto:${contact.email}`}>{contact.email}</a><br />
        <a href={contact.instagram} target="_blank" rel="noreferrer">↳ Instagram</a>
      </footer>
    </aside>

    <section className="project-content" aria-label="New Spaces">
      {portrait && <figure className="bio-portrait">
          <Image src={portrait.src} alt={portrait.alt} width={560} height={700} sizes="(max-width: 800px) calc(100vw - 56px), 560px" preload />
          {portrait.credit && <figcaption>{portrait.credit}</figcaption>}
      </figure>}
    </section>
  </main>
}
