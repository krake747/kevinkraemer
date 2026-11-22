---
title: "Keep Agent Context Small"
description: >-
  Small AGENTS.md and clear pointers help every run start the same way. Here is how I keep mine
  small and why it matters.
date: 2026-08-30
tags: ["agents", "craft"]
---

At first, I was just chatting with the model. I would ask a question, get an answer, and move on. By
the next turn, the conversation had already moved forward, and the context I had built up was mostly
gone. Agent mode behaved differently. It kept files, ran tools, and remembered the task. Once I
understood that it loads `AGENTS.md` on every run, I started treating that file as an index that
points to where the answer lives. I optimised this approach after watching
[Never Run claude /init](https://www.youtube.com/watch?v=9tmsq-Gvx6g).

I tried different styles for the index in this portfolio and in a Zettelkasten repo. I also tried
them in a [small skills collection](https://github.com/krake747/skills) and in a synthetic monorepo
with Rust and Go services. Over the past few months, one approach remained. This is a note from
those experiments.

## Why small helps

If the file is too small, intent is hidden. If it is too big, every task pays for it. I keep what
loads every time to rules that apply everywhere. In the repository that builds this site, that means
46 lines. A short header, six coding rules, and ten pointers cover design, product, architecture,
review, naming, prose, testing, verification, and the issue tracker. Two short sections at the end
set how the agent replies and when it should stop and ask.

The principle is simple: one home for one meaning. The codebase is the source of truth for the
pointer documents. I amend them only when I notice a repeated bad pattern from the agent.

## Pointers are an index, not nudges

Pointers keep the index short and put detail close to where it belongs. Each question has its own
file, so the agent only loads the context the task needs. You can see this in the trace. `AGENTS.md`
is loaded every turn, but the files in `docs/agents/**.md` only get read when the task calls for
them. That was the behaviour I wanted: keep the starting context small and bring in the details when
they are useful.

While working in finance, I came across [nudge theory](https://en.wikipedia.org/wiki/Nudge_theory)
through Thaler and Sunstein. The basic idea stuck with me: make the better choice easier without
taking the other choices away. I tested whether a line in the index could work that way. For a few
days, I watched the agent write TypeScript without braces around single-statement `if`s. The
language allows it, and an [`oxlint`](https://oxc.rs/docs/guide/usage/linter/rules/eslint/curly)
rule fixed it every time. It worked, but the fix was noisy, so I added:

> Curly braces on all control statements.

to the index. That is not a nudge. It removes an option, and the linter enforces it. I do not love
imperative rules, but the braces make branches clearer. More importantly, subsequent agent runs
followed the rule without needing a lint pass to correct them. Pointers are not nudges either. They
do not steer a choice. They disclose where to look so the right context can load just in time.

## Checks outrank docs

Documentation tells the agent what I want, but checks make sure it happens. Fast feedback makes the
right path the easy one. In TypeScript codebases like this one,
[Lefthook](https://github.com/evilmartians/lefthook) runs fixes in parallel on staged files, and I
run the checks that match the job rather than always running the entire suite.
[`oxlint`](https://oxc.rs/docs/guide/usage/linter),
[`oxfmt`](https://oxc.rs/docs/guide/usage/formatter), and `tsc` cover style, formatting, and types,
while [`fallow`](https://fallow.tools) covers architectural boundaries. I do not want the agent to
run the full suite unchanged after every edit. The cheapest relevant feedback should come first.

Noisy fixes are useful signals. If the same correction keeps happening, that suggests a missing rule
or missing context. Add it to the right place instead of hoping the agent remembers it.

## Pruning as a habit

Small files naturally grow. When I find a rule duplicated between the index and a pointer document,
I delete it from the index and leave the pointer. Adding another note wherever I happen to be
working is tempting, so I try to pause and point instead.
