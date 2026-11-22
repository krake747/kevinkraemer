# Prerendered Solid pages with full hydration

Date: 2026-11-21

## Status

Accepted

## Context

The product is a content-heavy portfolio that must load fast and rank well, with scattered
interactivity and no persistent application server. Partial hydration added a serialization
boundary, tier tuning, and dead controls while idle. One component model removes that seam.

## Decision

> In the context of a static portfolio with scattered interactivity, facing island boundaries
> against one rendering model, we decided for prerendered pages with full hydration and against
> partial hydration, to keep one dialect, accepting a larger client bundle on every page.

Every route renders to static HTML at build time and hydrates as one tree on the client. `/scalar`
is the one exception: a hand-written document loading its app from a CDN. The first client pass must
equal server output, so client-only values stay behind a mount guard.

## Consequences

- Pages stay fast to first paint and fully interactive without tuning.
- One dialect to learn, test, and review. No props cross an island boundary.
- Each page ships the runtime, so scripting cost grows with the tree. Content edits need a rebuild.
- Supersedes prior Astro/islands, boundary, first-render, and tier decisions.

## Reversibility

Two-way door with cost: returning to islands reintroduces the boundary and tier tuning.
