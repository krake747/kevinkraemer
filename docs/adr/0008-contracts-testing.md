# Typed boundaries and behavioral tests

Date: 2026-11-21

## Status

Accepted

## Context

Core helpers mix pure projections with decision-bearing I/O, while suites drifted toward
re-asserting literals and inspecting source files. Literal tests fail only on renames and pass when
behavior breaks; white-box reads couple verification to structure instead of contracts.

## Decision

Use a declarative `Result` where a caller must distinguish empty, error, and success, and keep pure
projections on sentinels with content validation as a build failure. Test only observable behavior
through the exported surface: branching, forwarding, composition, and built output.

## Consequences

- Callers branch exhaustively to empty or error UI; static pages pay no cost.
- Suites become rename-safe; failures signal a user-visible regression.
- Coverage may drop where mirrors are deleted; signal rises because remaining tests exercise real
  contracts. Structural invariants belong in the build, not in a test.
- Supersedes the single-boundary limit; each boundary needs one typed error and a justification.

## Reversibility

Two-way door: sentinels return wherever no caller branches; behavioral tests stay either way.
