# ADRs

Recoverable reasoning for why the system looks the way it does. Each ADR is a short, generalizable
decision a future reader can recover in 2–3 minutes. Squashed to the current stack on 2026-11-21;
prior Astro/islands history is intentionally not carried.

## When to write one

A decision warrants an ADR when it is architectural or cross-cutting, hard or costly to reverse,
likely to be questioned later, affects more than one section or service, and involves a real
trade-off.

Do. BFF between app and services. Search indexing strategy. State persistence for shared client
state.

Do not. A memo in a list item. A prop rename. A one-file style tweak. A page look with no
cross-cutting rule.

## How

Copy `_template.md` to `NNNN-kebab-title.md`. Fill the four rungs:

- **Date**: creation date (`YYYY-MM-DD`)
- **Status**: `Proposed | Accepted | Superseded by ADR-XXXX | Deprecated`
- **Context**: why a decision is needed: problem and forces, not how it is built
- **Decision**: what we chose and what we ruled out; state the principle, not file paths or literal
  values. Optional first line as a Y-Statement
- **Consequences**: what becomes easier or harder; trade-offs accepted. No implementation inventory.

Keep it to 21–40 lines and plain prose.

## Lifecycle

New ADRs start as `Proposed` and become `Accepted` on merge. When superseded, keep the old file and
mark `Superseded by ADR-XXXX`. Deprecated decisions stay for history.

Accepted ADRs are immutable. Do not add See also or cross-links to an accepted ADR. Record
relationships forward in the new ADR, or in an Amendment block. Only Status may change to Superseded
or Deprecated.

## Where

Single-context layout: `GLOSSARY.md` at the repo root, `docs/adr/` for all decisions. Agents reach
them via `docs/agents/domain.md`.

## Log

| #    | Title                                              | Status   | Date       |
| ---- | -------------------------------------------------- | -------- | ---------- |
| 0001 | Prerendered Solid pages with full hydration        | Accepted | 2026-11-21 |
| 0002 | Headless primitives and owned preferences          | Accepted | 2026-11-21 |
| 0003 | One styling hook and a shared mechanism layer      | Accepted | 2026-11-21 |
| 0004 | Edge-local negotiation with shared conversion      | Accepted | 2026-11-21 |
| 0005 | Build-time search for a static site                | Accepted | 2026-11-21 |
| 0006 | Consolidated agent discovery with ARD and MCP card | Accepted | 2026-11-21 |
| 0007 | SEO from one source with readable feeds            | Accepted | 2026-11-21 |
| 0008 | Typed boundaries and behavioral tests              | Accepted | 2026-11-21 |
| 0009 | Agent discovery without a robots directive         | Accepted | 2026-11-22 |

## Review

A new ADR must be ≤40 lines, include `Date` and `Status`, and follow the Nygard shape.
