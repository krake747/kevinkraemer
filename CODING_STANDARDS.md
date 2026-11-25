# Coding Standards

How we judge project and code quality.

1. **Declarative.** State to UI without imperative branching in handlers. Prefer derived values and
   maps. Why: fewer branches to maintain. Solve: replace `if` cascades with a derivation.

2. **Composable.** Small blocks that pass the deletion test. Why: keeps callers light. Solve: a file
   stays only if deleting it moves complexity into the caller.

3. **Composition first.** A root plus parts, filled with children. Why: composes without prop
   growth. Solve: render content as children of named parts. No slot or content props (no `title`,
   `description`, `label`, `meta`, `action`, `rail`, or layout `command` props, and no `JSX.Element`
   props). Variants via CVA. Change the element with ui-sdk `render`, never an `as` prop.

4. **Single source per meaning.** One home, one import path. Why: one place to change. Solve: reuse
   the existing `ui/` component, `pattern/` drop-in, panel, token, or nav definition instead of
   hand-rolled HTML. Audit before adding a literal or element: grep it — one meaning reads from one
   home (`canonicalFor`, `EMAIL`), and grep `src/ui/` then `src/pattern/` before writing a new
   element. Cross-`feature` reuse moves down to `src/pattern/`.

5. **Types over interfaces, named imports, no casts.** Why: catches drift early. Solve: fix at
   source, import from the defining module, no barrels. Declare a shape once; narrow it at the use
   site with `Pick`, `Omit`, `Parameters`, `ReturnType`, or `typeof`, and with `v.InferOutput` where
   a schema owns it. Encode absence as `?` on props and params; reserve `null` for serialization and
   DOM boundaries; never `""` for a missing value. Exception: `declare module` augmentation uses
   `interface` because TypeScript declaration merging cannot use `type`
   (`src/core/site/navigation.ts`).

6. **Explicit machines.** Flag combinations that must agree are a discriminated union, not booleans.
   Why: independent flags admit impossible states. Solve: one `kind` field, transitions in one
   function or reducer, exhaustive `match` with `matchNever`.

## Project: Solid plus Vite

Barrel for project-specific standards. Why: keeps `CODING_STANDARDS.md` small and lets each question
load only when needed. Control flow in JSX uses Solid's `Show`, `Switch`/`Match` and `For`, never
ternaries, `&&` or `.map`.

Routing lives in `AGENTS.md ## Pointers`. Project-only extra: for errors (how failures propagate),
see `docs/adr/0008-contracts-testing.md`.
