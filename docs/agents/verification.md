# Verification

Source of truth: `lefthook.yml`, `.github/workflows/`, `package.json` scripts, the `vite.config.ts`
lint block, `lint/`. This file caches only the judgement the gates cannot state.

A change is done when the claim carries the check that settled it.

## Prefer the cheapest rung

Why a probe costs a server, a browser and the developer's attention, while a test costs a second.
Solve work down this list and stop at the first rung that can settle the question:

1. The narrowest unit test that would fail if the claim were false, or `pnpm lint:ts`.
2. `pnpm fmt:ci`, `pnpm lint`, `pnpm check:docs` on the touched paths.
3. `pnpm preview` plus `scripts/probe.mts` against it.

If a visual claim can be pinned as a unit test, write the test: it is cheaper and it stays.

`pnpm lint` runs native rules (`curly` all, `typescript/consistent-type-definitions` type,
`typescript/consistent-type-imports` inline type-imports, `unicorn/filename-case` kebabCase,
`vitest/consistent-test-it`) plus `kk/*` (`lint/`): cva-class-prop, no-describe-function-title,
strict-types, no-prose-comments, feature-names, no-class-string-const, component-props-omit,
no-styles-import, alias-imports, no-transition-all, no-raw-color, no-separate-leading. Fallow checks
are `fallow audit` against `.fallowrc.json` `boundaries` and `fallow-policy/imports.json`
`edge-no-aliases`.

## A probe settles a prediction

Why a probe with no stated expectation has nothing to settle, so any number reads as an answer.
Solve read the component and its breakpoint variants first, then state the expected value and the
declaration that sets it: the gutter, the width, the transform, the wrap point. Probe after that,
and treat a mismatch as a finding about the source or the prediction, not as noise.

## Start the app at a checkpoint

Why a server per edit spends the session on noise (HMR reloads, timing) and duplicates evidence.
Solve start it when the developer asked, when the claim needs measurement the source cannot give
(wrapping, overlap, viewport-relative sizing, motion over time), or when the prediction failed in a
way the source cannot explain. Nothing needs probing before an edit. When one is warranted, follow
the server rule in [testing.md](testing.md): reuse a server that is already up, never kill one you
did not start.

## What the gates already run

Why hand-running these in a session duplicates them and hides the one check that is actually
missing. Solve run only the narrowest check that supplies the signal you lack.

| Stage      | Runs                                                                                                                                                                                              |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pre-commit | oxlint and oxfmt on staged files (plus staged `scripts` specs), cliché lint on staged log entries, `check:docs`, `check:comments` (CSS), `fallow audit --base main`, `fallow health --complexity` |
| pre-push   | `pnpm lint:ts`                                                                                                                                                                                    |
| `pr.yml`   | `fmt:ci`, `generate`, `lint`, `lint:ts`, `fallow audit`, `test:unit`, `test:e2e`, `build`, `check:docs`                                                                                           |
| `main.yml` | the `pr.yml` set plus `test:unit:coverage`                                                                                                                                                        |

A docs-only pull request skips every code job: `pr.yml` filters on changed paths, so `check:docs`
alone carries it.

## Claiming done

Why a skipped check reported as green erodes every later claim. Solve state what ran and what did
not: the commands, the rungs skipped, and the checks CI will run instead. Never present a skipped
check as evidence.
