# Glossary

A personal portfolio that presents skills, experience, and personality through a financial-market /
terminal metaphor. This glossary defines the canonical vocabulary for that domain; agents should use
these terms exactly when naming components, tests, issues, or copy.

## Market metaphor

The portfolio presents the developer's career as a traded instrument. All market vocabulary is
metaphor: nothing here connects to real markets or live data.

**Theme**: The color mode a visitor can toggle (light or dark); until they choose, it follows the
system preference, and the choice persists per visitor. _Avoid_: skin, appearance, display mode,
market theme

**Headline Figure**: The one sourced number a project carries on the `/projects` index, with its
unit (`16 routes prerendered`). At most one per project, and it is proof rather than a KPI. _Avoid_:
metric, stat, number block, KPI

## Terminal grammar

The terminal is the medium, not costume: these are structural elements with real utility, never
decoration.

**Terminal Command Header**: The monospace shell command (e.g. `whoami`, `cat story.md`) that opens
every section. Exactly one command per section, no subordinate text beneath it. _Avoid_: eyebrow,
kicker, section label

**Command Palette**: The Cmd+K overlay combining page navigation, actions, and Pagefind search
results. _Avoid_: search bar, launcher, spotlight

**Pixel Avatar**: The 6×5-pixel face in the fixed footer. Its mood follows the route: `idle`
everywhere, `wink` on `/about`, `sleepy` on `/logs`, `talk` on `/contact`, `scan` on `/`. Between
midnight and 6am local time it is `sleepy` everywhere. `sleepy` trails rising `z`s. _Avoid_: profile
picture, mascot, avatar image

**Logs**: The blog, presented as log entries under `cd ~/logs` (the home stream opens with
`tail -f ~/logs`). Entries are written for the Passer-by: self-contained, referencing site copy
without restating it. _Avoid_: blog roll, news, journal

**Log Entry**: One written piece under `/logs`, addressed to the Passer-by and reachable at
`/logs/{id}`. _Avoid_: post, blog post, article

**Passer-by**: The assumed Log reader: anyone arriving at an entry directly from a search result or
shared link, with zero prior context about Kevin or the site. _Avoid_: audience, visitor, reader

**Specimen Panel**: The creative north star: interface elements treated as deliberate typographic
specimens, borrowing Bloomberg Terminal density without nostalgia. Defined in full in
`docs/design/system.md`. _Avoid_: card, dashboard

**StackRow**: The `src/ui` framed-row primitive.

**ViewportFrame**: The viewport padding and fixed-header clearance every page sits in. _Avoid_:
wrapper, container, page padding

**PageColumn**: The centered `max-w-6xl` column. Index, register, and custom pages compose on it
directly; document and detail pages get it through their page component. _Avoid_: shell, wrapper

**DocumentPage**: A prose document page: `PageColumn`, narrow measure, required `PageHeader`.
_Avoid_: ProseShell, shell, template

**DetailPage**: An entry page: `PageColumn` plus `Seo`. The route passes breadcrumbs through
`sectionTrail`. _Avoid_: DetailShell, shell, template

**LandingSection**: A landing section: full-width rule, reveal, exactly one `TerminalCommandHeader`.
_Avoid_: SectionShell, shell, block

**Register**: A browsable list of entries presented as uniform framed rows (the logs index, related
entries, search hits). One `RegisterRow` per entry. A `Register` with a side rail uses
`RegisterWithRail`. _Avoid_: list, grid, card deck, table

**RecordRow**: One labeled record in a case file or reference (role, stack, status). Label width is
a variant, never a call-site class. _Avoid_: key-value row, metadata row, field

**PageHeader**: The opening block of a page: `TerminalCommandHeader`, title, lede, optional meta.
The industry shape (Primer: title, description, actions); the `command` slot is this site's terminal
twist. _Avoid_: page hero, title block

**DocumentSection**: A labeled section: `section` plus `SectionHeading` plus a caller-chosen body.
_Avoid_: section wrapper, content block
