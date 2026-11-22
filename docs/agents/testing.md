# Testing

Source of truth: `vitest.config.ts` (unit `happy-dom`), `playwright.config.ts` (e2e against the
built stack), `vitest.setup.ts`. This file caches only the unwritten why and the gotcha the config
cannot say.

A test is done when it asserts `black-box` behavior, defines expected independently, and stays
`deterministic`.

## Naming — describe the behaviour

Why a spec that says `describe("sortLogEntries")` restates the export and fails when the function is
renamed, while a reader learns nothing about what the product does. Solve name the capability in
`describe` and the observable outcome in `it`:

```ts
describe("the tag list", () => {
  it("lists each tag once, alphabetically", () => {})
})
```

`it` is the only runner call; `describe` never takes a function or component identifier. The
`vitest/consistent-test-it` rule and `kk/no-describe-function-title` (both in `pnpm lint`, rules
live in `lint/`) fail on `test(...)` and on a lowerCamelCase `describe` subject, and the pre-commit
hook lints staged specs.

Apply two imagined edits before keeping a test. Break the behavior: it must fail. Change the
internals: it must stay green. A test that survives both earns nothing, and a second test of the
same property is a cost, not coverage.

Why a test gated on a local `dist/` protects nothing: the unit job never builds, so the gate skips
it in CI and a stale local build decides the local result. Assert built output in `e2e/` instead.

## Bug fixes — repro first

Why a fix without a failing run first may fix nothing. Solve paste the failing run, then fix, then
paste the passing run. The PR Evidence section carries both.

## Tiers — one branch per target

- **Logic `src/core/**`, `netlify/**`** Why pure `happy-dom` suffices. Solve keep in `happy-dom`,
  parameterize with `test.each`, inject RNG and time.
- **Components `src/features/**`, `src/ui/**`** Why component behavior needs DOM and user events.
  Solve mount with `renderToContainer` from `@testing/render` (`search-outcome-view.spec.tsx`),
  which renders into a detached container and disposes it after each test, then assert on text and
  structure (`querySelector`, `querySelectorAll`); a rendered component test needs no engine beyond
  `happy-dom`.
- **E2E `e2e/**`** Why smoke proves wiring across pages, hydration, and the edge function. Solve
  `playwright.config.ts` `webServer: pnpm preview` (the Netlify CLI builds and serves the production
  stack), wait on `html[data-hydrated]` — set by `onHydrationEnd` in `src/app.tsx` — before
  interacting, then assert via `toBeVisible` and `toHaveAttribute`. The preview command builds what
  it serves, so start it once and let `reuseExistingServer` reuse it; run `pnpm build` alone only
  when the prerendered output is itself the question.

## Mocking — mock the `boundary`, not the behavior

Why mocking internal code hides the behavior under test. Solve mock at the `boundary` with
`vi.stubGlobal` and `vi.spyOn` for `fetch`; prefer `better-result` injection over
`vi.mock("@core/...")`.

## Reliability — stay `deterministic`

Why flaky tests steal attention every run. Solve inject RNG and time via `vi.useFakeTimers` and
`vi.setSystemTime`, isolate module caches with `vi.resetModules`, and clean up rendered components
after each spec.

## Local server — reuse, never kill

Why an agent that stops a server destroys the developer's session and its own HMR state. Solve check
first with `curl -sf http://localhost:5173/`; if it answers, work against it. Never stop or kill a
server you did not start. If you must start one, leave it running when you are done or ask first.
`pnpm dev` serves 5173; `pnpm preview` and Playwright serve 4321.

## Visual probing — `scripts/probe.mts`

Why rendered geometry is the one claim the source cannot settle. Solve run the probe against a
server that is already up:

```sh
node scripts/probe.mts http://localhost:5173/about \
  --viewport=390x844 \
  --shot=/tmp/about-390.png \
  h1 header "[data-parallax]"
```

It waits for `html[data-hydrated]` before reading, prints every match of every selector, and exits 1
when a selector matches nothing.

- `--viewport=<width>x<height>` — required.
- `--scroll=<y>` — scroll to an offset after load.
- `--hover=<selector>`, `--focus=<selector>`, `--click=<selector>` — act on the first match, in that
  order.
- `--shot=<path>` — save a viewport screenshot; `--clip=<x>,<y>,<width>,<height>` crops it.
- `--wait=<ms>` — settle time after the last interaction.

Each row prints `getBoundingClientRect()` as `top`, `height` and `bottom`, plus computed `position`,
`display`, `transform` and `font-size`. Run multi-step sweeps (hover, scroll, timing) against
`pnpm preview`, because HMR reloads drop the execution context mid-sweep. Probing is a checkpoint,
not a per-edit step; [verification.md](verification.md) settles when the cost is worth it.
