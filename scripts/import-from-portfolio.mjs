// Copies the New Spaces projects out of Ben's portfolio checkout: the project
// files into content/works (adding their programme) and their media from the
// portfolio's local bucket mirror into public/, under the same site paths.
//
//   node scripts/import-from-portfolio.mjs [path to benbroomeportfolio]
//
// Only the projects listed below are copied. The portfolio is read, never
// written. Copied media is gitignored (public/work, public/originals): it is the
// local preview and the source for the New Spaces bucket, not part of the repo.
// Re-running refreshes the project files from the portfolio; it overwrites
// local edits to them.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const portfolio = resolve(process.argv[2] ?? join(root, '..', 'benbroomeportfolio'))

const programmes = {
  'Artist Membership': ['artist-membership-project'],
  'Artist Grant': ['artist-grant-2021', 'artistgrant-2022grant', 'artist-grant-2023', 'artist-grant-2024'],
  'Rooms of Neighbours': ['rooms-of-neighbours'],
  // The outdoor London performances. Ben to confirm the list (docs/build-plan.md).
  'Performance By': [
    'charlieosbourne', 'dariablum', 'slauson-malone-1-2025', 'suutoo', 'ratsection',
    'showmethebody', 'klein', 'yhwh-nailgun-marble-arch-pit', 'raheel-khan-french-ordinary-court', 'bridgehouse-meadows',
  ],
}

const mirror = join(portfolio, 'r2-bucket')
if (!existsSync(join(portfolio, 'content/works')) || !existsSync(mirror)) {
  console.error(`Not a portfolio checkout with a local bucket mirror: ${portfolio}`)
  process.exit(1)
}
const mediaMap = JSON.parse(readFileSync(join(portfolio, 'lib/media-map.json'), 'utf8'))

// A site path is found under its bucket key, at the same path in the mirror, or in the portfolio's public/.
const sourceOf = (path) => [mediaMap[path] && join(mirror, mediaMap[path]), join(mirror, path), join(portfolio, 'public', path)]
  .find((candidate) => candidate && existsSync(candidate))

const counts = { projects: 0, copied: 0, unchanged: 0 }
const remote = []
const missing = []

function copyMedia(path) {
  if (!path) return
  if (/^https?:\/\//.test(path)) return remote.push(path)
  if (!path.startsWith('/') || path.includes('..')) return missing.push(path)
  const source = sourceOf(path)
  if (!source) return missing.push(path)
  const target = join(root, 'public', path)
  if (existsSync(target) && statSync(target).size === statSync(source).size) return counts.unchanged++
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(source, target)
  counts.copied++
}

for (const [programme, slugs] of Object.entries(programmes)) {
  for (const slug of slugs) {
    const file = join(portfolio, 'content/works', `${slug}.json`)
    if (!existsSync(file)) {
      console.warn(`  Not in the portfolio, skipped: ${slug}`)
      continue
    }
    const work = JSON.parse(readFileSync(file, 'utf8'))
    for (const path of [work.featuredImage, ...(work.images ?? []).map((image) => image.upload || image.src), ...(work.videos ?? []).map((video) => video.src), ...(work.files ?? []).map((doc) => doc.upload || doc.href)]) copyMedia(path)
    writeFileSync(join(root, 'content/works', `${slug}.json`), `${JSON.stringify({ ...work, programme }, null, 2)}\n`)
    counts.projects++
  }
}

console.log(`Imported ${counts.projects} projects; media copied ${counts.copied}, already present ${counts.unchanged}.`)
if (remote.length) console.log(`  ${new Set(remote).size} files stay at their web address until the New Spaces bucket exists.`)
for (const path of new Set(missing)) console.warn(`  Media not found in the portfolio: ${path}`)
