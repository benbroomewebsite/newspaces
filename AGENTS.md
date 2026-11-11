# New Spaces

This is a separate charity website adapted from Ben Broome's portfolio. Keep
its current layout and sample projects useful for review while content and
branding are discussed with Shelter Studio. Do not invent programme details,
charitable registration claims, contact addresses or confirmed domains.

Use `README.md` and `docs/project-audit.md` for setup and provenance. Edit
`content/` rather than `lib/generated/`. Keep media local until the later R2
setup on Ben's intended account; never copy portfolio credentials or assume
its bucket/account defaults. Drafts remain non-indexable until launch.

Validate code changes with `pnpm test`, `pnpm typecheck` and `pnpm build` (which
includes content/gallery checks). Browser-check changed interactions at desktop
and phone sizes. The GitHub workflow runs these checks once pushed.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
