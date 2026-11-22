---
title: "Leaving Astro Islands for Solid 2.0"
description: >-
  How signals at work, a Blazor rewrite in React, and a new headless UI library for Solid 2 led me
  to move this site off Astro islands.
date: 2026-11-22
tags: ["site", "craft", "solid"]
---

I first ran into signals at work, when we upgraded an Angular app from version 15 to 16. Out of
curiosity I started experimenting with them. I never liked the boilerplate that came with private
variables, getters and setters. Signals just made sense to me: I set a value somewhere, and another
component reacts to it. Before that, I had to know how Zone.js monkey patches the browser, how
Angular's change detection runs, and what is reactive and what is not. Signals were reactive from
the start, and simple.

## Choosing React anyway

At my next job, the team had built a new app in Blazor. I knew Blazor and I gave it a fair chance,
but it is just too far behind the JavaScript ecosystem, and we kept running into UX issues. I had
already made a plan: if we ever got to rewrite it, we would do it right.

In an enterprise setting the choice was Angular or React. Solid was already on my mind, but it was
not a realistic option there. The team knew Angular, and so did I. So I built two small one-page
MVPs, one in Angular and one in React, and compared them. The React mental model won me over: how
components are built, how hooks work. It felt simpler. We would write React, and I would teach the
team how to write it properly.

The hardest part of the Blazor app had been its design system. There were no libraries, so the
components were black boxes with a huge number of props. React favours fewer props and children for
composition. shadcn/ui and the headless libraries in the React ecosystem showed me that structure. I
taught the team from [Thinking in React](https://react.dev/learn/thinking-in-react): break the UI
into components, keep state minimal, and put it with the closest common parent. That decided when to
lift state up and when to push it down. The goal was to avoid the same pitfalls we hit in Blazor.

## Why I kept looking back at Solid

Solid never left my radar. It is fast, and it is built on the signals approach I liked in Angular.
Signals kept showing up in Vue, in Svelte, almost everywhere, while React stayed out. I kept
noticing it, and it bugged me.

The blocker was simple: headless libraries. Work had me deep in React, rewriting most of the app by
hand just as agent mode started to appear. My time went to the rewrite and to keeping up with the
new agent tools and workflows. Nothing forced me to look at Solid, and the React libraries already
did the job.

That changed recently, when shadcn and Vercel Labs released [UI SDK](https://ui-sdk.dev/docs/solid),
built with Solid 2 in mind. That settled it for me. I finally had a reason to use Solid.

## Moving the site

The question became how hard it would be to move my own website from Astro to Solid 2.

The migration was pretty simple. I used two agents in OpenCode. The first, Muse Spark 1.3, got all
the Solid 2 docs I could find, Ryan Carniato's blog posts, and the skills that ship inside Solid's
packages. Together we wrote a migration plan. That plan then went, one step at a time, to a builder
agent running DeepSeek V4.1 Flash 1017 with one goal: port everything one to one and as closely as
possible. The port itself was done the same day I started it. That is how fast AI is nowadays.

Once the port was done, I went through the files and checked what was taken out, what was added and
which packages came in. Then I looked through
[Solid Primitives](https://primitives.solidjs.community) to see which of our handwritten pieces a
tested library could replace. The Solid-native cleanup took a few iterations over several evenings,
while I learned the new concepts.

## One framework

I have not missed anything since the move. What I love is that I no longer deal with Astro
components and React islands separately. I write one Solid component, and that is so much nicer to
work with. I really like Astro, but nothing beats working in one framework.

The tooling matters to me too. Astro has its own very specific compiler. Solid's new compiler from
Ryan is built in Rust and plugs nicely into the Vite ecosystem I already use, together with Oxfmt
and Oxlint. It fits my stack much better than Astro ever did, and I do not think I will go back.
Astro has its place, just not in my hobby projects.

## What I want to build next

Now that the whole site is one Solid app, I have room for small interactive toys. The first one I
have in mind is a place where anyone curious can ask questions about me.

Every question hitting an expensive language model would waste money. Daniel Kahneman and Amos
Tversky gave me the shape for the fix in _Thinking, Fast and Slow_. A fast "System 1" model like
[Jev](https://docs.typesafe.ai/concepts/how-to-build-with-system-one) triages in a fraction of a
second whether a question is actually about me. Real ones go on to the slower, more expensive
"System 2" model, the rest get a quick answer straight away.

That is the kind of thing I could not have built comfortably as an Astro island.
