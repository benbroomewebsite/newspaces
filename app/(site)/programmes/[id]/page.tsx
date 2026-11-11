import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header, ProjectCard } from '@/components/home'
import { ReturnPosition } from '@/components/return-position'
import { placeholder } from '@/lib/placeholder'
import { programmeById, programmes } from '@/lib/programmes'

// A programme of several projects (Artist Grant, Performance By): its text as
// one paragraph, then its projects as cards, three to a row.
const withPages = programmes.filter((programme) => programme.works.length > 1)

export const dynamicParams = false

export function generateStaticParams() {
  return withPages.map((programme) => ({ id: programme.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const programme = programmeById((await params).id)
  if (!programme) return { title: 'Programme not found' }
  const url = `/programmes/${programme.id}`
  return { title: programme.name, description: programme.text || undefined, alternates: { canonical: url }, openGraph: { title: programme.name, url } }
}

export default async function ProgrammePage({ params }: { params: Promise<{ id: string }> }) {
  const programme = programmeById((await params).id)
  if (!programme || programme.works.length < 2) notFound()

  return <main className="ns ns-programme">
    <ReturnPosition />
    <Header />
    <p className="ns-intro">
      <strong>{programme.name}</strong> ({programme.years}). {programme.text || placeholder.programme}
    </p>
    <div className="ns-work">
      {programme.works.map((work) => <ProjectCard key={work.slug} work={work} />)}
    </div>
  </main>
}
