import { type ProgrammeName, type Work, works } from './works'

// The New Spaces programmes, in the order the front page shows them. A project
// joins one through its Programme field in the editor. Keep the names in step
// with scripts/build-works.mjs and keystatic.config.ts.
const definitions: { name: ProgrammeName; id: string; text?: string }[] = [
  { name: 'Artist Membership', id: 'artist-membership' },
  { name: 'Artist Grant', id: 'artist-grant' },
  { name: 'Rooms of Neighbours', id: 'rooms-of-neighbours' },
  // Draft, from Ben's own description of the series; replace with approved copy.
  { name: 'Performance By', id: 'performance-by', text: 'An iterative series presenting live music and performance art in underused public space.' },
]

export type Programme = {
  name: ProgrammeName
  /** Names the programme in the address: /?filter=performance-by */
  id: string
  /** One or two sentences; empty until approved copy exists. */
  text: string
  works: Work[]
  /** "2025", or "2021–2024". */
  years: string
  cover?: string
  /** A programme of a single project opens that project; one of several has its own page. */
  href: string
}

export const coverOf = (work: Work) => work.featuredImage || work.images[0]?.src

const firstSentence = (text: string) => text.match(/^[^\n]+?[.!?](?=\s|$)/)?.[0] ?? ''

// The opening of a project's text. A heading line such as "The Judging Panel:"
// is joined to the paragraph it introduces.
export function excerpt(description: string, limit = 320) {
  const [first = '', second] = description.split(/\n\n+/).map((paragraph) => paragraph.replace(/\s+/g, ' ').trim()).filter(Boolean)
  const text = first.length < 40 && second ? `${first.replace(/[:;]?$/, ':')} ${second}` : first
  return text.length > limit ? `${text.slice(0, limit).replace(/\s+\S*$/, '')}…` : text
}

export const programmes: Programme[] = definitions.map(({ name, id, text }) => {
  const members = works.filter((work) => work.programme === name)
  const years = [...new Set(members.map((work) => work.year))].sort()
  const single = members.length === 1 ? members[0] : undefined
  return {
    name,
    id,
    text: text ?? (single ? firstSentence(single.description) : ''),
    works: members,
    years: years.length > 1 ? `${years[0]}–${years.at(-1)}` : String(years[0] ?? ''),
    // Works arrive newest first, so the cover comes from the latest project.
    cover: members.map(coverOf).find(Boolean),
    href: single ? `/work/${single.slug}` : `/programmes/${id}`,
  }
}).filter((programme) => programme.works.length > 0)

export const programmeById = (id: string | null) => programmes.find((programme) => programme.id === id)
