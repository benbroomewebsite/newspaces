// Exercise the real collector in an isolated fixture checkout. Never alter
// the project's content while testing incomplete or empty editorial states.
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const fixture = mkdtempSync(join(tmpdir(), 'newspaces-content-'))
try {
  for (const dir of ['scripts', 'content/works', 'lib', 'public']) mkdirSync(join(fixture, dir), { recursive: true })
  copyFileSync(join(root, 'scripts/build-works.mjs'), join(fixture, 'scripts/build-works.mjs'))
  symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir')
  writeFileSync(join(fixture, 'lib/media-map.json'), '{}')
  writeFileSync(join(fixture, 'content/site.json'), JSON.stringify({ bio: '', email: '', instagram: '' }))
  const collect = () => {
    execFileSync(process.execPath, [join(fixture, 'scripts/build-works.mjs')], { stdio: 'pipe', timeout: 15_000 })
    return JSON.parse(readFileSync(join(fixture, 'lib/generated/works.json'), 'utf8'))
  }
  assert.deepEqual(collect(), [], 'An empty archive must build')
  const save = (slug, fields) => writeFileSync(join(fixture, `content/works/${slug}.json`), JSON.stringify({ title: 'Test', category: 'Exhibition', date: '2026', ...fields }))
  save('invalid-category', { category: 'Unknown' })
  save('invalid-date', { date: '2026-02-31' })
  save('missing-title', { title: '' })
  save('leap-day', { date: '2024-02-29' })
  save('incomplete', {
    slug: 'must-not-override-filename',
    images: [{ src: '/missing.jpg' }, {}],
    videos: [{ src: '' }], files: [{}], featuredImage: '/missing.jpg',
    links: [{ label: 'Missing URL' }, { label: 'Valid', href: 'https://example.org' }],
  })
  const works = collect()
  assert.deepEqual(works.map((work) => work.slug), ['incomplete', 'leap-day'])
  assert.deepEqual(works[0].images, [])
  assert.deepEqual(works[0].videos, [])
  assert.deepEqual(works[0].files, [])
  assert.equal(works[0].featuredImage, '')
  assert.equal(works[0].links.length, 1)
  console.log('Content collection: empty archive, invalid dates/categories, filename slugs and missing media passed.')
} finally {
  rmSync(fixture, { recursive: true, force: true })
}
