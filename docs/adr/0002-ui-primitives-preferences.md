# Headless primitives and owned preferences

Date: 2026-11-21

## Status

Accepted

## Context

Sections need keyboard, focus, dismissal, and ARIA state for composite widgets, plus persisted
visitor choices shared across header, palette, and sections. Per-widget rebuilds drift, and a second
client store would mirror the UI kit's own persistence.

## Decision

> In the context of composite widgets and persisted choices, facing bespoke behavior and a parallel
> store against one kit, we decided for the UI SDK's headless set and its preference primitive and
> against per-widget rebuilds and a mirrored store, to keep one owner per concern.

Use the SDK set for dialogs, palette, toggles, and preferences. Native elements serve simple
controls. Each persisted choice has exactly one owner: the kit's preference, read and written
through it. The server renders the default, so first-paint styling keys off the document attribute.

## Consequences

- Palette, dialogs, and theme share focus and dismissal behavior with no drift.
- Header, palette, and sections read one value with no provider or prop drilling.
- Swapping the set touches every composite widget at once. A stored shape from the old store is
  ignored, not migrated.
- Supersedes prior primitive-library and client-store decisions.

## Reversibility

Two-way door: swapping the set touches every composite widget; the old store shape is ignored.
