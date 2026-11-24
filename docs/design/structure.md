# Structure — commands, headings, page open

Source of truth: `terminal-command-header.tsx`, `section-heading.tsx`, `panel-label.tsx`,
`prose-section.tsx`, `src/pattern/document-page.tsx`, and the shipped pages.

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

| Page kind                                              | Open with                                                                                                                                  |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `DocumentPage` route (`src/pattern/document-page.tsx`) | The layout itself: `command` prop (required) → `TerminalCommandHeader`, then `h1`, then the `lede` slot in Geist `text-sm leading-relaxed` |
| Index route (not `DocumentPage`)                       | `TerminalCommandHeader`, `h1`, then a Geist lede at `text-sm max-w-2xl leading-relaxed`                                                    |
| Entry route (`/logs/[slug]`)                           | `TerminalCommandHeader`, `h1`, then the description at `leading-relaxed` inside `max-w-prose`                                              |

Why the layout owns it: `DocumentPage` takes `command` as a required prop, so a DocumentPage page
physically cannot ship without exactly one command. Hand-rolling that header re-implements the h1
size, the lede treatment, and the `kk-cascade` column, and will drift from all seven `DocumentPage`
pages.

**A short intro above a list is the `lede` slot, not a `ProseSection`.** The three-part prose
anatomy is for sections with a heading that earns its place; a two-sentence intro on a page that
then lists rows has no heading to give. Put it in `lede` and stop. Do not invent a heading so the
measure is allowed, and do not hand-roll a measure column on a page intro: `DocumentPage` already
sets it.

A page whose entire body is one list needs **no** section heading: the `h1` already names it, and a
`SectionHeading` would repeat the page title one line lower. A register that is not `/cv` opens as
an Index route (`TerminalCommandHeader`, `h1`, Geist lede) and then goes straight to its list: a
`Register` of rows, or the ruled entries of `/projects`.

The fixed header's height is `--header-h`. `scroll-margin-top` and the sticky rails derive from it;
never hard-code a second clearance number.

Landing sections use the full `max-w-6xl` column (`LandingSection`), because the log rows need the
width. Every `PageColumn` route nests `max-w-4xl` inside it, so prose pages start 128px further in.
That difference is the layout, not drift: do not "fix" it by widening a prose page or narrowing the
landing rows.

## Prose block anatomy

A prose section composes three parts, in this order:

```tsx
<ProseSection aria-labelledby="story">
  <SectionHeading id="story">story</SectionHeading>
  <ProseSectionBody>{/* paragraphs */}</ProseSectionBody>
</ProseSection>
```

- `ProseSection` is a `<section>` with the reveal animation. Pass `aria-labelledby` with the heading
  `id` — it is a native attribute and flows through to the section.
- `SectionHeading` takes the same value as its own `id`. The string appears twice on purpose — that
  is what splitting the anchor from the label costs, and duplicating it is correct.
- `ProseSectionBody` is the measure column (`max-w-prose`), `flex-col gap-4`, stone-600 body. It is
  the only place the prose measure is declared.
- `CvSection` takes `id` and wraps the section. `CvSectionHeading` takes the heading as children and
  uses a `$` prompt instead of the `#` hash.
- The landing story is the one prose grid that is deliberately unequal: `lg:col-span-5` +
  `lg:col-span-7 lg:pl-12`. The narrow left column is the design, not a measure bug; the right
  column lands on the prose measure, the left runs shorter.

Correct — three parts, heading id on the heading and `aria-labelledby` on the section:

```tsx
<ProseSection aria-labelledby="philosophy">
  <SectionHeading id="philosophy">philosophy</SectionHeading>
  <ProseSectionBody>
    <p>I build in small vertical slices.</p>
  </ProseSectionBody>
</ProseSection>
```

Incorrect — a hand-rolled heading and a raw measure:

```tsx
// No aria-labelledby, no hash, and a second measure declaration
<section class="max-w-prose leading-[1.8]">
  <h2 class="font-mono text-xs">philosophy</h2>
</section>
```

## Registers and rails

Most browsable lists are a `Register` of `RegisterRow`s with one action per row. Empty states are
`EmptyRegister`; the way back is `ReturnToRegister`. A page with a side rail composes
`RegisterWithRail`: main content (including the mobile disclosure) plus shell-less rail content; the
grid, the sticky offset, and the desktop-only aside stay in the component.

Two ruled exceptions keep their own shape: `/projects` divides entries with a single rule and no
frame (`docs/design/projects.md`), and `/cv` keeps its compact `$`-marked sections for print. Record
rows with linked labels stay hand-rolled: `RecordRow` takes a plain-text label only.

## Content models

Elements mean what the spec says, so the tag must match the content, not the styling:

- Polymorphic `as` stays inside one family: `ul` takes `li`, `dl` takes `dt`/`dd` groups (a plain
  `div` may wrap one group), `details` takes exactly one leading `summary`. Never cross families.
- Every `section` carries a name. `DocumentSection` pairs `aria-labelledby` with its `h2`;
  `LandingSection` names itself with its command.
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
