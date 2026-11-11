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
- Drop the list index. The front of the site is a few large images.
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

Before finishing the grid, mock up two arrangements with real images: one row
of 4–5 cards and the three-column grid. Choose between them with Ben.

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
- `category` becomes the programme: Artist Membership, Artist Grant, Rooms of
  Neighbours or Performance By, plus any fifth programme. Remove fields that
  only Ben's archive used.
- Add a `programmes` collection with one file each: title, cover image, short
  text and order. It drives the front cards and the filters, so a fifth
  programme can be added in the editor without code.
- Add Mission and Trustees (name and role) to the `site` singleton. Email and Instagram stay there.
- Add an import script that copies only the listed slugs from Ben's portfolio
  into `content/works/` and maps their categories. It can be re-run if Ben
  updates the originals.

## Media (R2 on Ben's account)

The site uses 333 files. Ben's portfolio bucket holds 321 of them, served from
`media.benbroome.co.uk` through its `lib/media-map.json`. The other 12 are
Artist Grant files on a separate `r2.dev` bucket.

1. Run `wrangler logout`, then `wrangler login` with Ben's Cloudflare login (he
   approves it in the browser). Confirm `wrangler whoami` shows his account before going further.
2. Create one bucket for New Spaces. **Open:** the bucket name.
3. Write a migration script. It downloads each file from its current public URL
   and uploads it with `wrangler r2 object put --remote` and the correct content
   type, keyed by its site path (`work/<slug>/001.jpg`). With path keys New
   Spaces needs no media map, because `mediaHref` only adds the base URL.
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

0. Commit the current foundation cleanup, which is still uncommitted, so the
   redesign starts from a clean diff. Read the relevant Next.js 16 guides in
   `node_modules/next/dist/docs/` before changing routes or metadata.
1. Strip Ben's index: the list, hover preview, slideshow, font trial, alignment
   code and unused categories. Update the checks to match.
2. Port the Triple Phase visual system into a scoped stylesheet: tokens, header
   box, pills, cards and rule bands. Set it in Ben's font.
3. Change the content model (programmes, categories, site fields) and import the selected entries.
4. Set up the R2 bucket and migrate the media. This needs Ben's login.
5. Build the index: header, filters, programme cards, programme grids, and the
   About/Trustees/Contact bands. Mock up both grid arrangements and decide with Ben.
6. Restyle the project pages to match, keeping their layout and readers.
7. Run `pnpm test`, `pnpm typecheck` and `pnpm build`. In a browser at desktop
   and 390px, check the filters, back navigation, keyboard focus and that the page has no horizontal scroll.
8. At launch: the domain, `NEXT_PUBLIC_SITE_URL`, the indexable flag, a
   Keystatic GitHub app for Ben, and hosting.

## Open questions for Ben

1. Is there a fifth foundational programme, and what is it?
2. Is the Performance By list above right?
3. Logo, mission statement, trustees, contact email and Instagram.
4. Text for Artist Membership and a Performance By introduction.
5. Is the MS Mincho webfont licensed for New Spaces, or should the site use Shippori Mincho?
6. Bucket name, domain and hosting.
