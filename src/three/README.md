# The 3D experience

Everything in this directory belongs to one page: `/3d.html`. Nothing outside
it imports from here, and it imports almost nothing from outside.

## What is in here

A self-contained application: its own `data/`, `components/`, `hooks/`,
`systems/`, `lib/` and a single page component, `pages/ExperiencePage.tsx`.
It was brought over from a separate repository and kept whole rather than
dissolved into the portfolio's own components, because the two were written
against different conventions and merging them would have meant rewriting both.

## The `@` alias points here, not at `src/`

`@/data/projects` resolves to `src/three/data/projects.ts` — **not** to
`src/data/projects.ts`. The alias is configured in `vite.config.ts` and
`tsconfig.app.json`, and it points at `src/three` on purpose.

This is not a stylistic choice. Both trees define a `data/projects.ts` **and** a
`data/skills.ts`. Had the subtrees been merged, those four files would have
collided; aliasing `@` one level deeper keeps them apart without renaming the
imports in the ~50 files that use them.

## Why the isolation matters

three.js, React Three Fiber and drei are roughly a megabyte. Because the scene
is reachable only from `3d.html`, Rollup cannot hoist that code into a chunk
shared with any other page — so a visitor reading a case study never downloads
a renderer they will not use. Importing anything from this directory into the
normal portfolio would silently undo that.

## The two deliberate exceptions

Two files cross the boundary, both so the scene cannot contradict the rest of
the site:

- `src/index.css` — the shared stylesheet. The 3D palette lives there too, with
  its `ink`, `surface` and `line` tokens renamed to `scene-*`: the 3D system
  uses those three names for a dark background and a hairline, which are the
  portfolio's names for text colour and card borders.
- `src/data/projects.ts` — the canonical project record. `data/projects.ts` in
  this directory authors only what the scene alone uses (category, technology
  list, verified properties, screenshot captions, access note) and reads title,
  status, the three live URLs, the test counts and the evaluation results from
  the canonical file.

## `3d.html` is a Vite entry point, not a stray file

It sits beside `index.html`, the three case studies and the three demos as one
of eight entries listed in `build.rollupOptions.input`. It is what makes the
scene its own document and its own chunk.

**Moving or renaming it changes a public URL.** `/3d.html` is named in the
canonical tag, `og:url`, the JSON-LD `url` and `public/sitemap.xml`. Relocating
it to, say, `3d/index.html` would serve the page at `/3d/` and invalidate all
four, so it is an SEO migration rather than a tidy-up. Weigh that before
treating its position as untidy.
