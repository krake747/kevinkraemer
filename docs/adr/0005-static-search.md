# Build-time search for a static site

Date: 2026-11-21

## Status

Accepted

## Context

Search must work on a fully static deployment with no server and no external service. The corpus is
the built HTML output.

## Decision

Index the built output at build time and query that index from the client. Expose it in both the
full-page search and the command palette. Prefer a static index over hosted search or bundling the
corpus as JavaScript.

## Consequences

- Search works with no server or third-party dependency.
- The corpus never inflates the client bundle.
- Local development without a build has no index. A build or build-then-dev workflow is the
  supported local search path.

## Reversibility

Two-way door: hosted search replaces the index at the cost of a runtime dependency.
