# New Spaces website: build plan

Draft, 11 November 2026. Sources: the meeting notes (`NEW SPACES WEBSITE.txt`),
this repository (adapted from Ben's portfolio) and Daniel's Triple Phase
portfolio (`Documents/triple-phase.com/v0-triple-phase-website/app/portfolio`).
Items marked **Open** need Ben's answer before they are built. This supersedes
the meeting prompts in `next-steps.md`; its R2 checklist still applies.

## Direction

The front page uses the boxes and type of Daniel's Triple Phase portfolio
(triple-phase.com/portfolio) on Ben's grey, set in Ben's font. Keep it simple.
Project pages stay as on Ben's site.

- Use the portfolio's top: the name box and its notch, About, Trustees and Contact, and
  a description box and contact box beneath. The text is placeholder until
  New Spaces supplies its own.
- Show each programme as a wide white box: its name, text and a link on the
  left, three images to the right.
- Use one spacing measurement throughout (`--ns-space`, about 16px at desktop
  width). It is the gap between the boxes, down the page and between the two
  description boxes, the white around and between the images, and the distance
  from the top of a box to the top of its text (the header and each programme).
- Put About, Trustees and Contact at the foot of the page in rule bands, all at
  the body text size. The meeting notes ask for "about section, mission
  statement, trustees, all on the main site". The mission statement is left out for now.
- No category lines, no project counts, no list and no filter bar (all tried and dropped).
- Use Ben's grey (`#eeeeeb`, his `--paper`) for the page.
- Set the text a little larger than on the portfolio, with the body text
  nearer the title size (16px and 20px at desktop width).

## What comes from each site

| From | Keep | Drop |
|---|---|---|
| Triple Phase portfolio | White boxes, 1px gaps, the header box with its notch and the boxes beneath, image cards, rule bands, flowing contact text and pills, the type sizes (enlarged) | Its grey, Neue Haas, the filter pills, the local clock, paper/clip/live-site media |
| Ben's portfolio (this repo) | His grey, MS Mincho with its arrow and quote fixes, project pages (text column + gallery), image and PDF readers, Keystatic editor, content collector and checks, noindex drafts | List index, hover preview and slideshow (removed), Selected Writing/Press/Talk categories and writing-only fields |

The front page is `components/home.tsx` and `home.css`, ported from the
portfolio's `portfolio.css` and `portfolio-ui.tsx`.

## The page

```
┌ New Spaces ┐┌ About, Trustees, Contact ───────────────────────────────┐
├ description ───────┤ ├ tagline, Instagram │ Contact ┤
                         space
┌ Artist Membership ┬ image ─┬ image ─┬ image ──→ (runs off the edge)
│ text              │        │        │
│ ↳ Go to …         │        │        │
└───────────────────┴────────┴────────┘
                         space
┌ Artist Grant … (and so on for each programme)
                         space
──── New Spaces ─── About ──────────────────────────────────────
──── Trustees ──────────────────────────────────────────────────
──── Contact ───────────────────────────────────────────────────
```

- **A programme box** is always open. The name's capitals start level with
  the top of the first image. Under the name are its text and "↳ Go to …";
  the name and the link both go to its page. There are three images at one
  height, 3px apart inside a 3px white border. The last runs off the edge, and
  they scroll sideways without a visible scrollbar. There are no captions.
- **Artist Membership and Rooms of Neighbours** are single projects. Their
  box shows the project's first three images and their page is the project.
- **Artist Grant and Performance By** have several projects. Their box shows
  one image from each of the three latest projects, each linking to it. Their
  page (`/programmes/artist-grant`, `/programmes/performance-by`) shows all the
  projects as cards, three to a row.
- **Tried and dropped:** opening and closing the boxes, and the sideways slide.
- **The card version** (four tall image cards across the first screen) stays
  at `/cards` for comparison. **Open:** Ben chooses.
- **On phones** everything forms one column, with the text above the images.
- **Font:** Ben's MS Mincho. Ben's existing `?font=arial` trial shows the same
  page in a sans-serif, which is much closer to the portfolio's Neue Haas.
  **Open:** which to keep.

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

**From Ben:** the logo, description, trustees, contact email and Instagram,
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
- Add the description to the `site` singleton beside email and Instagram. Trustees (name and role) fill the Trustees section.
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
   his bucket (`r2-bucket/`), and the importer has already copied all 334
   files into `public/work` and `public/originals` (gitignored): 322 from that
   mirror and 12 grant files from `Documents/artistgrant/artistgrant-media-prepared`. Upload
   each with `wrangler r2 object put --remote` and the correct content type,
   keyed by its site path (`work/<slug>/001.jpg`). With path keys New Spaces
   needs no media map, because `mediaHref` only adds the base URL. Many
   originals are 2400–2500px and several MB, so make web-sized copies first.
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
- Built the front page (`components/home.tsx`, `home.css`) on the Triple
  Phase portfolio. A list layout and a filter bar were tried and dropped.
- Removed Ben's list index, hover preview and slideshow.

Next:

1. Restyle the project pages to match the front page, keeping their layout and readers.
2. Decide the font (MS Mincho or a sans-serif), then remove Ben's font trial.
3. Move the programmes and their texts into the editor. Add the description and the trustees.
4. Set up the R2 bucket and upload the media. This needs Ben's login.
5. Run `pnpm test`, `pnpm typecheck` and `pnpm build`. In a browser at desktop
   and 390px, check the programme links, back navigation, keyboard focus and that the page has no horizontal scroll.
6. At launch: the domain, `NEXT_PUBLIC_SITE_URL`, the indexable flag, a
   Keystatic GitHub app for Ben, and hosting.

## Open questions for Ben

Still waiting on 1–4 (as of 11 November 2026).

1. Is there a fifth foundational programme, and what is it?
2. Is the Performance By list above right?
3. Logo, description, trustees, contact email and Instagram.
4. Text for Artist Membership and a Performance By introduction.
5. MS Mincho or a sans-serif? If MS Mincho, is the webfont licensed for New Spaces, or should the site use Shippori Mincho?
6. Bucket name, domain and hosting.
