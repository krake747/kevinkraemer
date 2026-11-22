---
title: On Having Something Visible
description: >-
  Most of the work I have done over the years lived behind logins. I wanted somewhere to put it
  under my own name.
date: 2026-08-23
tags: ["site", "craft"]
---

I learned programming at university, then spent four and a half years in finance, splitting my time
between risk analysis and software development. I started by automating reports. Later, I built
processes for investment guidelines and worked on risk processes covering leverage, market risk,
liquidity, and the pricing of financial instruments. The more time I spent with those systems, the
more interested I became in the software behind the analysis.

I later moved to a company in intellectual property management. By then, I was curious how my
experience compared with software developers who had taken a more traditional route into the field.
Mine went through finance and a lot of learning on the job. I started this site to put that
experience in one place. It shows what I do, what I like, and what I want to do next.

## A place that is mine

LinkedIn and GitHub show part of the picture. Profiles follow a template, and repositories show code
but not why it exists. What I wanted was one place under my own name to show how I work.

Social media never pulled me in. Sharing everything straight away never felt necessary. Usually I
let things sit for a while before deciding what I actually think. A personal website gives those
thoughts somewhere to live. It can sit there and be found without me having to push every update at
people.

There is a practical reason too. More of what I read passes through machines now. Search crawlers
and feed readers have done so for years, and lately coding agents have as well. The site has an RSS
feed, an OpenAPI description of its pages, and markdown versions of the content. I wanted an agent
to be able to find its way around the site as easily as a person can. I think this is still new for
many teams, especially at firms with a lot of legacy software.

## Shipping early

Building the site was the first test of putting work out before it felt finished. The first version
was a single index file that grew to a thousand lines. Splitting it into sections and components
taught me which seams mattered. I did not know all of those seams in advance. Splitting the file
made them visible.

A lot of how I think about software comes from finance. As a risk analyst, I talked to clients and
saw how complex or simple finance can be, depending on the area.

One parallel I like is [prediction markets](https://en.wikipedia.org/wiki/Prediction_market). Most
people associate them with gambling, but that was never the point. They are a way to collect what
people know and reward them for saying it.

I apply the same thinking to shipping. Every solution has trade-offs, so I would rather get
something out early, get feedback, and iterate from there than wait for a perfect version.

## Logs as habit

At my previous job, we did not have much of a logging practice. The setup was simple: a bunch of log
files, Ctrl+F through them, and, when they got too large, a Python script to search for something
specific. It was usually a hassle. Even when I found the relevant line, the surrounding context was
often missing.

My view has changed. I like having a record to go back to when something breaks. The right entry
does not fix anything on its own. It just shows what happened and where to look next.
[Logging Sucks](https://loggingsucks.com/) helped me name what those old files were missing.

`tail -f ~/logs` started as a joke, but I like the idea behind it now. This site is a place to keep
decisions, experiments, and observations while they are still fresh. It works a bit like Strava does
for my rides. I spend a lot of time looking back at the routes I have ridden, and this site does the
same for my work: a log and a timeline I can go back to.

## What this site is

Right now the site has my logs, my career path, and a short intro about who I am. Under the hood, it
has high [Lighthouse](https://developer.chrome.com/docs/lighthouse) and
[Is Agentic](https://is-agentic.com) scores. Those matter more to me than to a visitor. It is a bit
over-engineered for a personal website. I built it that way because I can.
