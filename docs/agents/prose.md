# Writing Logs for the Passer-by

Source of truth: `content/logs/*.md`, `src/features/log/prose.css`, `GLOSSARY.md` **Logs** /
**Passer-by**, `docs/design/tokens.md`, `src/features/log/graph-flow.tsx` with data in
`src/core/content/graphs.ts` for graph directives (`:::graph-flow`, `:::graph-table`).

A Log is done when a **Passer-by** can act without the manual. **Logs** are log entries under
`tail -f ~/logs`, not a blog roll. Each entry stands alone.

## Voice: diary, not prescription

Why diary earns trust. Solve write as `I` per `On Having Something Visible` (`I tend`, `I try`,
`I like`), mostly short sentences, one idea per sentence, with one longer sentence per section for
rhythm. Open each entry with one concrete scene anchor: where, when, what is on screen. Vary
sentence openers: no more than two `I`-led sentences in a row. No `you should`, no
`I know how tempting` lecture, no `On one side... On the other...` balance.

## Structure: the default arc

Why a Passer-by needs orientation before argument. Solve open with how you work today (concrete
input, your check, one scope line plus one scene anchor), then history that earns the view, then the
current chain, then the bottleneck in one line, then your operating model, then the visual, then the
close. This arc is the default, not the template; break it when the story needs it. Repetition of
the same arc across entries reads robotic. Entries stay standalone; tags are the series thread. New
tags need a reason; reuse links Related logs.

## Terms: define once, reuse exactly

Why drift forces re-reads. Solve define post-local models (`brief`, `slice`, lanes) at first use,
then reuse the exact words for diagram labels and first mention per section; elsewhere prefer
pronouns and variation to avoid echo. Align diagram labels with prose terms before writing around
them, and restate every lane label verbatim in the fallback so RSS/`.md` readers get the figure.
Keep headings in one register per entry (all principle-shaped or all memoir-shaped).

## Type: quotes versus code

Why `prose.css :not(pre) > code` pill signals system (Mono) versus human (Geist) per
`docs/design/tokens.md`. Solve:

- `“ ”` curly quotes for rule text: `“Curly braces on all control statements.”`
- `` `AGENTS.md` `` for file, `tail -f ~/logs` for command, `oxlint`/`tsc`/`fallow audit`/`Lefthook`
  as system only when as tool invocation
- Define once: `AGENTS.md (hereafter the index)` at first use, then `the index` anaphora

## Dashes and repetition

Why em dashes and repeated pills cost attention. Solve recast the sentence with a comma, colon, full
stop, or parentheses; do not use an em dash (U+2014). Keep the hyphen only in compounds
(`single-statement`). When a duplication lives in both the index and a pointer doc, delete copy in
the index and leave the pointer.

## Evidence: one receipt per claim

Why assertions glide past without a picture. Solve attach one observable per claim: a count, a
trace, a named loss, a same-day habit. Name the mechanism, not the feeling. Never invent numbers;
cut the claim before fabricating the receipt.

## Cliché lint: LLM tells

Why model text performs instead of saying. Solve run `pnpm check:prose` (wraps
`scripts/prose/cliche-lint.mjs`; patterns live in `scripts/prose/cliche-patterns.mjs`). Frontmatter,
fenced code, inline code, and HTML comments are blanked before matching; link markup is reduced to
link text. Disable noisy patterns per file:
`node scripts/prose/cliche-lint.mjs --disable colon-triple`.

## Checks outrank docs: Logs slice

Why Logs need fast feedback, not full suite. Solve run only staged checks:
`vp fmt --check "content/logs/**/*.md"` (see `package.json check:prose`) and
`node scripts/prose/cliche-lint.mjs` (see `package.json check:prose`); `lefthook` pre-commit runs
the cliche lint on staged `content/logs/*.md`. Keep `oxlint`/`fallow audit` for `*.ts` via the
`lefthook` pre-commit hooks and `tsc` via the `lefthook` pre-push hook, not for Logs.
