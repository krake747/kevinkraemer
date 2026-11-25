# Structure — commands, headings, page open

Source of truth: `terminal-command-header.tsx`, `section-heading.tsx`, `panel-label.tsx`,
`src/pattern/document-section.tsx`, `src/pattern/document-page.tsx`, and the shipped pages.

How a page and a section announce themselves. The terminal is the medium, so the opening is
structural (chrome, error, or exit) before it is decorative.

## Terminal Command Header

`TerminalCommandHeader` is the one command that opens a section:
`<TerminalCommandHeader command="whoami" />` renders the emerald chevron plus the command.

```
Does this section need a name?
 ├── Is it the top of a section, and is a shell command the honest label?
 │    └── Yes → TerminalCommandHeader. Exactly one per section.
 ├── Is it a sub-section inside that section?
 │    └── Yes → SectionHeading. Never a second TerminalCommandHeader.
 └── Is it a label on a panel, a rail, or a field group?
      └── Yes → PanelLabel.
```

- One `TerminalCommandHeader` per section. No subordinate text beneath it — no eyebrow, no caption,
  no second command. The command is the label.
- `SectionHeading` renders `h2` with the emerald `#` and mono `text-xs`. It takes `id`, and that id
  is what the parent section's `aria-labelledby` points at.
- `PanelLabel` is uppercase mono `text-xs` with loosened tracking. Panel headers and rail labels
  only — never a heading.

## Command grammar

The command is the honest label, so it follows the page's job:

| Command                                                              | Job                               | Pages                                           |
| -------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------- |
| `whoami`                                                             | The landing hero, the person      | `/`                                             |
| `cat story.md`                                                       | A document you read top to bottom | `/about`, `/` `#story`                          |
| `cat uses.md`, `cat privacy.txt`, `cat developers.md`, `cat {id}.md` | A named file                      | `/uses`, `/privacy`, `/developers`, a log entry |
| `cd ~/cv`, `cd ~/logs`                                               | A register you browse             | `/cv`, `/logs`                                  |
| `tail -f ~/logs`                                                     | A stream of recent entries        | `/` logs section                                |
| `grep -r`                                                            | A query                           | `/search`                                       |
| `echo "Get in touch"`                                                | An invitation to act              | `/contact`, `/` `#contact`                      |
| `cat missing.txt`                                                    | A file that is not there          | `/404`                                          |

A new route picks the row that matches its job. `cd ~/<route>` for a register or dated list;
`cat <name>` for a document. Everything that is not a register, a query, or an invitation is a
document. Never invent a command that is not shell-real, and never use the command as a joke — it is
the section label.

## Page open

Every page opens one of three ways, and the first is enforced by code:

| Page kind                                              | Open with                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `DocumentPage` route (`src/pattern/document-page.tsx`) | The route composes a `PageHeader` as a child: `TerminalCommandHeader`, then `PageHeaderTitle` |
| Index route (not `DocumentPage`)                       | `TerminalCommandHeader`, then `PageHeaderTitle`                                               |
| Entry route (`/logs/[slug]`)                           | `TerminalCommandHeader`, then `PageHeaderTitle`, with optional `PageHeaderMeta`               |

Why the route owns it: `DocumentPage` is the column and the measure, not the header. The caller
writes the command and the title as children, the same way it already composes `DocumentSection`.
Use `PageHeader` and `PageHeaderTitle` so the h1 size does not drift across the seven document
pages. Do not hand-roll that header.

The DocumentSection anatomy is for sections with a heading that earns its place; a two-sentence
intro on a page that then lists rows has no heading to give. Do not invent a heading so a short
intro is allowed, and do not add a page intro at all.

A page whose entire body is one list needs **no** section heading: the `h1` already names it, and a
`SectionHeading` would repeat the page title one line lower. A register that is not `/cv` opens as
an Index route (`TerminalCommandHeader`, `h1`) and then goes straight to its list: a `Register` of
rows, or the ruled entries of `/projects`.

The fixed header's height is `--header-h`. `scroll-margin-top` and the sticky rails derive from it;
never hard-code a second clearance number.

Landing sections use the full `max-w-6xl` column (`TerminalSection`), because the log rows need the
width. Every `PageColumn` route nests `max-w-4xl` inside it, so prose pages start 128px further in.
That difference is the layout, not drift: do not "fix" it by widening a prose page or narrowing the
landing rows.

## Prose block anatomy

A prose section is a `DocumentSection` with a `SectionHeading` and a `DocumentSectionBody`:

```tsx
<DocumentSection aria-labelledby="story-heading">
  <SectionHeading id="story-heading">story</SectionHeading>
  <DocumentSectionBody>{/* paragraphs */}</DocumentSectionBody>
</DocumentSection>
```

- `DocumentSection` is a `<section>` with the reveal animation. The caller passes `aria-labelledby`
  pointing at the heading `id` — it is a native attribute and flows through to the section.
- `SectionHeading` takes the heading `id` as its own `id`. The string appears twice on purpose — on
  the heading and as `aria-labelledby` on the section — that is what splitting the anchor from the
  label costs, and duplicating it is correct.
- `DocumentSectionBody` is the measure column (`max-w-prose`), stone-600 body. It is the only place
  the prose measure is declared. The default element is a `div` with `flex-col gap-4`. For a
  single-paragraph body, change the element with `render` to a `p`, without the flex layout so
  inline links stay in the paragraph flow.
- `CvSection` takes `id` and wraps the section. `CvSectionHeading` takes the heading as children and
  uses a `$` prompt instead of the `#` hash.
- The landing story is the one prose grid that is deliberately unequal: `lg:col-span-5` +
  `lg:col-span-7 lg:pl-12`. The narrow left column is the design, not a measure bug; the right
  column lands on the prose measure, the left runs shorter.

Correct — the caller composes the heading and the body, with the heading id twice on purpose:

```tsx
<DocumentSection aria-labelledby="philosophy-heading">
  <SectionHeading id="philosophy-heading">philosophy</SectionHeading>
  <DocumentSectionBody render={(props) => <p {...props}>I build in small vertical slices.</p>} />
</DocumentSection>
```

Incorrect — a hand-rolled heading and a raw measure:

```tsx
// No aria-labelledby, no hash, and a second measure declaration
<section class="max-w-prose leading-[1.8]">
  <h2 class="font-mono text-xs">philosophy</h2>
</section>
```

## Registers and rails

Most browsable lists are a `Register` of `RegisterRow`s, one action per row, with the row's title,
description, and meta written as children of those parts. Empty states are `EmptyRegister`, with its
title, note, and action as child parts, not JSX props. The way back is `ReturnToRegister`. A page
with a side rail composes `RegisterWithRail`: main content (including the mobile disclosure) as
children, and the rail as a child part, not a `rail` prop. The grid, the sticky offset, and the
desktop-only aside stay in the component.

Two ruled exceptions keep their own shape: `/projects` divides entries with a single rule and no
frame (`docs/design/projects.md`), and `/cv` keeps its compact `$`-marked sections for print. Record
rows with linked labels stay hand-rolled: a `RecordRow` label is plain text, written as children of
the label part, not a `label` prop.

## Content models

Elements mean what the spec says, so the tag must match the content, not the styling:

- When a part's element changes with `render`, stay inside one family: `ul` takes `li`, `dl` takes
  `dt`/`dd` groups (a plain `div` may wrap one group), `details` takes exactly one leading
  `summary`. Never cross families.
- Every `section` carries a name. `DocumentSection` pairs `aria-labelledby` with its `h2`;
  `TerminalSection` names itself with its command.
- One `h1` per page from `PageHeader`, then step by one. No heading inside `li`.
- `RecordRow` labels stay plain text; values live in `dd`. Order decides the list: unordered entries
  `ul`, meaningful order `ol`, name-value `dl`.
- Disclosure is native `details`/`summary` only — never bolt button semantics onto a summary.
- Name every exposed landmark: rail `aside`s point `aria-labelledby` at their rail label, and search
  operations sit in `search`.

## Panel headers

A panel header is `PanelLabel`, not a heading: uppercase, mono, loosened tracking, stone-600
(`dark:stone-400`). It names a panel or a rail group and does not enter the heading outline. If the
content needs to be found by a screen reader's heading list, it is a `SectionHeading` and the panel
is a section.
