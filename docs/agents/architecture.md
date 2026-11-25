# Architecture: Solid plus Vite

Source of truth: `vite.config.ts`, `src/routes/**`, `src/app.tsx`, `src/document.tsx`,
`src/features/**`, `src/pattern/**`, `src/core/**`, `content/**`, `netlify/edge-functions/**`.

A change is done when every file sits behind its `boundary`.

## Place code by `boundary` — `route` vs `feature` vs `pattern` vs `core`

Why a page composed inside a feature hides the route's shape and locks sections to one ordering.
Solve compose in `src/routes`: read params, then `PageColumn`/`Seo` plus feature sections in order.
`src/features` exports sections and stateful interfaces behind domain names, never a `page`.
Sections and interactive pieces live in `src/features`, drop-in shared UI and generic behavior in
`src/pattern` (imports only `core`, `ui`, `pattern`; takes data via props; names use `GLOSSARY.md`
domain terms), styled primitives in `src/ui`, pure logic in `src/core` with data in `content`, edge
code in `netlify/edge-functions` with relative imports only. A `feature` that two slices need moves
down to `pattern`; never import across `features` when `pattern` fits.

## Keep `src/ui` Solid only

Why a folder with two component dialects adds a read to every import and a choice to every new
primitive. Solve put every primitive in `src/ui/*.tsx`. Sections that need a variant wrapper belong
to the feature that owns them, so `src/ui` holds no page-level composition.

## Serve request-time routes from `src/routes`, logic from `src/features`

Why a host's request/response shape leaks into an endpoint's own policy, and a route that exists
only in production cannot be exercised by `vite`. Solve put an on-demand endpoint in
`src/routes/<name>.ts` with its transport policy (methods, CORS, problem bodies) at the top of the
file; the handler lives in `src/features/<name>/` behind a `Request -> Response` function.
`src/routes/ask.ts` and `src/routes/mcp.ts` follow this split and deploy through
`scripts/function.ts` into the `dist/functions` host-function directory.

## Shape routes by kind — `page` vs `endpoint`, with two exemptions

Why a route file that mixes page composition with handler plumbing hides which surface it serves,
and a page whose Seo path drifts from its filename ships the wrong canonical. Solve keep two shapes
in `src/routes`: a page (`.tsx`) default-exports a `*Route` component and declares Seo with the
file's path, inline (`<Seo path>`) or through a shell (`DetailPage seo`); an endpoint (`.ts`)
exports method handlers and no page shell, with document endpoints also listed in the prerender
artifact list. `[...404].tsx` carries no canonical path by nature and `scalar.ts` serves a
third-party shell, so both sit outside the convention.

## One entry pair — `src/app.tsx` and `src/document.tsx`

Why authored entries and a second HTML shell duplicate the hydration surface. Solve let start mode
generate the entries: `vite.config.ts` names `./src/app.tsx`, `./src/document.tsx`, and
`./src/middleware.ts` explicitly, because the plugin probes `src/Document.*` for the shell and repo
files are lowercase. Keep `<HydrationScript />` in the head and `{props.children}` in the body of
the document, site-wide chrome in `App`, and a page's content in its route. `scripts/prerender.ts`
renders the same pair for every path into `dist/client` as `<path>.html`, not `<path>/index.html`,
so Netlify serves `/about` without redirecting to `/about/`; `originHtmlPath` in the edge function
mirrors that layout. No `src/entry-*` files exist, so there is one code path on every surface.

## Create abstraction only behind a small seam

Why extra files cost attention. Solve add a file only when it hides real branching behind a small
seam; deepen the existing leaf with a builder instead.

## Name the shape first, build the lever for the rest

Why logic written before its shape scatters assumptions across files, and hand-run mechanical edits
cannot be re-verified. Solve name the core types and shared state before writing logic; for
non-trivial mechanical work, ship the script or codemod as the artifact so a reviewer reruns it
instead of trusting the hand-edit.

## Keep state `local`, put shareable state in the URL

Why shared mutable state couples components and a signal dies on reload. Solve keep state local to
the component or feature where possible, put anything a link or a refresh should reproduce in a
search parameter through `useSearchParams` (`/logs` filters, `/search` query), share through
`src/core` when two sections need the same value, `derive` instead of sync. Module scope holds
constants and the UI SDK's colour-scheme singleton, never a signal or store of our own: the server
loads a module once and reuses it for every request. Do not mirror the colour scheme in a second
store.

## Build content once, fetch runtime data where it renders

Why mixing build-time and runtime fetch drifts. Solve read build-time data from the bundle that
`scripts/content.ts` generates out of `content/`, and let a feature own its runtime fetch (search,
ask). Components never take runtime/external data through props; build-time content may be passed
from the route.

## Validate once at the `intake`

Why a second check deep in a call chain pays for the same question twice and still misses the seam
where it entered. Solve parse at the `intake` where data crosses in — request bodies, `env`,
upstream JSON, pagefind results, generated blobs — with a valibot schema, then trust the type below
it. Derive types from that schema (`v.InferOutput`) rather than restating the shape beside it.
Version a persisted blob and compare the version on read. Take an options object when two parameters
are the same type and a swap would still compile.
