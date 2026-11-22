---
name: delete-comment
description:
  Audit code comments into tautology, excuse, stale, or decision record, then delete, file issues,
  or move decisions to ADRs. Use when removing comments from a scope or enforcing the
  no-prose-comments guard.
---

# Delete comment

Repeatable comment removal for one scope at a time. Never run repo-wide without a named scope.

## Inventory

List every true comment in the scope. Most `//` hits are false positives: URLs in strings, regexes,
and XML strings are not comments. Check line starts only:

- Full-line `//`, `/*`, leading `*` in code files (`ts`, `tsx`, `css`); `<!--` counts only in
  `astro` files, where it can be a real comment. In `ts`/`tsx` a line-start `<!--` is string test
  data, not a comment.
- `scripts/` non-spec files are out of scope for the guard and the linter. Do not audit them;
  `scripts/**/*.spec.ts` files are linted and stay in scope.
- Confirm each hit by reading the file; record `path:line` for real ones only.

Test fixture strings (e.g. `<!-- comment -->` inside a template literal) are test data. Directive
lines (`oxlint-disable`, `eslint-disable`, `fallow-ignore`, `@ts-`, `@vite-ignore`,
`/// <reference>`) are tooling, not prose.

## Categorise

- `Tautology`: repeats what the code already says. Action: delete.
- `Stale`: describes code that no longer exists. Action: delete.
- `Excuse`: suppresses a guard around a hacky implementation (e.g. `fallow-ignore` on a boundary
  violation). Action: keep the suppression, file an issue to fix the implementation, link the issue
  from the tracking map.
- `Decision record`: non-obvious, hard-to-reverse reasoning (browser quirks, why a guard exists).
  Action: write an ADR per `docs/adr/README.md` (21-40 lines, Nygard shape), then delete or shorten
  the comment to a `See ADR-NNNN` pointer.

## Guard

Enforce TS/TSX with `pnpm lint` (`kk/no-prose-comments` in `lint/`); enforce CSS with
`pnpm check:comments` (`scripts/checks/no-prose-comments.mjs`). Ratchet rules:

- New prose comments fail the check. Fix the code or write the ADR.
- Test-data false positives are handled by the scope rules above.

## Estimate

Count shed lines before deleting: full-line comment blocks only, not directives or test data. Report
as `N lines across M blocks` so the PR description stays honest about how small the win is.
