# Consolidated agent discovery with ARD and MCP card

Date: 2026-11-21

## Status

Accepted

## Context

Agents need a stable way to find content without scraping HTML or guessing URLs, plus a capability
description a registry can index. Scattered discovery files drift, a catch-all fallback breaks trust
checks, and prose alone names no queryable capability.

## Decision

> In the context of machine-readable discovery, facing scattered files against one surface, we
> decided for a single static discovery surface plus one ARD entry and its MCP server card, to serve
> both page retrieval and capability indexing, accepting an extra vocabulary to maintain.

Expose one static surface: human entry point, corpus document, machine catalog, versioned API
description advertised in headers and prose, allow rules with sitemap, and honest negotiation with
no fallback. Publish one ARD entry describing the MCP endpoint plus the card it references,
advertised in document head, crawler directives, linkset, agent index, and API description. Where a
browser exposes WebMCP, register the site's own read and navigation actions on the page as well.

## Consequences

- Agents list stable paths from the catalog without scraping; registries index one capability.
- Browsers without WebMCP ignore the registration; the page keeps working unchanged.
- One guard suite catches drift between prose, headers, and built artifacts.
- Content changes require regeneration; catalog size grows with content. Card claims stay advisory
  and version-guarded against the runtime.
- Supersedes prior trust-page and retrieval-spec decisions.

## Reversibility

Two-way door: dropping ARD and the card strands registry consumers; the catalog regenerates.
