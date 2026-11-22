# `/projects` — Case File

Source of truth: `src/routes/projects/`, `src/features/project/`.

A register of project case files at `/projects`, with a reading page at `/projects/[slug]`. This
file is the visual language for both routes.

Unless marked **Proposal**, this describes the pages as shipped. Tokens and chrome:
[`system.md`](./system.md).

## Purpose & audience

A hiring manager or peer who wants to see how a project was approached — problem, decisions, and
evidence — without treating the work as a card deck or a metrics wall. The index is for scanning;
the case page is for reading.

## Mood

**Case File.** The index is an editorial register, not a card grid and not a spreadsheet: one entry
per project, divided by a single rule, with the name at display size and at most one sourced figure.
It still has to read as a register with one entry, not an empty gallery. The case page is a 70ch
document with a metadata stack of record rows and mid-level headings.

## How it differs from sibling pages

- `/cv` `#projects` stays the compact professional list. Its section title links here; it does not
  retell the case file.
- `/logs` entries are dated writing for a Passer-by. Case files are structured project records.
- `/uses` is a tool inventory. This register is work, not kit.
- `/` does not embed the register.

## Layout pattern

### Index (`/projects`)

- `ProseShell`: `TerminalCommandHeader` `ls ~/projects`, title “Projects”, optional Geist lede (omit
  the element when empty), then one plain `ul` of entries from the `projects` collection
  (`sortByOrder`). An empty collection renders a `py-20 text-center` block with one mono `text-sm`
  line instead of the list.
- Each entry is an `li` on a two-column grid (`md`, `minmax(0,15rem)` and the rest) with a single
  `border-t` in stone and `py-10`. The rule is the page's only divider: no frame, no `StackRow`, no
  `Stack` (deliberate exception to the framed-panel rule).
- The identity rail: the name as `Anchor` `title` (mono `text-2xl`, underlined, hover emerald), then
  status and year in mono `text-xs` uppercase `tabular-nums`, then the optional Headline Figure:
  value in mono `text-3xl tabular-nums`, label in mono `text-xs`. A project with no figure keeps the
  rail at name and status.
- The body: the tagline in Geist `text-base leading-relaxed`, capped at `max-w-prose`, then role and
  stack in mono `text-xs`. The tagline is the page's prose; do not set it in mono at `text-sm` as
  the old register did.
- No group `SectionHeading` when the register is a single list. The register ends on its last entry;
  no footer copy.

### Case page (`/projects/[slug]`)

- `DetailShell` wrapping `ProjectArticle`, inside the layout that stretches to fill the viewport so
  the footer stays at the bottom: reading column `max-w-prose` on the `article` itself.
- One `TerminalCommandHeader` `cat {id}.md`, title `text-2xl`, mono tagline, then metadata as a
  `Stack` (`as="dl"`) of `ProjectMetadataRow`s (record rows, no row hover; links inside keep their
  own hover): role, stack, status (and year), live, and repo when a public URL exists. The tagline
  is not repeated as a What row.
- Then sections with a real mid-level heading step (`h2`, Geist `text-xl` semibold), not only 12px
  mono `TerminalCommandHeader` or `SectionHeading`: problem and point of view; key decisions (each
  title plus reason in a record `StackRow`); evidence and changelog only when they have entries
  (changelog as a `Stack` `as="ul"` of record `StackRow`s `as="li"`).
- A muted back link to `/projects`. Breadcrumbs for Home / Projects / name.

## Type & colour accents

- Standard `Prose` header on the index. The index name uses `Anchor` `title` (mono `text-2xl`); the
  case-page `h1` is Geist `text-2xl`; section `h2` is `text-xl`; decision titles are `h3` at body
  size, semibold.
- Body and notes: muted stone, `leading-[1.8]` in prose blocks, mono on metadata and captions. The
  index tagline is UI copy at `text-base leading-relaxed`, capped at the measure.
- Emerald is the single signal: only the primary live-site link uses `Anchor` `channel`, and the
  index name turns emerald on hover. Case-page repo, changelog, and the back link use `muted`. No
  extra palette, no shadows, no gradients, no icon grids, and one Headline Figure per project at
  most — never a grid of numbers.

## Signature component

The metadata `Stack` of record `StackRow`s at the top of the case page, and the index entry: rule,
display-size name, status line, one Headline Figure in the rail, tagline on the measure.

## Motion

Staggered `animate-rise` on the index header, `animate-fade-up` on the register and footer. The case
page is static besides standard link hover. No scroll reveal. Collapse under
`prefers-reduced-motion`.

## Do / Don't

- Do keep one rule per entry and no frame, even with a single entry. This is the page's one
  sanctioned departure from the framed-panel rule in [tokens.md](./tokens.md).
- Do keep the tagline in Geist on the measure; a mono one-liner is the old register and drops the
  page back into a filename listing.
- Do keep a mid-level heading step on the case page, and a 70ch reading measure.
- Do keep Email-style restraint: one emerald action, the live site.
- Don't publish a private repository URL. If no public repo is listed, omit the repo row.
- Don't render Evidence or Changelog when those lists are empty, and don't invent an index lede.
- Don't add a second figure, a KPI block, or a card grid, and don't turn the case page into a
  dashboard of metrics.
- Don't add a second `TerminalCommandHeader`, shadows, or a gradient.
