# New Spaces website: build plan

Draft, 11 November 2026. Sources: the meeting notes (`NEW SPACES WEBSITE.txt`),
this repository (adapted from Ben's portfolio) and Daniel's Triple Phase
portfolio (`Documents/triple-phase.com/v0-triple-phase-website/app/portfolio`).
Items marked **Open** need Ben's answer before they are built. This supersedes
the meeting prompts in `next-steps.md`; its R2 checklist still applies.

## Direction

Use only two sources: Ben's site for structure, project pages and font, and
Daniel's portfolio for its boldness and visual system. Cut everything else.

- Keep everything on one page. Clicking a project opens its page, as on Ben's site.
- Replace Ben's list index. The front of the site leads with large images.
  Two layouts are on trial (see "The page").
- Keep the top minimal: one box holding New Spaces, the filters, About and
  Contact. Drop the description and contact boxes beneath it.
- Put About, the mission statement, trustees and contact further down the same page.
- Use a grey background for now, as on the Triple Phase portfolio. It can change later.

## What comes from each site

| From | Keep | Drop |
|---|---|---|
| Triple Phase portfolio | Grey page, white boxes, 1px gaps; header box with its notch; rounded filter pills; image cards (meta, title, image, tags); rule bands for About/Contact; the three type sizes | Neue Haas; boxes under the header; the local clock; paper, clip and live-site media |
| Ben's portfolio (this repo) | MS Mincho with its arrow and quote fixes; project pages (text column + gallery), image and PDF readers, Keystatic editor, content collector and checks, `/?filter=` links, noindex drafts | List index and hover preview, row snapping and filter alignment code, slideshow, font trial, Selected Writing/Press/Talk categories and writing-only fields |

Triple Phase files to port: `portfolio.css`, `portfolio-ui.tsx`, `portfolio-live.tsx`.
Files here to rework: `components/portfolio.tsx`, `components/project.tsx`, `app/globals.css`.

## The page

```
┌ New Spaces ┐┌ All  Artist Membership  Artist Grant  Rooms of Neighbours  Performance By   About, Contact ┐
└────────────┘└────────────────────────────────────────────────────────────────────────────────────────────┘
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Artist      │ │ Artist      │ │ Rooms of    │ │ Performance │
│ Membership  │ │ Grant       │ │ Neighbours  │ │ By          │
│             │ │             │ │             │ │             │
│   image     │ │   image     │ │   image     │ │   image     │
│             │ │             │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
──── About ─────────────────── Mission ─────────────────────────
──── Trustees ──────────────────────────────────────────────────
──── Contact ───────────────────────────────────────────────────
```

- **All** shows the foundational programmes as large cards. On desktop they
  fill the screen below the header, and on phones they stack. The images carry the page.
- **A filter** replaces those cards with that programme's projects in the Triple
  Phase three-column grid. Performance By shows each performance, and Artist
  Grant shows each year. Artist Membership and Rooms of Neighbours are single
  projects, so their card opens the project page directly.
- **Clicking a programme card** does the same as its filter, using `/?filter=…`,
  which the index already supports.
- **About, Mission, Trustees and Contact** follow as rule bands. About and
  Contact in the header jump to them.
- **On phones** the header stays on one line, the filters wrap beneath it and the cards form one column.

**Two layouts on trial** at `/`, switched with the pill at the foot of the
screen or `?layout=boxes` / `?layout=list`:

- **Boxes:** the programmes fill the first screen as tall image cards. Every
  project follows as a card in three columns.
- **List:** programmes are headings over rows divided by rules. Pointing at a
  row fills a large panel beside the list with its images and text. The panel
  sits beside the list rather than opening inside it, so the rows stay still
  under the pointer. On phones each programme shows its photo above its rows.

Both use the same header, filters and About/Trustees/Contact bands, set in
Ben's font with Ben's paper for the boxes on the Triple Phase grey. Ben's
original index stays at `/classic` for comparison. **Open:** Ben chooses.

## Content to carry across

Copy these entries from `Documents/benbroomeportfolio/content/works`:

| Programme | Entries | Media | Still needed |
|---|---|---|---|
| Artist Membership | `artist-membership-project` | 10 images | Text |
| Artist Grant | `artist-grant-2021`, `artistgrant-2022grant`, `artist-grant-2023`, `artist-grant-2024` | 16 images, 4 videos, links to artistgrant.co.uk | — |
| Rooms of Neighbours | `rooms-of-neighbours` | 42 images, 1 video, 1 PDF | — |
| Performance By | 10 performances (list below) | 257 images, 3 videos | Programme introduction |
| Fifth programme | **Open** | | |

**Performance By (Open: confirm).** These are the outdoor London venues in Ben's Performance category:

- Charlie Osbourne, Myatt's Fields Bandstand, May 2025
- Daria Blum, Myatt's Fields Bandstand, May 2025
- Slauson Malone 1, Ruskin Park Bandstand, 15 June 2025
- SUUTOO, Ruskin Park Bandstand, 15 June 2025
- Rat Section, Victoria Embankment Bandstand, 27 July 2025
- Show Me The Body, Southwark Park Bandstand, 14 August 2025
- Klein & The Twins, Crystal Palace Bowl, 12 October 2025
- YHWH Nailgun, Marble Arch Pit, 14 June 2026
- Raheel Khan, French Ordinary Court, 31 July 2026
- Dynamite, Powerplant & Trash Talk, Bridgehouse Meadows, August 2026

Left out: the ten 2022 performances at Gladstone Gallery and Alice Visentin at
the Italian Cultural Institute, because they were indoors. None of the
performances has text, so their pages are images only.

**From Ben:** the logo, mission statement, trustees, contact email and Instagram,
text for Artist Membership, a Performance By introduction, image credits, and
any charity wording he wants public. Use only wording he supplies. A draft
Performance By introduction could start from his own bio: "an iterative series
presenting live music and performance art in underused public space".

## Content model

- Keep Keystatic and the collector (`content/works/*.json` → `lib/generated/`).
- A `programme` field (in the editor) puts a project on the front page. Ben's
  own categories stay, so the project pages behave as on his site. Once a
  layout is chosen, remove the fields only his archive used.
- The programmes are defined in `lib/programmes.ts` for now. Later, move them
  into a Keystatic collection (title, cover, text, order), so a fifth can be
  added in the editor without code.
- Add Mission and Trustees (name and role) to the `site` singleton. Email and Instagram stay there.
- `scripts/import-from-portfolio.mjs` copies the listed projects and their
  media from Ben's checkout. Re-running it refreshes them from the portfolio
  and overwrites any local edits to those files.

## Media (R2 on Ben's account)

The site uses 333 files. Ben's portfolio bucket holds 321 of them, served from
`media.benbroome.co.uk` through its `lib/media-map.json`. The other 12 are
Artist Grant files on a separate `r2.dev` bucket.

1. Run `wrangler logout`, then `wrangler login` with Ben's Cloudflare login (he
   approves it in the browser). Confirm `wrangler whoami` shows his account before going further.
2. Create one bucket for New Spaces. **Open:** the bucket name.
3. Upload from the local copies. Ben's checkout keeps a gitignored mirror of
   his bucket (`r2-bucket/`), and the importer has already copied the 322 files
   found there into `public/work` and `public/originals` (gitignored). Upload
   each with `wrangler r2 object put --remote` and the correct content type,
   keyed by its site path (`work/<slug>/001.jpg`). With path keys New Spaces
   needs no media map, because `mediaHref` only adds the base URL. Many
   originals are 2400–2500px and several MB, so make web-sized copies first.
   The other 12 grant files are on the separate `r2.dev` bucket. Resized
   copies are in `Documents/artistgrant/artistgrant-media-prepared`.
4. Use the bucket's `r2.dev` address during review. It is rate-limited and not
   for launch. Switch to a custom domain once the New Spaces domain is on Cloudflare.
5. Check images, videos and the PDF (including range requests) through the
   public URL, then set `NEXT_PUBLIC_MEDIA_BASE_URL`.

Only read from Ben's portfolio buckets, never write to them. Keep credentials out of the repo.
Until the bucket exists, lay out the page with a few local images per programme.

## Fonts

Keep Ben's portfolio typeface, MS Mincho (`MS Mincho Web`). It is already in
`public/fonts/` and `app/globals.css`, together with its fixes (arrows from
Arial, quotes from a serif). From Triple Phase take only the layout and the type
sizes. MS Mincho has a single regular weight, so the boldness has to come from
size, the white boxes and the images. Shippori Mincho 600, which is also in the
repo, can be tried for titles in the mockup.

MS Mincho is a Microsoft-supplied font. Before launch, confirm that the webfont
is licensed for New Spaces, or switch to Shippori Mincho, which has an open
licence (SIL OFL). **Open.**

## Build order

Done on the `site-redesign` branch (11 November 2026):

- Committed the foundation cleanup as a checkpoint.
- Imported the 16 projects and their media (`node scripts/import-from-portfolio.mjs`).
- Built the front page (`components/home.tsx`, `home.css`) with both layouts,
  and moved Ben's index to `/classic`.

Next:

1. Ben chooses Boxes or List. Remove the other layout, the switch, `/classic`
   and Ben's list index code (slideshow, font trial, alignment code). Update the checks to match.
2. Restyle the project pages to match the front page, keeping their layout and readers.
3. Move the programmes into the editor. Add Mission and Trustees.
4. Set up the R2 bucket and upload the media. This needs Ben's login.
5. Run `pnpm test`, `pnpm typecheck` and `pnpm build`. In a browser at desktop
   and 390px, check the filters, back navigation, keyboard focus and that the page has no horizontal scroll.
6. At launch: the domain, `NEXT_PUBLIC_SITE_URL`, the indexable flag, a
   Keystatic GitHub app for Ben, and hosting.

## Open questions for Ben

1. Boxes or List for the front page?
2. Is there a fifth foundational programme, and what is it?
3. Is the Performance By list above right?
4. Logo, mission statement, trustees, contact email and Instagram.
5. Text for Artist Membership and a Performance By introduction.
6. Is the MS Mincho webfont licensed for New Spaces, or should the site use Shippori Mincho?
7. Bucket name, domain and hosting.
