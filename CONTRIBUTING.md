# Contribute

Setup and workflow for changing this site. If you only want the product, start at the
[root README](README.md).

## Prerequisites

- Node from [`.node-version`](.node-version)
- pnpm pinned by `packageManager` in `package.json`. Run `corepack enable` once if `pnpm --version`
  is older.
- Doppler, only if you need `/ask` and the MCP ask tool locally

## Setup

```bash
pnpm install
pnpm dev
```

`pnpm install` also installs the Lefthook git hooks. The dev server runs at http://localhost:5173
and serves the pages plus the two request-time routes, `/ask` and `/mcp`. Playwright starts the
production stack on port 4321 instead.

Search reads a built Pagefind index, so `pnpm dev:search` builds before starting the server.

## Secrets

`TYPESAFE_API_KEY` and `OPENAI_API_KEY` drive `/ask` and the MCP ask tool. They live in Doppler,
never in files.

- Local: `doppler run -- pnpm dev`, or any command that needs them. `doppler.yaml` points at the
  project and config; run `doppler setup` once.
- Deploy: Doppler syncs the config into the Netlify environment variables.
- CI needs none: tests stub keys and the static build does not read them.

Without keys everything except the ask surface works. `/ask` returns 503 and the ask tool reports
that it is not configured.

## Commands

| Command                    | Action                                                     |
| -------------------------- | ---------------------------------------------------------- |
| `pnpm dev`                 | Dev server, request-time routes included                   |
| `pnpm dev:search`          | Build, then dev, so Pagefind has an index                  |
| `pnpm build`               | Prerendered build into `dist/client/`                      |
| `pnpm preview`             | Build and serve the production stack with the Netlify CLI  |
| `pnpm lint`                | oxlint, including the local `kk/*` rules (`lint/`)         |
| `pnpm fmt` / `pnpm fmt:ci` | Format, or check formatting across the repo                |
| `pnpm test`                | Unit tests                                                 |
| `pnpm test:unit`           | Unit tests                                                 |
| `pnpm test:unit:coverage`  | Unit tests with the `src/core` thresholds                  |
| `pnpm test:e2e`            | Playwright smoke suite against `pnpm preview`              |
| `pnpm verify`              | `fmt:ci`, `lint`, `lint:ts`, `fallow audit`, `test:unit`   |
| `pnpm check:prose`         | Log formatting and the cliché lint                         |
| `pnpm check:docs`          | Doc paths, relative links, and `pnpm` script names         |
| `pnpm check:agents`        | Retrieval agents allowed in `robots.txt` (`--live` probes) |
| `pnpm generate`            | Rebuild the generated content and ask tape                 |
| `pnpm lint:ts`             | Generate and run `tsc --noEmit`                            |

`pnpm lint` also runs the native rules `curly` (all), `typescript/consistent-type-definitions`
(type), `typescript/consistent-type-imports` (inline type-imports), `unicorn/filename-case`
(kebabCase), and `vitest/consistent-test-it`, plus these `kk/*` rules: cva-class-prop,
no-describe-function-title, strict-types, no-prose-comments, feature-names, no-class-string-const,
component-props-omit, no-styles-import, alias-imports, no-transition-all, no-raw-color,
no-separate-leading, and route-shape. `pnpm verify` runs `fallow audit`, which uses the
`.fallowrc.json` `boundaries` and the `fallow-policy/imports.json` `edge-no-aliases` pack.

Playwright browsers are a one-time install: `pnpm exec playwright install --with-deps chromium`.

The generated content bundle and ask tape live in src/generated, rebuilt by `pnpm generate` on every
dev, build, and type-check run.

## Hooks and CI

Lefthook runs on commit:

- pre-commit: oxlint and oxfmt on staged files (including staged `scripts` specs), the cliché lint
  on staged log entries, the docs and CSS-comments checks, and `fallow audit --base main`
- pre-push: `pnpm lint:ts`
- commit-msg: commitlint

CI splits by trigger, mirroring `next-bite`: `pr.yml` verifies pull requests (a filter job skips
docs-only changes, then static checks, unit tests, E2E, build, and docs run in parallel behind a
gate), `main.yml` runs the same gate on pushes to `main` plus coverage (a summary on the run page
and the report as a downloadable artifact), and `lighthouse.yml` runs Lighthouse on a Sunday-morning
schedule or by hand. `is-agentic.yml` audits agent readiness against production on the same
Sunday-morning schedule or by hand. E2E and Lighthouse run against `pnpm preview`, which builds and
serves the production stack.

## Verify before you commit and push

```bash
pnpm verify
pnpm test:e2e
```

Run the full suite before a push. While iterating, run the tier that covers the file you changed;
[`docs/agents/testing.md`](docs/agents/testing.md) maps the tiers.

## Workflow

- Conventional commits, enforced by commitlint. Stage exact paths and read `git diff --stat` before
  committing so every hunk is attributable.
- Work lives in GitHub issues and is managed with `gh`. Open an issue before a pull request; pull
  requests are not a triage surface.
- Read the area before changing it: [`docs/agents/architecture.md`](docs/agents/architecture.md) for
  boundaries, [`docs/agents/testing.md`](docs/agents/testing.md) for test tiers,
  [`docs/agents/review.md`](docs/agents/review.md) for naming and imports, and
  [`CODING_STANDARDS.md`](CODING_STANDARDS.md) for quality rules.
- File names: `kebab-case.tsx` for components (`stack-row.tsx`), `kebab-case.ts` for modules,
  `use-*` for single-hook modules; component exports stay `PascalCase`. A feature file names its
  part, not its folder (`log/card.tsx` exports `LogCard`); see `docs/agents/review.md`. Import
  through the `@` aliases everywhere except `netlify/edge-functions/`, which stays relative.
- Design changes follow [`docs/design/system.md`](docs/design/system.md) plus
  [`tokens.md`](docs/design/tokens.md), [`structure.md`](docs/design/structure.md), or
  [`motion.md`](docs/design/motion.md) for the touched topic.
- A decision that is hard to reverse gets an ADR before the code lands. See
  [`docs/adr/README.md`](docs/adr/README.md).
- Logs are written for the Passer-by. Follow [`docs/agents/prose.md`](docs/agents/prose.md) and run
  `pnpm check:prose`.

## Deploy

Netlify builds with `pnpm build` and serves `dist/client/` plus the function emitted at
`dist/functions/api.mjs` for `/ask` and `/mcp`. The `markdown` edge function routes by directory
convention plus the inline `config.path = "/*"` in `netlify/edge-functions/markdown.ts`. See
[`docs/runtime.md`](docs/runtime.md).
