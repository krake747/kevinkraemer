# docs/agents

Steering documents for agents working in this repo. Source of truth: `AGENTS.md ## Pointers`; a
change is done when every file has a pointer home. `AGENTS.md` at the root is the always-loaded
index; every file here is reached through a pointer there.

## Conventions

- **One file, one audience, one job.** A file earns its place when deleting it would _move_
  complexity into the caller, not merely _concentrate_ it.
- **Environment is the source of truth.** `src/app.css`, `package.json`, `tsconfig.json`,
  `docs/adr/` are authoritative. Cache here only the unwritten why and gotcha.
- **High-level first.** Docs state the principle, not the implementation. Specifics live in the
  owning file named under Source of truth; prose here keeps only the why and the gotcha.
- **Mirror nothing.** Do not restate a config value, a crawler list, a hydration directive, or a
  build output. Name the file that owns it and keep the reason it exists. If a sentence would need
  editing after a config change, it belongs in the code, not in a doc.
- **Keep pointer targets small.** Prefer short, flat reference that an agent can consume on demand.
  Visual language lives in `docs/design/` (system, tokens, structure, motion, projects); `design.md`
  in this folder is a short pointer there.

## Standards

Quality rules live in `AGENTS.md ## Coding rules` plus `CODING_STANDARDS.md`, enforced at diff time
by `docs/agents/review.md`. Automated checks (`agent-files.spec.ts`, `check:docs`, oxlint, lefthook,
`tsc`) outrank docs.

## Inventory

Routed via `AGENTS.md ## Pointers`, including `product.md`.

Reference docs that humans also read live in `docs/`, including `docs/design/`. `AGENTS.md`
registers a pointer only where agents plausibly touch the area; the rest stay unregistered by
design.
