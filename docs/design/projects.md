# `/projects`: Case File

Source of truth: `src/routes/projects/`, `src/features/project/`.

A register of project case files at `/projects`, with a reading page at `/projects/[slug]`. This
file is the visual language for both routes.

Unless marked **Proposal**, this describes the pages as shipped. Tokens and chrome:
[`system.md`](./system.md).

## Purpose & audience

A hiring manager or peer who wants to find work fast (the index) and understand how a project was
approached (the case file: problem, decisions, implementation, and trade-offs) without treating the
work as a card deck or a metrics wall. The index is for discovery; the case page is for reading. The
index is never a miniature of the detail pages.

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

- `DocumentPage`, with a child `header`: `TerminalCommandHeader` `ls ~/projects`, `PageHeaderTitle`
  “Projects”, then one plain intro line (“The work, filed…”). An empty collection renders
  `EmptyRegister spacious` instead of the list.
- Featured case files come first, in the established two-column rows: `li` with a single `border-t`
  in stone, identity rail (`Anchor` `title` name, status line, optional Headline Figure), and body
  (tagline, role and stack). The row is a `group`: hovering anywhere highlights the name, gated
  behind `pointer-fine` so a touch tap on row whitespace leaves no stuck highlight. No wash, no
  frame, no `StackRow`, no `Stack` (deliberate exception to the framed-panel rule).
- The compact directory follows: one `li` per remaining project with a single `border-t`, a block
  link (`group`, `py-5`) wrapping `RegisterRowTitle`, `RegisterRowDescription` (`lines={1}`), and
  `RegisterRowMeta` (category · status · year). No arrow, no frame: density is the signal. A
  featured entry never repeats in the compact list, and the compact section is omitted entirely when
  nothing is left: no heading, no empty state.
- No group headings anywhere on the page. A “Featured” eyebrow is scaffolding; the density change
  between the two lists is the label. The register ends on its last entry; no footer copy.

### Case page (`/projects/[slug]`)

- `DetailPage` wrapping `ProjectEntry`, inside the layout that stretches to fill the viewport so the
  footer stays at the bottom: reading column `max-w-prose` on the `article` itself.
- One `TerminalCommandHeader` `cat {id}.md`, `PageHeaderTitle` at `text-2xl`, mono tagline, then
  metadata as a `Stack` rendered as a `dl` of `RecordRow`s (record rows, no row hover; links inside
  keep their own hover): role, stack, status (and year), live, and repo when a public URL exists.
  The tagline is not repeated as a What row.
- Then sections with a real mid-level heading step (`h2`, Geist `text-xl` semibold), not only 12px
  mono `TerminalCommandHeader` or `SectionHeading`: problem and point of view; key decisions (each
  title plus reason in a record `StackRow`); technical implementation (one prose paragraph);
  evidence (captions only, when present); challenges and trade-offs (same record rows as decisions).
  Metadata rows stay the single home for links: live site and repo are not repeated further down the
  page.
- A muted back link to `/projects`. Breadcrumbs for Home / Projects / name.

## Type & colour accents

- Standard page `header` on the index. The index name uses `Anchor` `title` (mono `text-2xl`); the
  case-page `h1` is Geist `text-2xl`; section `h2` is `text-xl`; decision titles are `h3` at body
  size, semibold.
- Body and notes: muted stone, `leading-[1.8]` in prose blocks, mono on metadata and captions. The
  index tagline is UI copy at `text-base leading-relaxed`, capped at the measure.
- Emerald is the single signal: only the primary live-site link uses `Anchor` `channel`, and a name
  turns emerald on row hover. Case-page repo and the back link use `muted`. No extra palette, no
  shadows, no gradients, no icon grids, and one Headline Figure per project at most, never a grid of
  numbers.

## Signature component

The metadata `Stack` of record `StackRow`s at the top of the case page, and the index entry: rule,
display-size name, status line, one Headline Figure in the rail, tagline on the measure.

## Motion

Staggered `animate-rise` on the index header, `animate-fade-up` on the featured and compact
sections. The case header rises on entry (`animate-rise`, transform-only, so the page's largest text
paints on the first frame); the case body is static besides standard link hover. No scroll reveal.
Collapse under `prefers-reduced-motion`.

## Do / Don't

- Do keep one rule per entry and no frame, even with a single entry. This is the page's one
  sanctioned departure from the framed-panel rule in [tokens.md](./tokens.md).
- Do keep the tagline in Geist on the measure; a mono one-liner is the old register and drops the
  page back into a filename listing.
- Do keep a mid-level heading step on the case page, and a 70ch reading measure.
- Do keep Email-style restraint: one emerald action, the live site.
- Do keep featured entries out of the compact list, and omit the compact section when nothing is
  left. Duplication reads as padding.
- Don't publish a private repository URL. If no public repo is listed, omit the repo row.
- Don't render Evidence or Trade-offs when those lists are empty.
- Don't add a second figure, a KPI block, or a card grid, and don't turn the case page into a
  dashboard of metrics.
- Don't add a second `TerminalCommandHeader`, shadows, or a gradient.
