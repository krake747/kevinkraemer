# Design System: Kevin Kraemer · Portfolio

Source of truth: `src/app.css`, `src/features/log/prose.css`, `src/ui/**`, `src/app.tsx`,
`src/document.tsx`.

The site is a **Specimen Panel**: interface elements treated as deliberate typographic specimens,
borrowing Bloomberg Terminal density without nostalgia. Warm charcoal grounds, dark primary, light
keeps full fidelity. The terminal is the medium (command headers, palette, status bar), never a CRT
costume. Emerald is the only signal.

A change is done when the `Specimen Panel` still reads as one system, and the page file still
matches the route's job.

Unless a page file marks a bullet **Proposal**, it describes the site as shipped.

## Where to look

| File                             | Answers                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| [`tokens.md`](./tokens.md)       | Color, type, surfaces, controls, forms: the condensed per-token rules                 |
| [`structure.md`](./structure.md) | How a page and a section open: command headers, grammar, prose sections               |
| [`motion.md`](./motion.md)       | Easing, reveal cadence, what may animate, reduced motion                              |
| [`projects.md`](./projects.md)   | The /projects register and case page: the one ruled exception, kept as worked example |

Other routes carry no page file; they read tokens plus structure directly.

## Layer rule — what you may type into `class`

Why: a shade that is not in this list is invisible in review and drifts the palette one screen at a
time. Two classes for the same job is how the site stops reading as one system.

Allowed, in this order of preference:

1. **A `src/ui` component with a variant prop.** First choice, always. `Anchor`, `Button`, `Badge`,
   `Chip`, `Stack`, `StackRow`, `Input`, `InlineCode`, `Kbd`, `TerminalCommandHeader`,
   `SectionHeading`, `PanelLabel`, `ProseSection`, `DecorMark`. The variant union is the source of
   truth for what exists.
2. **Tailwind scale classes** — `stone-*` for grounds, borders, and text; `emerald-*` for signal;
   `amber-*` for warning. Exact values and mix percentages: `src/app.css` and the `src/ui` variants.
3. **`@theme` tokens** — `--ease-out-quart` and the other easing curves, `--graph-accent`,
   `--graph-frame`, `--graph-muted`, `--graph-faint` for the graph utilities.

Never:

- A raw hex, `rgb()`, or `oklch()` in a component. The only hex in `src` is the `theme-color` pair
  in `src/pattern/seo.tsx`, which writes browser chrome and cannot read a class.
- A new shade of stone, emerald, or amber. Match the nearest existing usage instead.
- A background, text, or border color invented at a call site. If no component variant gives you the
  look, the variant is missing — add it to the component's inline CVA, do not override `class`.
- A second gradient. The one sanctioned gradient is `body::before`, dark mode only.

## Module shape

- A module is a component file holding the root plus its parts under one prefix (`ProseSection`,
  `ProseSectionBody`), with CVA entries inline via the shared `cva.config.ts`. A fixed class string
  stays inline; `cva({ base })` with no variants is an extra indirection for one string.
- Keep a part in the root's file while it only makes sense with the root; promote it to its own
  module once it is used alone (`SectionHeading`, `StackRow`).
- Every leaf imports the same variants module, so HTML written by a component and HTML written
  inline share one class vocabulary: `class={cx("hit-area-x-1", anchor({ variant: "nav" }))}`.
- Imports run `features → ui` only. A variants module that a single feature consumes belongs to that
  feature, not to `src/ui`.
- Variants are CVA, not caller overrides: a padding, tone, size, or alignment difference is a
  variant prop, never `class="py-12"` at the call site.
- A component that owns a cva variant function takes the caller class into that function, still
  wrapped in `cx` so Tailwind conflicts merge:
  `class={cx(anchor({ variant: props.variant, class: props.class }))}`.
- Primitive props come from the platform: `ComponentProps<"tag">` for element props,
  `VariantProps<typeof variant>` for CVA values. A component that renders more than one tag declares
  the attributes its call sites use (`Badge` takes `ComponentProps<"a">` when `as="a"`).
- Polymorphism is one prop, `as`, typed to the tags the component accepts (`StackRow` takes any
  `ValidComponent`, `Stack` takes `div`/`ul`/`dl`, `Badge` takes `span`/`a`), resolved with
  `dynamic(() => props.as ?? defaultTag)`. The default is the component's natural tag (`"div"` for
  `StackRow` and `Stack`, `"span"` for `Badge`). The value is a tag name (`as="li"`, `as="a"`),
  never `as={<li />}`.

## Shared chrome

Fixed header and footer, each `h-10`, stone hairline plus `backdrop-blur-sm` on `bg-stone-50/95` /
`dark:bg-stone-950/95` (`header.tsx`, `footer.tsx`). These two `border-b`/`border-t` are the
sanctioned exceptions to the no-hairline rule in `tokens.md`.

- Header: `KK` home mark, page routes, in-page section links on `/` and `/cv`, command palette,
  theme toggle. The palette is also mobile navigation — there is no hamburger.
- Header routes are exactly three: `/`, `/cv`, `/logs` (`topNav: true` in `src/core/nav/paths.ts`).
  Every other route is palette-only. A new route does not earn a header slot by existing.
- Footer: pixel avatar, “Built with intent”, `~/developers`, year. Status-line look. It may overlay
  in-flow content, including the first viewport; that is not a bug to fix by un-fixing the bar or
  padding the hero clear of it.
- Skip link is first in the document's tab order (`document.tsx`). Theme follows
  `prefers-color-scheme` until the visitor chooses; the choice persists through `createColorScheme`
  with `createLocalStorage("kk-color-scheme")` in `src/core/theme.ts`, wired via `<Preferences>` in
  `src/app.tsx`.
