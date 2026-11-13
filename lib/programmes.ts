import { type ProgrammeName, type Work, works } from './works'

// The New Spaces programmes, in the order the front page shows them. A project
// joins one through its Programme field in the editor. Keep the names in step
// with scripts/build-works.mjs and keystatic.config.ts.
// `photographs` picks the photographs the front page slideshow takes turns
// showing for a programme (from any of its projects). Without it, a programme
// of several projects shows one from each project, a single project its cover.
// `until` carries a programme's years past its last project here (Artist
// Grant: the 2026 winners are announced but not yet added).
const definitions: { name: ProgrammeName; id: string; text?: string; photographs?: string[]; until?: string }[] = [
  { name: 'Artist Membership', id: 'artist-membership' },
  // One per year: the stilt walker at night (2021), the painted figures (2022),
  // the studio (2023), the carved bed (2024).
  { name: 'Artist Grant', id: 'artist-grant', until: '2026', photographs: [
    '/work/artistgrant-2021grant/002.jpg',
    '/work/artistgrant-2022grant/001.jpg',
    '/work/artist-grant-2023/andina-1f60b61e78c8.jpg',
    '/work/artist-grant-2024/mg-9750-d7e86435d7ae.jpg',
  ] },
  // The works outdoors: the red frame in the garden and the table-tennis tables.
  { name: 'Rooms of Neighbours', id: 'rooms-of-neighbours', photographs: [
    '/work/rooms-of-neighbours/036-c5eb315bf9b2.webp',
    '/work/rooms-of-neighbours/007-66d940354f8c.webp',
    '/work/rooms-of-neighbours/016-ae3654fffd91.webp',
    '/work/rooms-of-neighbours/041-6a36fcea35ef.webp',
  ] },
  // Draft, from Ben's own description of the series; replace with approved copy.
  { name: 'Performance By', id: 'performance-by', text: 'An iterative series presenting live music and performance art in underused public space.', photographs: [
    // YHWH Nailgun: the pit from above, wide from above, the crowd from above.
    '/work/yhwh-nailgun-marble-arch-pit/031-577495eca847.webp',
    '/work/yhwh-nailgun-marble-arch-pit/020-ef448e9e2c2b.webp',
    '/work/yhwh-nailgun-marble-arch-pit/028-2601675aa994.webp',
    // Klein & The Twins: the bowl over the water, the lake.
    '/work/klein/001.jpg',
    '/work/klein/015.jpg',
  ] },
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
  /** Chosen photographs for the front page slideshow (see the definitions). */
  photographs: string[]
}

export const coverOf = (work: Work) => work.featuredImage || work.images[0]?.src

const firstSentence = (text: string) => text.match(/^[^\n]+?[.!?](?=\s|$)/)?.[0] ?? ''

export const programmes: Programme[] = definitions.map(({ name, id, text, photographs = [], until }) => {
  const members = works.filter((work) => work.programme === name)
  const years = [...new Set([...members.map((work) => String(work.year)), ...(until ? [until] : [])])].sort()
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
    photographs,
  }
}).filter((programme) => programme.works.length > 0)

export const programmeById = (id: string | null) => programmes.find((programme) => programme.id === id)
