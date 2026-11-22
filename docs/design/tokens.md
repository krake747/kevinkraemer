# Tokens — color, type, surfaces, controls, forms

Source of truth: `src/app.css`, `src/ui/**`, `src/features/log/prose.css`. This file condenses the
former per-token pages; `system.md` stays the index.

## Color — `Single Signal`

Two hues on warm charcoal: **stone** carries every ground and text, **emerald** is the one signal
capped at `≤10%` of any screen, **amber** is reserved for warnings. No other color.

| Ground                    | Light               | Dark                     |
| ------------------------- | ------------------- | ------------------------ |
| Page                      | `bg-stone-50`       | `dark:bg-stone-950`      |
| Panel, input, inline code | `bg-stone-100`      | `dark:bg-stone-900`      |
| Code block                | `bg-stone-900`      | `dark:bg-stone-950`      |
| Selected chip             | `bg-emerald-500/10` | `dark:bg-emerald-500/20` |

Text: headline `stone-900` / `stone-100`, body `stone-800` / `stone-200`, prose body `stone-600` /
`stone-400`, labels `stone-500` or `stone-600`. Never emerald body text. Borders: panel
`border-stone-200/80` / `dark:border-stone-800`, inputs `border-stone-300/60`, active
`border-emerald-500/30`. Dark mode gets exactly one wash: the `body::before` emerald radial in
`src/app.css`. No other gradient. Theme follows system until chosen, persisted via
`createColorScheme` in `src/core/theme.ts`.

## Type — `Pairing`

**Geist** (`--font-display`) for headings, display, body, prose. **JetBrains Mono** (`--font-mono`)
for commands, nav, data, labels, buttons, tags, counts, code. Sizes: `text-xs` mono chrome,
`text-sm` secondary mono, `text-base` body and inputs. Floor `text-[11px]` for dense data only. One
prose measure: `max-w-prose` (`--max-width-prose`, 70ch) at `text-*/[1.8]`; UI copy at component
width with `text-*/relaxed`. Size and leading always combine in one `text-*/<leading>` class, never
a separate `leading-*`. Tracking: `tracking-tight` on Geist headings, `tracking-widest` on uppercase
mono labels, none elsewhere. Headings `text-balance`, body `text-pretty`. `tabular-nums` on every
date, count, and figure. `InlineCode` is the only rounded element; `Kbd` stays square with a `1px`
stone border.

## Surfaces — `Panel, Not Hairline`

A surface is open text or one framed `1px` panel. No shadows. `rounded-none` everywhere except
`InlineCode` and the focus ring. `Stack` is `flex-col gap-2` with no dividers; `StackRow` is the
framed panel in `default` / `compact` / `relaxed` / `roomy` / `spacious`. Entry rows link once with
group hover; record rows never hover. No padding overrides, no `divide-y`. One `border-t` rule
allowed between landing sections; the `/projects` ruled register is the documented exception. Board
cells are columns of one panel, not list rows.

## Controls — which component

URL change goes to `Anchor`; filter toggle to `Chip`; action to `Button`; label to `Badge`. `Anchor`
variants: `prose` default, `channel`, `muted`, `title`, `nav`, `subtle`, `mono` — seven only, no
call-site restyle. `Button` intents `quiet` / `muted` / `link`; never navigates, never disabled —
omit instead. `Chip` is `aria-pressed` filter state only. `Badge` tones `neutral` / `emerald`, sizes
`sm` / `xs`; `interactive` only when `as="a"`. Off-site links take the `external` prop on `Anchor`
(`Badge as="a"` too): new tab plus the `sr-only` note, no call-site attrs. Same-site documents
(feeds, text files, the PDF) keep `rel="external"`: the value is the router's opt-out from
client-side navigation, not a new tab.

## Forms — `Input`, focus, hit areas

`Input` is a square `<label>` frame owning border, ground, and focus; the inner input is bare with
`outline-none`. `text-base` with `sm:text-sm` stops iOS zoom. Focus is
`focus-within:border-emerald-500` plus `ring-emerald-500/20`; the global default is
`:focus-visible outline-emerald-500`. Never ship `outline-none` alone. Small targets grow via
`hit-area-*`; `Button` and `Chip` already carry theirs. Scroll containers use `kk-scrollbar` plus
`scroll-fade-y` / `scroll-fade-x`. No checkbox, radio, switch, select, or textarea ships; a needed
toggle is a feature-owned `StackRow compact` `role="switch"` row promoted to `src/ui` only on second
use.
