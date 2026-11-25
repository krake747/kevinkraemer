# Coding Standards

How we judge quality. Read during review, not implementation.

Enforced at diff time by `docs/agents/review.md`. Mechanical parts enforced by `pnpm lint`.

1. **Declarative.** State to UI without imperative branching. Prefer derived values and maps. Why:
   fewer branches. Solve: replace `if` cascades with a derivation.

2. **Composable.** Small blocks that pass the deletion test. Why: light callers. Solve: keep a file
   only if deleting it moves complexity into the caller.

3. **Composition first.** A root plus parts, filled with children. Why: no prop growth. Solve:
   content as children of named parts. No slot props (no `title`, `description`, `label`, `meta`,
   `action`, `rail`, `command`, or `JSX.Element` props). Variants via CVA. Element via `render`,
   never `as`.

4. **Single source per meaning.** One home, one import path. Why: one place to change. Solve: reuse
   the `ui/` component, `pattern/` drop-in, panel, token, or nav definition instead of hand-rolled
   HTML. Grep before adding: one meaning reads from one home; grep `src/ui/` then `src/pattern/`
   before writing a new element. Cross-`feature` reuse moves down to `src/pattern/`.

5. **Types over interfaces, named imports, no casts.** Why: catches drift. Solve: fix at source,
   import from the defining module, no barrels. Declare once; narrow at the use site with `Pick`,
   `Omit`, `Parameters`, `ReturnType`, `typeof`, or `v.InferOutput`. Parse at the `intake` with a
   valibot schema, then trust the type below it. Absence is `?`; `null` only for serialization and
   DOM boundaries; never `""`. Exception: `declare module` uses `interface`
   (`src/core/site/navigation.ts`).

6. **Explicit machines.** Agreeing flags are a discriminated union, not booleans. Why: flags admit
   impossible states. Solve: one `kind` field, transitions in one place, exhaustive `match` with
   `matchNever`.

7. **Named from speech.** Shared names pair a closed kind with a spoken or industry word. Why:
   inventions hide meaning. Solve: kind from `Page`, `Section`, `Row`, `Panel`, `Header`, `Heading`,
   `Column`, `Frame`, `Label`, `Rail` (new kinds only via `docs/design/structure.md`); leading word
   spoken in site copy, `docs/design/**`, or `GLOSSARY.md`, or the industry word. Compounds are
   parent plus part.

8. **Data lives where it renders.** State stays local; shareable state goes in the URL. Why: shared
   state couples and dies on reload. Solve: keep local; shareable in a search parameter; share
   through `src/core`; `derive`, never sync. Build-time data from the route bundle; runtime fetch in
   the rendering feature. Detail lives in `docs/agents/architecture.md`.

## Project: Solid plus Vite

Barrel for project extras. Loads on demand.

Run once, subscribe in JSX. Components run once to build the graph; reads live in JSX or memos.
Solve: never early-return on `isServer`; read signals and `index()` inside JSX; derive with memos;
key lists by stable id. See `docs/agents/review.md ## Hydration ids` and `## Lists`.

Control flow: see `docs/agents/review.md ## Control flow` (`kk/prefer-solid-control-flow`). Do not
use an em dash (U+2014) in documentation; recast the sentence with a comma, colon, full stop, or
parentheses.

Routing lives in `AGENTS.md ## Pointers`. Errors: see `docs/adr/0008-contracts-testing.md`.
