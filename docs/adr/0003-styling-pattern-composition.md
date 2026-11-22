# One styling hook and a shared mechanism layer

Date: 2026-11-21

## Status

Accepted

## Context

Slices reuse each other's work: shells render leaf UI, articles render metadata and subscribe
controls, lists render feed state. Cross-feature imports couple slices, while duplicating shared
mechanism lets copies drift. Two attribute names for the same override double the review surface.

## Decision

> In the context of reuse between slices, facing coupled imports against drifted copies, we decided
> for one styling hook plus a mechanism-only shared layer with orchestrator composition, to keep
> slices isolated, accepting that the composition-versus-logic line stays a review call.

Every component accepts `class` and forwards it with the rest of its props. Variant changes go
through variant props, never the hook. Transform helpers stay next to their consumer. The shared
layer imports only from below, takes domain data via props, and names no route. Orchestrators may
render leaf components owned elsewhere; domain state and loading stay with the owner.

## Consequences

- One hook to grep; a component that drops it shows up in review.
- One home for cross-cutting reuse; import direction is checkable by the boundary lint.
- Shared domain UI with behavior becomes a small feature rather than a shared component.
- Supersedes prior platform-naming split; amends the mechanism-only layer with composition.

## Reversibility

Two-way door: renaming the hook is a repo-wide rewrite; layer moves stay one file at a time.
