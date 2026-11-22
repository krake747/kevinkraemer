---
title: "Software Changed, but the Process Stayed the Same"
description:
  "Agents changed how software gets made, but most teams still work through a chain of handoffs. How
  I went from owning every step to working inside that chain, and how I own my part of it."
date: 2026-09-06
tags: ["agents", "craft"]
---

At work, my day starts with a ticket. By slice I mean one request I own from start to finish, from
the need to the shipped change.

A coding agent drafts the design, the code and the tests in my editor. I check the behaviour first
and the code second. On my own projects, I often run several agent sessions at once, each on its own
slice.

Agents take the tactical work of drafts, variants, and tests. I keep the strategic choice of what
the slice covers and where it lives.
[Matt Pocock names a similar split between tactical and strategic work](https://x.com/mattpocockuk/status/2057110441864696164).
I rarely write code by hand now. Most of my time goes into rewriting the ticket when the draft
misses, rejecting what does not fit, and moving boundaries the agent put in the wrong place.

## The solo slice

At my previous firm, my mornings belonged to the client. I read the email that came in overnight,
investigated why something had gone wrong, and worked with the client until we agreed on how a value
was computed or how an investment guideline was set up. After a check-in with the team, I produced
the risk reports. My afternoons belonged to the code. I took what the client had asked for and built
it. I also modernised older parts of the code base.

Working with clients could be stressful, but it was also engaging. It was how I learnt about their
pain points, and solving those pain points was the satisfying part. Building for myself is
different. I do it for fun. I enjoy taking an idea and turning it into something real, whether that
is a CLI tool, a web app, or a library full of domain logic.

Owning a job from start to finish only works when the code is easy to change. I want to change one
part of an app without breaking an unrelated part. That is why I now prefer small modules with clear
boundaries over clever code.

## The chain I work in

My current team works through handoffs. I am on a small team inside a bigger company. I am a
fullstack developer, but right now most of my work is on the frontend, from the app and the website
down to the backend-for-frontend layer and our microservice endpoints. A customer or stakeholder
states a need. The product manager writes a ticket. The designer draws mockups. Then a developer
turns them into code.

With agents, I can write code faster than the team can review it. Code review is now the biggest
bottleneck for me. Part of the reason is that many code bases are not set up for agents. They lack
context, a glossary, and a shared domain language. When several people have shaped a code base over
time, it often mixes different opinions and has no clear structure or guiding voice. That makes
every change harder to check.

On a small team, I feel this every day. When one ticket waits on someone, the person who owns it is
blocked until it moves. Agents made building faster, but the time spent waiting between people
stayed the same.

## My slice

I still believe one person should own one request from start to finish. At work, I treat each need
as a short brief. I ask specialists for their input, but I make the decision myself, usually the
same day. I keep the slice small, with a clear line around what it covers. Agents then fill in the
design, the code and the tests.

I spent a short time working with growth hackers, and I kept one habit from it: I test an idea
quickly and drop it when it misses. For me, done means shipped and supported. Shipped means behind a
feature switch or fully live. After that, I answer for it.

The diagram below compares two ways of working. In the first lane, each person hands the work to the
next, from the stakeholder to the product manager, then the designer, then the developer. In the
second lane, one owner pulls in input from specialists and lets agents do the building. Nothing
waits for a handoff.

<!-- prettier-ignore -->
:::graph-flow{title="CHAIN VS SLICE" flow="chain" compare="now"}
:::

Bugs and follow-up questions come back to the person who shipped the change. We still rely on
platform teams for infrastructure and security, and large initiatives still have their own owners.
Not every request needs to pass through every role.
