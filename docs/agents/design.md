# Design

Visual language lives in `docs/design/`. Tokens and components stay the source of truth in
`src/app.css`, `src/features/log/prose.css`, `src/ui/**`, and the base layouts.

Why two axes: the system file answers "which component, which variant, which color", the page file
answers "what is this route for". An agent that reads only one ships a correct component with the
wrong job, or the right job hand-rolled.

System, four files:

- `system.md` — the character, the layer rule (what you may type into `class`), module shape, shared
  chrome. Read this first, always.
- `tokens.md` — color, type, surfaces, controls, forms: the condensed per-token rules.
- `structure.md` — how a page and a section open: command headers, grammar, prose sections.
- `motion.md` — easing, reveal cadence, reduced motion.
- `projects.md` — the `/projects` register and case page, kept as the worked example of a ruled
  exception.

When building UI, read `system.md` plus the one file the task touches. Positioning and audience:
`docs/agents/product.md`.

A new route carries no page file; it reads tokens plus structure directly. No module-level constants
for class strings; put classes inline on the element or in a CVA variant in `src/ui`.

A change is done when the `Specimen Panel` still reads as one system.
