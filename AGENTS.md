# Agents

Solid 2 portfolio with terminal and Bloomberg aesthetics, Tailwind CSS v4, TypeScript, served by
Vite with prerendered pages and Netlify functions.

## Coding rules

- Write code only; add comments only on request.
- Types over interfaces. Props: inline first, module-level for reuse. Fix at source instead of
  casting.
- Curly braces on all control statements.
- Import from the defining module; keep barrels out. Named imports only.
- Components own runtime data fetching and logic; take no environment or host config via props.
  Build-time content may pass from the route. Drop anywhere, works anywhere.
- Cover black-box behavior; white-box file tests earn nothing.

## Pointers

- `boundary` placement: route vs feature vs pattern vs core, see `docs/agents/architecture.md`
- `Specimen Panel` visual language: component, variant, color, see `docs/agents/design.md`, then
  `docs/design/system.md`
- `Quietly confident` intent and audience, see `docs/agents/product.md`
- `Review` diffs: names, imports, shape, see `docs/agents/review.md`
- `Standards` quality: declarative, composable, single source, see `CODING_STANDARDS.md`
- `Vocabulary` terms, see `GLOSSARY.md` plus `docs/agents/domain.md`
- `Decisions` that touch an ADR, see `docs/adr/`
- `Logs` for the `Passer-by`, see `docs/agents/prose.md` (cliché lint
  `scripts/prose/cliche-lint.mjs`)
- `Deterministic` `black-box` tests by tier, see `docs/agents/testing.md`
- `Rung` verification: cheapest check that settles the claim, see `docs/agents/verification.md`
- `Issues` tracking, see `CONTRIBUTING.md ## Workflow` (`gh` CLI; conventional commits)
- `ui-sdk` components: follow the ui-sdk skill when installed, read
  `node_modules/@ui-sdk/solid/docs/llms.txt`; for a new component search
  `node_modules/@ui-sdk/solid/docs/core.md` by heading, then read `rendering.md` beside it.
  First-party hosts use the same shape: a root plus parts as children, and `render` to change the
  element, never an `as` prop.

## Reply contract

- Short declarative sentences. Lead with what changes.
- Every claim carries evidence or a label: measured, inferred, or guess.
- Run the check here and paste the result. Push back when the evidence points the other way.

## Autonomy

- Proceed on reversible work; present the result for course-correction.
- Pause for irreversible writes: force-push to shared branches, deploys, deletions.
- Fan bulk work to subagents; keep summaries in the main thread. Fresh agent per retry with the
  prior report attached. Review every subagent diff.
