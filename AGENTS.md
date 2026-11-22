# Agents

Solid 2 portfolio with terminal and Bloomberg aesthetics, Tailwind CSS v4, TypeScript, served by
Vite with prerendered pages and Netlify functions.

## Coding rules

- Do not write any comments unless asked for.
- Types over interfaces. Props: inline first, module-level for reuse. Never cast. Fix at source.
- Curly braces on all control statements.
- Named imports only, from the defining module. No barrels.
- Components own their runtime data fetching and logic; no props for environment variables or host
  config. Build-time content may be passed from the route. Drop anywhere, works anywhere.
- Tautological and white-box file tests considered harmful.

## Pointers

- Building the app, see `src/routes/` for pages and `src/features/` for sections. Before using
  ui-sdk, follow the ui-sdk skill if it's installed, and read
  `node_modules/@ui-sdk/solid/docs/llms.txt`. To build a new component, also search
  `node_modules/@ui-sdk/solid/docs/core.md` by heading, and read `rendering.md` next to it.
- Building UI (layout, spacing, color, type, motion, components), see `docs/agents/design.md`
  (system, tokens, structure, motion in `docs/design/`)
- Product intent and audience, see `docs/agents/product.md`
- Placing code, state, and data by boundary, see `docs/agents/architecture.md`
- Reviewing diffs, see `docs/agents/review.md` (naming, imports); standards see
  `CODING_STANDARDS.md`
- Naming, see `GLOSSARY.md` plus `docs/agents/domain.md`; ADRs see `docs/adr/`
- Writing Logs for the Passer-by, see `docs/agents/prose.md` (cliché lint
  `scripts/prose/cliche-lint.mjs`)
- Testing tiers and queries, see `docs/agents/testing.md`
- Settling a claim before calling it done, see `docs/agents/verification.md`
- Tracking issues, see `CONTRIBUTING.md ## Workflow` (`gh` CLI; conventional commits)

## Reply contract

- Short declarative sentences. Lead with what changes.
- Every claim carries evidence or a label: measured, inferred, or guess.
- Never hand over a check that can be run here. Push back when the evidence points the other way.

## Autonomy

- Proceed on reversible work; present the result for course-correction.
- Pause for irreversible writes: force-push to shared branches, deploys, deletions.
- Fan bulk work to subagents; keep summaries in the main thread. Fresh agent per retry with the
  prior report attached. Review every subagent diff.
