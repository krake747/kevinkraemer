# Review

Mistakes to avoid going forward. Checked at diff time. Project and code quality live in
`CODING_STANDARDS.md`. Implementation agent ignores this file.

Review enforces the standards. Each section cites its parent standard or owning doc. Mechanical
parts defer to `pnpm lint`; prose here keeps only the why and the smell.

Source of truth: `tsconfig.json` paths, `src/features/**` and `src/pattern/**` file lists,
`netlify/edge-functions/**`.

A diff is done when names and imports sit behind their `boundary`.

## Pattern: generic behavior, glossary names (Standards 3, 4)

Why a shared folder drifts into a second features tree: anything used by two slices looks homeless,
but a component that hardcodes domain copy couples every consumer to that domain. Solve keep
`src/pattern/**` free of hardcoded routes, feeds, and narrative copy; structural components take
their names from `GLOSSARY.md` and the caller fills them with children of those parts, not through
content props or slots. A component that names a route, a feed, or a site narrative lives in the
feature that owns it, even with two consumers. Boundary detail lives in `architecture.md`. Check via
`grep -rn 'href="/' src/pattern`: a hardcoded route is the smell.

## Change shape: smallest deletion-first diff (Standards 2)

Why abstractions and layers compound: each added seam is a read on every future visit. Solve bias to
deletion and the smallest change that solves the problem; collapse one-caller wrappers, shrink
mutable scope. When two fixes fail behind the same premise, write the premise down and test it
directly before a third fix that assumes it. Check via `git diff --stat`: a diff that only adds
files is the smell.

## Types: one declaration, derive at the use site (Standards 5)

Why a second literal copy compiles when the owner grows a field, so the copy keeps claiming the old
surface. Solve declare each shape where it is owned, then narrow at the use site with `Pick`,
`Omit`, `Parameters`, `ReturnType`, or `typeof`, and with `v.InferOutput` where a valibot schema
owns it. Check via `git diff main -- src | grep "^+type .* = {"`: a new literal whose fields already
sit on a type the file imports is the smell. Renders children take `ParentProps` (or
`ComponentProps`, which carries them); data-only components take `VoidProps`
(`kk/component-props-omit`, `kk/no-content-element-props`). A new component whose body never reads
`props.children` but whose props lack `VoidProps` is the smell.

## File naming: kebab-case, the folder names the part (Standards 2, 4)

Why repeating the feature in every file makes `log/log-card.tsx` read twice and puts the same word
in the path and the identifier. Solve name every file in `src/features/{feature}/` after its part,
not the feature: `log/entry-panel.tsx` exports `LogEntryPanel`. The file named exactly
`{feature}.ts(x)` is the feature entry and exports the component of that name. Name a builder
`create-{part}.ts` and export `create{Feature}{Part}`. Keep `use*` for router and context readers
only, which arrive named. Enforced by `pnpm lint` (`kk/feature-names` in `lint/`), which fails a
file that repeats its folder or a component that is not `{Feature}{Part}`.

## Page parts: one stem per page (Standards 2, 3)

Why a predictable part vocabulary lets an agent find a page's header, summary or row without opening
the route, and keeps two parts from reading the same in a grep. Solve name the route export
`{Name}Route` and compose feature parts there; prefix every part with the same stem (`CvHeader`,
`CvSummary`, `ProjectList`); end a section wrapper in `Section`. Omit the parts a page does not
have. A part that two pages need moves down to `src/pattern` or `src/ui` (`architecture.md`) instead
of losing its stem in place. Enforced by `pnpm lint` (`kk/feature-names`, `kk/route-shape`,
`kk/route-seo-path`): a component without its page stem is the smell.

## Shared names: spoken, industry, never invented (Standards 7)

Why compounded names drift into private language: a reader who was not in the room cannot tell a
domain word from an invention. Solve name every shared component in two slots: a kind suffix and a
leading word. The kind comes from a closed vocabulary (`Page`, `Section`, `Row`, `Panel`, `Header`,
`Heading`, `Column`, `Frame`, `Label`, `Rail`), and a new kind earns its place only by being
documented in `docs/design/structure.md` first. The leading word is either already spoken (in site
copy, `docs/design/**`, or `GLOSSARY.md` (`Register`, `Record`, `Document`, `Terminal`)) or the
industry's word for the shape (`PageHeader` per Primer, `Stack` per Chakra, `Disclosure` per the
WAI-APG pattern). Compounds are parent plus part (`RegisterRow`, `DocumentSectionBody`); a part
whose parent does not exist is the invention to kill. One-caller wrappers collapse into the call
site instead of earning a name. Element mapping lives in `docs/agents/html-semantics.md`. Check via
`grep -rin` of the leading word across `content/`, `src/routes/`, and `docs/`: no hits outside the
component is the smell.

## Import alias: use `@scope/*` except `edge` (Architecture)

Why `@scope/*` aliases shorten paths and survive moves. Solve import via the `@scope/*` aliases
defined in `tsconfig.json`: every module import in `src` uses one, even within a single folder; keep
`netlify/edge-functions/**` on relative imports only, no `@` alias. The alias exceptions live in
`architecture.md`. Enforced by `kk/alias-imports` and the Fallow pack `edge-no-aliases`.
Orchestrator and chrome leaves may import across features; do not treat those as boundary
violations.

## Import order: packages, then aliases (Tooling)

Why one order means a reader never scans a file twice to find where a name came from, and a moved
import is noise in an otherwise focused diff. Solve one block with no blank lines; let `vp fmt`
decide path order: do not hand-sort `solid-js` to the top. Inside one import, values come before
`type` bindings, and a binding list of nothing but types is `import type`. No layer order is imposed
between alias scopes. Check via the head of the file: a blank line inside the block, or `{ type X }`
as the only binding is the smell.

## Icons: one home, no `aria-hidden` (Standards 4)

Why duplicated icon sets drift in stroke and size. Solve import icons from `src/ui/icon.tsx` and
drop `aria-hidden` where the component already sets it. Enforced by `pnpm lint`. Each export there
is a vendored Keyline drawing named `{Name}Icon` (`ZapIcon`, `HashIcon`); a new icon keeps that
suffix.

## Lists: keep row identity, derive the visible set (Standards 1)

Why a rebuilt row loses its DOM, focus and animation, so `For` matches by object identity and a
fresh object per fetch rebuilds every row. Solve key lists that arrive from a fetch by their stable
id and derive filters and sorts in a memo over the same items; read `index()` inside JSX, never once
at the top of the callback. Check via `grep -n "<For" src`: a list of fetched records without
`keyed` is the smell.

## Control flow: Show, Switch, For (Standards 1)

Control flow in JSX uses Solid's `Show`, `Switch`/`Match` and `For`, never ternaries, `&&` or
`.map`. Enforced by `kk/prefer-solid-control-flow`.

## Async reads: promise in a memo, failure in `Errored` (Standards 1, 6, 8)

Why a loading flag or a `{ failure }` union turns every reader into a branch. Solve let the memo
body return the promise, put `Loading` around the first value and `isPending` on a refetch, and
throw when the response is unusable so the nearest `Errored` renders the retry. Keep a value only
for an expected outcome the caller renders differently. Check via
`grep -n "Errored\|isPending" src`: an async read with a hand-rolled loading boolean is the smell.

## Hydration ids: same primitives on both sides (Standards 3)

Why Solid pairs prerendered markup with client nodes by a sequential hydration id, so a hook that
creates fewer reactive primitives on the server than in the browser shifts every id after it. Solve
never early-return on `isServer` inside a component or hook: the primitives are SSR-safe and must
run on both sides. Render content as children of a part; do not pass JSX through a named prop.
`children` is claimed in place and needs no thunk. Check via `pnpm dev` with the console open:
hydration mismatch warnings mean an id moved. Search parameters are absent while prerendering, so
gate `useSearchParams` reads until after settle and filter only after that.

## Polymorphism: one API: `render` (Standards 3)

Why two override APIs in one tree doubles the review surface. Solve every host, first-party or
ui-sdk, changes its element with `render`, never an `as` prop. A function passed to `render` must
forward the supplied props, as in `node_modules/@ui-sdk/solid/docs/parts-and-composition.md`. The
override sees the shared `RenderProps` subset (`ref` and `on*` handlers stay on the default tag so
the props spread across element families); extend it where a host forwards more, as `Badge` does
with `target`/`rel`. The tag still has to stay inside one semantic family
(`docs/agents/html-semantics.md`).
