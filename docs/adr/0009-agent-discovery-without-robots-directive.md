# Agent discovery without a robots directive

Date: 2026-11-22

## Status

Accepted

## Context

ADR-0006 advertised the ARD manifest from robots.txt with an `Agentmap:` directive. RFC 9309
requires crawlers to ignore records they do not recognise, so the line is harmless to compliant
crawlers. Validators reject it as an unknown directive, and every scan of the live site reports it.
The manifest already reaches agents through the well-known path, the document-head link, the
linkset, and the agent index.

## Decision

> In the context of advertising the ARD manifest, facing a directive validators reject against
> discovery routes that need no repair, we decided to drop `Agentmap:` from robots.txt and keep the
> remaining four surfaces, accepting a robots file that advertises one route fewer.

## Consequences

- robots.txt parses clean in third-party validators with nothing else changed.
- No agent loses discovery: the well-known manifest and the head link were already the primary
  routes, and Lighthouse reads any of the four.
- A reader of ADR-0006 sees one surface dropped; this ADR records that relationship forward.

## Reversibility

Two-way door: restoring the directive is one line once validators learn it.
