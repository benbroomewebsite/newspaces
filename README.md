# New Spaces

An early website for New Spaces. The front page follows Daniel's Triple Phase
portfolio; project pages, galleries, document readers and the Keystatic editor
come from Ben Broome's portfolio. See `docs/build-plan.md` for the direction
and what is still awaited. The two example projects are layout samples.

## Local development

Use Node.js 22 and the pnpm version pinned in `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Project media is not in Git. With Ben's portfolio checkout (and its local
bucket mirror) beside this one, copy the New Spaces projects and their media:

```sh
node scripts/import-from-portfolio.mjs
```

Open the local URL printed by Next.js. `/keystatic` edits files locally without
credentials. No environment file is needed for local media. Copy `.env.example`
to `.env.local` when configuring public URLs. Never copy the portfolio's `.env`
files: New Spaces must have its own services and credentials.

```sh
pnpm check
pnpm test
pnpm typecheck
pnpm build
```

The collector runs before development, checks and builds. Edit `content/site.json`
and `content/works/*.json`, rather than `lib/generated/`. Missing media and
incomplete projects produce build warnings. The gallery checks exercise the
layout rules; content tests run in a temporary directory.
GitHub Actions runs the tests, type check and production build on pushes and PRs.

## Project map

- `app/(site)/`: index, About (`/bio` retained for compatibility), project pages.
- `components/`: index, project galleries, image/PDF readers, editor image organiser.
- `content/`: editable text and projects; `public/uploads/`: local media.
- `lib/`: content normalisation, gallery rules, media resolution and site metadata.
- `scripts/`: content collection, PDF runtime preparation and validation.
- `docs/project-audit.md`: clone comparison and decisions about inherited files.
- `docs/next-steps.md`: meeting prompts and future media setup.

## Editor and launch

Local editing is available in development. The production editor stays disabled
unless `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`. Its repository is
`benbroomewebsite/newspaces`; before enabling it, configure a separate Keystatic
GitHub app and server secrets (`KEYSTATIC_GITHUB_CLIENT_ID`,
`KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`), following the installed
Keystatic version's setup. Editor branches require review/merge through GitHub;
there is no inherited automatic merge workflow or deployment configured here.

Drafts default to `noindex`, with all crawling disallowed in `robots.txt`.
At launch, confirm the public domain, set `NEXT_PUBLIC_SITE_URL`, and set
`NEXT_PUBLIC_SITE_INDEXABLE=true`. Search directives do not provide access control.
Public environment values are baked into the build, so rebuild after changes.

R2 is not configured. Media currently comes from `public/`; leave
`NEXT_PUBLIC_MEDIA_BASE_URL` empty until the new bucket is ready.
