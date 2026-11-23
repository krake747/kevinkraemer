# Review

Mistakes to avoid going forward. Checked at diff time. Project and code quality live in
`CODING_STANDARDS.md`. Implementation agent ignores this file.

Source of truth: `tsconfig.json` paths, `src/features/**` and `src/pattern/**` file lists,
`netlify/edge-functions/**`.

A diff is done when names and imports sit behind their `boundary`.

## Pattern — mechanism, not domain

Why a shared folder drifts into a second features tree: anything used by two slices looks homeless,
but a component that hardcodes domain copy couples every consumer to that domain. Solve keep
`src/pattern/**` to mechanism with no domain names — copy behavior (`create-copy-feedback.ts`),
scroll behavior (`create-scroll-reveal.ts`), generic display (`code-block.tsx`); a component that
names a route, a feed, or a site narrative (`/cv`, RSS, chain-vs-now) lives in the feature that owns
it, even with two consumers. Check via `grep -rn 'href="/' src/pattern` — a hardcoded route is the
smell.

## Change shape — smallest deletion-first diff

Why abstractions and layers compound: each added seam is a read on every future visit. Solve bias to
deletion and the smallest change that solves the problem; collapse one-caller wrappers, shrink
mutable scope. When two fixes fail behind the same premise, write the premise down and test it
directly before a third fix that assumes it. Check via `git diff --stat` — a diff that only adds
files is the smell.

## Types — one declaration, derive at the use site

Why a second literal copy compiles when the owner grows a field, so the copy keeps claiming the old
surface. Solve declare each shape where it is owned, then narrow at the use site with `Pick`,
`Omit`, `Parameters`, `ReturnType`, or `typeof`, and with `v.InferOutput` where a valibot schema
owns it (`LogSummary`, `CatalogEntry`, `TapeFile`). Check via
`git diff main -- src | grep "^+type .* = {"` — a new literal whose fields already sit on a type the
file imports is the smell. Renders children take `ParentProps` (or `ComponentProps`, which carries
them); data-only components take `VoidProps` so stray text fails instead of vanishing. A new
component whose body never reads `props.children` but whose props lack `VoidProps` is the smell.

## File naming — kebab-case, the folder names the part

Why repeating the feature in every file makes `log/log-card.tsx` read twice and puts the same word
in the path and the identifier. Solve name every file in `src/features/{feature}/` after its part,
not the feature: `log/card.tsx` exports `LogCard`, `developers/footer.tsx` exports
`DevelopersFooter`, `command-palette/row-item.tsx` exports `CommandPaletteRowItem`. The file named
exactly `{feature}.ts(x)` is the feature entry and exports the component of that name (`header.tsx`
→ `Header`, `footer.tsx` → `Footer`, `command-palette.tsx` → `CommandPalette`). Name a builder
`create-{part}.ts` and export `create{Feature}{Part}` (`log/create-filter.ts` → `createLogFilter`,
`mcp/create-handler.ts` → `createMcpHandler`). Keep `use*` for router and context readers only
(`useParams`, `useSearchParams`), which arrive named. `src/ui/**` files keep their own kebab name
(`stack-row.tsx`, `button.tsx`). Check via `pnpm lint` (`kk/feature-names` in `lint/`), which fails
a file that repeats its folder or a component that is not `{Feature}{Part}`.

## Page parts — one stem per page

Why a predictable part vocabulary lets an agent find a page's header, summary or row without opening
the route, and keeps two parts from reading the same in a grep. Solve name the route export
`{Name}Route` (`SearchRoute`, `CvRoute`, `DevelopersRoute` in `src/routes`) and compose feature
parts there; the page root in features is the part itself (`SearchInterface` in
`src/features/search/interface.tsx`), or `{Name}Layout` when it wraps rather than owns the page
(`ContactLayout`); prefix every part with the same stem (`CvHeader`, `CvSummary`, `CvTimeline`,
`ProjectList`); end a section wrapper in `Section` (`AboutSection`, `UsesGroupSection`). Omit the
parts a page does not have. A part that two pages need moves down to `src/pattern` or `src/ui`
(`architecture.md`) instead of losing its stem in place. Check via `pnpm lint` (`kk/feature-names`)
— a component without its page stem is the smell.

## Import alias — use `@` except `edge`

Why `@` aliases shorten paths and survive moves. Solve import via the `@` aliases defined in
`tsconfig.json` (`paths`, read directly by Vite and Vitest via `resolve.tsconfigPaths`) — every
module import in `src` uses one, even within a single folder (`@core/site/site-meta`, not `./site`);
keep `netlify/edge-functions/**` on relative imports only, no `@` alias
(`docs/adr/0004-edge-negotiation-conversion.md`). One exception: a `src` module the edge bundle
imports joins the edge rule for its own imports, since the edge bundler resolves no aliases
(`src/core/site/problem.ts` imports `./api-version.ts`). Keep the exception to modules the edge tree
actually imports. `kk/alias-imports` forbids relative imports under `src/`; the edge no-alias rule
lives in the Fallow pack `fallow-policy/imports.json` (`imports/edge-no-aliases`), wired via
`.fallowrc.json` `rulePacks`. Orchestrator and chrome leaves may import across features
(`src/features/header/header.tsx` imports `CommandPalette`, `src/routes/index.tsx` composes
`LogSubscribe`); do not treat those as boundary violations.

## Import order — packages, then aliases

Why one order means a reader never scans a file twice to find where a name came from, and a moved
import is noise in an otherwise focused diff. Solve one block with no blank lines; let `vp fmt`
(`fmt.sortImports: true` in `vite.config.ts`) decide path order — do not hand-sort `solid-js` to the
top. Inside one import, values come before `type` bindings, and a binding list of nothing but types
is `import type`.

```tsx
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit, type ParentProps } from "solid-js"
```

Inside the alias group keep the order the file reads in; alphabetical sorting is not required
(`@core/site/urls` may precede `@core/site/catalog`), and no layer order is imposed between `@ui`,
`@pattern`, `@features`, and `@core`. Check via the head of the file: a blank line inside the block,
or `{ type X }` as the only binding is the smell.

## Icons — one home, no `aria-hidden`

Why duplicated icon sets drift in stroke and size. Solve import icons from `src/ui/icon.tsx` and
drop `aria-hidden` where the component already sets it; decorative glyphs sit next to the copy that
names them. Check via `pnpm lint`.

## Lists — keep row identity, derive the visible set

Why a rebuilt row loses its DOM, focus and animation, so `For` matches by object identity and a
fresh object per fetch rebuilds every row. Solve key lists that arrive from a fetch by their stable
id (`keyed={(hit) => hit.href}` in `search/results.tsx`, `(row) => row.rowId` in the palette) and
derive filters and sorts in a memo over the same items (`visibleEntries` in `log/filter.tsx`); read
`index()` inside JSX, never once at the top of the callback. Check via `grep -n "<For" src` — a list
of fetched records without `keyed` is the smell.

## Async reads — promise in a memo, failure in `Errored`

Why a loading flag or a `{ failure }` union turns every reader into a branch. Solve let the memo
body return the promise, put `Loading` around the first value and `isPending` on a refetch, and
throw when the response is unusable so the nearest `Errored` renders the retry (`SearchFailed` in
`src/features/search/interface.tsx`, `CommandPaletteFailed` in `command-palette/failed.tsx`). Keep a
value only for an expected outcome the caller renders differently (`SearchOutcome` `"unavailable"`,
`CopyOutcome`). Check via `grep -n "Errored\|isPending" src` — an async read with a hand-rolled
loading boolean is the smell.

## Commit scope — attributable hunks, named behavior changes

Why mixed concerns and silent behavior changes slip through large refactors. Solve stage per file
and read `git diff --stat` before committing so every hunk is attributable; when a test edit follows
a behavior change, the commit names the behavior change. Check via `git diff --stat HEAD` — every
file accounted for.

## Hydration ids — same primitives on both sides

Why Solid pairs prerendered markup with client nodes by a sequential hydration id, so a hook that
creates fewer reactive primitives on the server than in the browser shifts every id after it: the
next component claims its predecessor's node and everything below it never hydrates, leaving reveal
sections invisible with `Cannot read properties of null (reading 'nextSibling')`. Solve never
early-return on `isServer` inside a component or hook — the primitives are SSR-safe and must run on
both sides. Pass a prop that inserts JSX as an element and render it directly (`lede` in
`prose-shell.tsx`); `children` is claimed in place and needs no thunk. Check via `pnpm dev` —
production strips the warnings — and load every route with the console open:
`Hydration tag mismatch`, `Hydration structure mismatch`, or an "unclaimed server-rendered node"
warning means an id moved. Search parameters are the other way to shift markup: they are absent
while prerendering, so gate `useSearchParams` reads with `createHydrated()` from
`@pattern/create-browser-value` (used in `src/pattern/create-url-query.ts` and
`src/features/log/create-filter.ts`) and filter only after that.

## Polymorphism — `as` is first-party, `render` is ui-sdk

Why two override APIs in one tree doubles the review surface. Solve first-party hosts take
`as="tag"` (`as="li"`, never `as={<li />}`), as in `docs/design/system.md`; ui-sdk primitives take
their `render` prop. Do not mix the two APIs.
