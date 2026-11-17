// Uploads the site's media (public/work and public/originals, both gitignored)
// to an R2 bucket on the account Wrangler is logged into, each keyed by its
// site path (/work/x/001.jpg -> work/x/001.jpg), then lists them all in
// lib/media-map.json so mediaHref serves them from NEXT_PUBLIC_MEDIA_BASE_URL.
//
//   node scripts/upload-media.mjs <bucket>            upload everything
//   node scripts/upload-media.mjs <bucket> --map-only  only rewrite the map
//
// The bucket must be named: there is deliberately no default. Check
// `wrangler whoami` shows New Spaces' account first.
import { execFile } from 'node:child_process'
import { readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)
const [bucket, flag] = process.argv.slice(2)
if (!bucket) { console.error('Usage: node scripts/upload-media.mjs <bucket> [--map-only]'); process.exit(1) }

const root = path.resolve(import.meta.dirname, '..')
const publicDir = path.join(root, 'public')
const types = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.avif': 'image/avif', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mov': 'video/quicktime', '.pdf': 'application/pdf',
}
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)])
const keys = ['work', 'originals']
  .flatMap((folder) => walk(path.join(publicDir, folder)))
  .map((file) => path.relative(publicDir, file).split(path.sep).join('/'))
  .filter((key) => types[path.extname(key).toLowerCase()])
  .sort()

if (flag !== '--map-only') {
  const wrangler = path.join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js')
  let done = 0
  const failed = []
  const queue = [...keys]
  const worker = async () => {
    for (let key; (key = queue.shift());) {
      const args = [wrangler, 'r2', 'object', 'put', `${bucket}/${key}`, '--remote',
        '--file', path.join(publicDir, key), '--content-type', types[path.extname(key).toLowerCase()],
        '--cache-control', 'public, max-age=31536000, immutable']
      try { await run(process.execPath, args, { maxBuffer: 1 << 24 }) }
      catch (error) { failed.push(key); console.error(`Failed: ${key}\n${error.stderr || error.message}`) }
      done += 1
      if (done % 20 === 0 || done === keys.length) console.log(`${done}/${keys.length}`)
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker))
  if (failed.length) { console.error(`${failed.length} failed; the map was not changed. Rerun to retry.`); process.exit(1) }
}

writeFileSync(path.join(root, 'lib', 'media-map.json'), `${JSON.stringify(Object.fromEntries(keys.map((key) => [`/${key}`, key])), null, 2)}\n`)
console.log(`Uploaded ${flag === '--map-only' ? 0 : keys.length} files to ${bucket}; mapped ${keys.length} in lib/media-map.json.`)
