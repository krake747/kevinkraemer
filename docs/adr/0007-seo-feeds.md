# SEO from one source with readable feeds

Date: 2026-11-21

## Status

Accepted

## Context

Titles, canonicals, social cards, and structured data drift when each page builds its own metadata.
Syndication feeds also need a readable browser rendering, while browser transform support is being
removed and plain stylesheet linking keeps working.

## Decision

Derive all search and social metadata from a single source of truth, with pure builders for
structured data and a head composed from small focused leaves. Render feeds as plain styled output
with no transform step.

## Consequences

- Changing the canonical address or image updates every page and feed from one place.
- Pages stay thin; structured-data branching is tested in isolation, feeds reuse the same source.
- Feed presentation stays limited to what stylesheets express; no transform to maintain.
- A single source couples all pages, so conditional fields must be modeled centrally.

## Reversibility

Two-way door: per-page metadata returns at the cost of drift; a transform re-enters only if asked.
