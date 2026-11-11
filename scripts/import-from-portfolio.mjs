// Copies the New Spaces projects out of Ben's portfolio checkout: the project
// files into content/works (adding their programme) and their media from the
// portfolio's local bucket mirror into public/, under the same site paths.
//
//   node scripts/import-from-portfolio.mjs [benbroomeportfolio] [artistgrant-media-prepared]
//
// Only the projects listed below are copied. The portfolio is read, never
// written. Copied media is gitignored (public/work, public/originals): it is the
// local preview and the source for the New Spaces bucket, not part of the repo.
// Re-running refreshes the project files from the portfolio; it overwrites
// local edits to them.
//
// Some Artist Grant media is only at a web address on the grant site's bucket.
// The prepared copies of that bucket (Documents/artistgrant) hold the same
// files; they are copied under the project's own path and the entry repointed.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const portfolio = resolve(process.argv[2] ?? join(root, '..', 'benbroomeportfolio'))
const grantMedia = resolve(process.argv[3] ?? join(root, '..', 'artistgrant', 'artistgrant-media-prepared'))

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

// Old grant-bucket path → prepared file, e.g. /media/previouswinners-2023grant/andina-1f60b61e.jpg → upload/media/images/andina-1f60b61e78c8.jpg
const grantManifest = join(grantMedia, 'manifest.json')
const grantFiles = existsSync(grantManifest) ? JSON.parse(readFileSync(grantManifest, 'utf8')).oldPathToNewPath ?? {} : {}

const counts = { projects: 0, copied: 0, unchanged: 0 }
const remote = []
const missing = []

function copyFile(source, path) {
  const target = join(root, 'public', path)
  if (existsSync(target) && statSync(target).size === statSync(source).size) return counts.unchanged++
  mkdirSync(dirname(target), { recursive: true })
  copyFileSync(source, target)
  counts.copied++
}

// Copies one media file and returns the path the project should use for it.
function copyMedia(slug, path) {
  if (!path) return path
  if (/^https?:\/\//.test(path)) {
    const prepared = grantFiles[new URL(path).pathname]
    const source = prepared && join(grantMedia, 'upload', prepared)
    if (!source || !existsSync(source)) {
      remote.push(path)
      return path
    }
    const local = `/work/${slug}/${prepared.split('/').at(-1)}`
    copyFile(source, local)
    return local
  }
  if (!path.startsWith('/') || path.includes('..')) return missing.push(path), path
  const source = sourceOf(path)
  if (!source) return missing.push(path), path
  copyFile(source, path)
  return path
}

for (const [programme, slugs] of Object.entries(programmes)) {
  for (const slug of slugs) {
    const file = join(portfolio, 'content/works', `${slug}.json`)
    if (!existsSync(file)) {
      console.warn(`  Not in the portfolio, skipped: ${slug}`)
      continue
    }
    const work = JSON.parse(readFileSync(file, 'utf8'))
    const media = (path) => copyMedia(slug, path)
    if (work.featuredImage) work.featuredImage = media(work.featuredImage)
    for (const image of work.images ?? []) {
      if (image.upload) image.upload = media(image.upload)
      else image.src = media(image.src)
    }
    for (const video of work.videos ?? []) video.src = media(video.src)
    for (const doc of work.files ?? []) {
      if (doc.upload) doc.upload = media(doc.upload)
      else doc.href = media(doc.href)
    }
    writeFileSync(join(root, 'content/works', `${slug}.json`), `${JSON.stringify({ ...work, programme }, null, 2)}\n`)
    counts.projects++
  }
}

console.log(`Imported ${counts.projects} projects; media copied ${counts.copied}, already present ${counts.unchanged}.`)
if (remote.length) console.log(`  ${new Set(remote).size} files stay at their web address until the New Spaces bucket exists.`)
for (const path of new Set(missing)) console.warn(`  Media not found in the portfolio: ${path}`)
