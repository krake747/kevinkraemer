# Edge-local negotiation with shared conversion

Date: 2026-11-21

## Status

Accepted

## Context

Agents fetch any page as markdown or typed JSON, but only the production edge path negotiates. A
dev-only approximation would let representations drift, while abstracting negotiation over a single
consumer drags edge request types into the shared core. Edge bundling also fails on source aliases
that Vite resolves.

## Decision

> In the context of serving alternate representations, facing one negotiating runtime against shared
> conversion need, we decided for edge-local negotiation plus shared conversion, to keep each
> concern with its only consumer, accepting a future second negotiator pays extraction.

Negotiation and descriptors live with the edge runtime; output cleaning and format conversion stay
shared so every runtime converts identically. Local preview runs through the real edge runtime. Edge
code uses explicit relative imports only; an alias import in the edge tree fails review even when
Vite passes locally.

## Consequences

- Conversion changes land once and apply everywhere; negotiation changes sit next to the caller.
- No dev-only negotiation path to drift. Source keeps aliases; edge keeps zero-config bundling.
- Nonexistent paths return real 404s in both representations with no SPA fallback.

## Reversibility

Two-way door: a second negotiator pays extraction; the alias rule lifts if edge bundling learns it.
