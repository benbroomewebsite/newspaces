# Clone and inheritance audit — 1 November 2026

Workspace: `C:\Users\danie\Documents\NewSpaces`.

The folder initially contained only an empty `.dist` directory. Cloned
`https://github.com/benbroomewebsite/newspaces.git`, preserving that directory.
`origin/main` and the initial local HEAD both resolved to
`4f1c94827b55025d07db089f69c07a0bf3c09e45`; `git fsck --full` passed.

Compared with `Documents/benbroomeportfolio`, whose clean local `main` was at
`c2a8c49`. Compared file contents after normalising Windows line endings.
Every `.ts`, `.tsx`, `.css`, `.cjs` and `.mjs` file under the portfolio's `app`,
`components` and `lib` was present in New Spaces. The differences were branding,
About content, organisation metadata and the slideshow/media configuration.
The gallery layout, image organiser, text rendering, PDF and image readers,
navigation, filters and current portfolio fixes were retained.

The active collector, gallery/project checks, PDF asset preparation and TypeScript
loader were also present. New Spaces has a frozen dependency lockfile and local
example images, so it does not need the portfolio's media account to run.

## Files deliberately kept with the portfolio

- Ben's project archive, portrait and uploaded artwork: personal portfolio content.
- Squarespace migration data/scripts, date audits and historical meeting notes:
  specific to that archive.
- R2 sync/mirror/account migration tools: include portfolio bucket/account defaults
  and depend on its manifests. Reusing them unchanged could target the wrong account.
- PDF preview/dimension preparation scripts: depend on old archive files and media
  URLs; local editor uploads already get dimensions from the current collector.
- `.env`/`.env.local`, Wrangler credentials, caches, dependencies and build output:
  machine state or secrets; not project source.
- Automatic editor-branch publication workflow: includes an old artist branch and
  portfolio publishing assumptions. New Spaces uses explicit GitHub merges for now.

Original files remain intact in the portfolio checkout. No media was uploaded,
bucket created, deployment made or changes pushed during this setup.

## Validation after foundation cleanup

- Frozen pnpm installation, content/gallery checks, content regression tests,
  TypeScript and production build passed locally.
- Browser: desktop and 390px phone layout, filters, empty filter message, project
  gallery, About, local editor, missing-project/PDF 404s and disabled browser
  session storage checked. No page runtime errors or horizontal overflow found.
- The build retains a Next.js metadata-base warning for a route outside the
  public layout; launch still requires the confirmed canonical domain.
- Remote R2 streaming and production GitHub editor authentication cannot be
  exercised until their separate New Spaces services are configured.
