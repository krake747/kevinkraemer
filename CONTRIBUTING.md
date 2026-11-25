# Contribute

How to set up and change this site. If you only want the product, start at the
[root README](README.md).

## Prerequisites

- Node from [`.node-version`](.node-version)
- pnpm pinned by `packageManager` in `package.json`.
- Doppler, only if you need `/ask` locally

## Setup

```bash
vp i
vp dev
```

Install also sets up the git hooks. Dev runs at http://localhost:5173. Search needs a built Pagefind
index, so run `vpr build` once before you test search.

## Secrets

`TYPESAFE_API_KEY` and `OPENAI_API_KEY` are needed for `/ask` and the MCP ask tool. They live in
Doppler, never in files.

- Local: `doppler run -- vp dev`, or any command that needs them.
- Deploy: Doppler syncs them into the Netlify environment variables.
- CI needs no keys: tests use fake keys and the static build does not read them.

Without keys, all works except `/ask`.

## Daily loop: `vp` first

Use `vp` for built-ins, `vpr` for repo scripts, `vpx` for one-off tools. The full script list is in
`package.json`; a normal change needs only these:

- `vp dev`: start the dev server
- `vp fmt` / `vp fmt --check`: format code, or check the format
- `vp lint --deny-warnings`: check code; the rules are in the `vite.config.ts` lint block
- `vpr lint:ts`: check types
- `vp test run --config vitest.config.ts`: run unit and browser tests; the test tiers are in
  [`docs/agents/testing.md`](docs/agents/testing.md)
- `vpx playwright test`: run e2e tests on the production build (one-time
  `vpx playwright install --with-deps chromium`)

`src/generated` rebuilds on dev, build, and type-check. Run `vpr generate` again if content looks
old.

## Verify before you push

```bash
vpr verify
vpx playwright test
```

When you work, run only the test tier for your changed files. Write in the pull request what you ran
and what you left for CI. The rules for this are in
[`docs/agents/verification.md`](docs/agents/verification.md).

## Hooks and CI

- What runs on commit and push is in [`lefthook.yml`](lefthook.yml).
- What runs on pull requests and `main` is in [`.github/workflows/`](.github/workflows/).
- How to read a result is in [`docs/agents/verification.md`](docs/agents/verification.md).

## Workflow

- Use conventional commits. Stage exact paths and check `git diff --stat` before you commit.
- Work lives in GitHub issues and is managed with `gh`. Open an issue before a pull request; do not
  use pull requests to discuss what to build.
- Read the area before you change it: [`docs/agents/architecture.md`](docs/agents/architecture.md)
  for boundaries, [`docs/agents/testing.md`](docs/agents/testing.md) for test tiers,
  [`docs/agents/review.md`](docs/agents/review.md) for naming and imports, and
  [`CODING_STANDARDS.md`](CODING_STANDARDS.md) for quality rules.
- Design changes follow [`docs/design/system.md`](docs/design/system.md) and the topic file it
  points at.
- If a choice is hard to undo, write an ADR before you code. See
  [`docs/adr/README.md`](docs/adr/README.md).
- Logs are written for the Passer-by. Follow [`docs/agents/prose.md`](docs/agents/prose.md).

## Deploy

Netlify builds and serves the prerendered client plus the `/ask` and `/mcp` function. Details are in
[`docs/runtime.md`](docs/runtime.md).
