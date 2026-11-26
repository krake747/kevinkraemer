# HTML semantics: elements, landmarks, and what they imply for our naming

Source of truth: WHATWG HTML Living Standard (`sections.html`, `grouping-content.html`,
`interactive-elements.html`), WAI-ARIA 1.2, W3C HTML-ARIA. This file caches the readings; the specs
own every claim.

Primary sources only. WHATWG HTML Living Standard (24 Nov 2026): `sections.html` (§4.3),
`grouping-content.html` (§4.4), `interactive-elements.html` (§4.11). WAI-ARIA 1.2 (REC 06 Jun 2023):
§5.3.4 plus role definitions. W3C HTML-ARIA (`w3c.github.io/html-aria`) for implicit mappings. APG
Disclosure pattern for the no-role confirmation.

## 1. How HTML names and defines elements

- **Names are lowercase single words that state meaning, never presentation.** `header`, `nav`,
  `main`, `search`, `section`, `article`, `aside`, `footer`, `address`, `figure`, `details` describe
  what content _is_. Styling hooks live in `class`, not tag names.
- **Each element "represents" something; the representation is the contract.** The spec defines
  every element with "The X element represents …". If our content does not match that sentence, the
  tag is wrong no matter how convenient it is.
- **Generic containers are last resort, and the spec says so twice.** `div` "has no special meaning
  at all … Authors are strongly encouraged to view the `div` element as an element of last resort,
  for when no other element is suitable" (§4.4.16). `section` "is not a generic container element …
  appropriate only if the element's contents would be listed explicitly in the document's outline"
  (§4.3.3), i.e. it needs a heading. `p` "should not be used when a more specific element is more
  appropriate" (§4.4.1).
- **Landmarks are a closed vocabulary on top of sectioning.** Sectioning content is `article`,
  `aside`, `nav`, `section` (§4.3.2–4.3.5 category lines). ARIA 1.2 §5.3.4 Landmark Roles names
  eight landmarks: `banner`, `main`, `navigation`, `complementary`, `contentinfo`, `region`,
  `search`, `form`: each "User agents SHOULD treat … as navigational landmarks" (role sections
  `#banner`, `#main`, `#navigation`, `#complementary`, `#contentinfo`, `#region`, `#search`,
  `#form`). Implicit mapping (HTML-ARIA): `header`→`banner` and `footer`→`contentinfo` only at page
  level (not inside `article`/`aside`/`main`/`nav`/`section`), else `generic` (`#el-header`,
  `#el-footer`); `main`→`main` (`#el-main`); `nav`→`navigation` (`#el-nav`); `aside`→`complementary`
  (`#el-aside`); `section`→`region` **only with an accessible name**, else `generic`
  (`#el-section`); `search`→`search` (`#el-search`).

## 2. Element / role definitions for our inventory

- `article`: "a complete, or self-contained, composition … in principle, independently distributable
  or reusable" (§4.3.2). Choice vs `section` is author intent: "A section forms part of something
  else. An article is its own thing" (§4.3.12.1, non-normative). Implicit `article` role, not a
  landmark (ARIA `#article`).
- `section`: "a thematic grouping of content, typically with a heading" (§4.3.3). Chapters, tabbed
  pages, thesis sections. Needs a heading with very few exceptions.
- `nav`: "a section of a page that links to other pages or to parts within the page … primarily
  intended for sections that consist of major navigation blocks. Not all groups of links on a page
  need to be in a `nav` element … while a `nav` element can be used in such cases, it is usually
  unnecessary" (§4.3.4). A lone back-link is not a nav.
- `aside`: "content that is tangentially related to the content around the `aside` element, and
  which could be considered separate from that content", e.g. sidebars, pull quotes, groups of
  `nav`s (§4.3.5). Implicit `complementary` landmark.
- `h1`–`h6`: "represent headings for their sections"; level "corresponds to the levels of nested
  sections" (§4.3.6). Outline discipline (§4.3.11): at least one level-1 heading per document; each
  heading after a lead must be equal, or 1 greater, never skip down two levels. Implicit `heading` +
  `aria-level` (HTML-ARIA `#el-h1-h6`).
- `hgroup`: "a heading and related content": one `h1`–`h6` plus `p` subheading / alternative title /
  tagline, in that order (§4.3.7). Implicit `group` (HTML-ARIA `#el-hgroup`).
- `header`: "a group of introductory or navigational aids … intended to usually contain a heading …
  but this is not required"; can wrap a table of contents, a search form, logos; "is not sectioning
  content; it doesn't introduce a new section" (§4.3.8).
- `footer`: "a footer for its nearest ancestor sectioning content element, or for the body element";
  typically authorship, related links, copyright (§4.3.9).
- `address`: "the contact information for its nearest `article` or `body` element ancestor … must
  not be used to represent arbitrary addresses (e.g. postal addresses), unless those addresses are
  in fact the relevant contact information" (§4.3.10). Implicit `group` (HTML-ARIA `#el-address`).
- `main`: "the dominant contents of the document. A document must not have more than one `main`
  element that does not have the `hidden` attribute specified", and it must be hierarchically
  correct (not descended from forbidden ancestors) (§4.4.14). Our shell owns exactly one:
  `src/app.tsx:32` (`<main id="main">`). Implicit `main` landmark.
- `search`: "a part of a document … that contains a collection of form controls or other content
  related to performing a search or filtering operation … semantically identifies the purpose of the
  element's contents" (§4.4.15). Implicit `search` landmark.
- `p`: "a paragraph"; in HTML a paragraph is structural, not logical: lists cannot be children of
  `p` (§4.4.1). Implicit `paragraph` role (HTML-ARIA `#el-p`).
- `ul`: "order … not important … changing the order would not materially change the meaning"
  (§4.4.6). `ol`: "items … intentionally ordered, such that changing the order would change the
  meaning" (§4.4.5). `menu`: unordered list of commands, "a semantic alternative to `ul`" (§4.4.7).
  `li`: "Contexts in which this element can be used: Inside `ol`, `ul`, `menu` elements" only
  (§4.4.8); a heading inside `li` "likely does not convey the semantics that the author intended … a
  heading in a list implicitly splits the list into spanning multiple sections". Implicit `list` /
  `listitem`, and `listitem` MUST sit in a `list` (ARIA `#list`, `#listitem`; HTML-ARIA `#el-li`).
- `dl`: "an association list … zero or more name-value groups" of `dt`+`dd`; each group may be
  wrapped in `div`: "This does not change the semantics" (§4.4.9). `dt`: "the term, or name, part";
  content model forbids `header`/`footer`/sectioning/heading descendants (§4.4.10). `dd`: "the
  description, definition, or value, part" (§4.4.11). No implicit landmark/list role for
  `dl`/`dt`/`dd` (HTML-ARIA `#el-dl`, `#el-dt`, `#el-dd`); ARIA 1.2 still defines `term` and
  `definition` roles (ARIA `#term`, `#definition`), with `dfn` mapping to `term` (HTML-ARIA
  `#el-details` table row for `dfn`).
- `details`/`summary`: `details` "represents a disclosure widget from which the user can obtain
  additional information or controls"; content model is exactly one `summary` followed by flow
  content; "not … for tab widgets and menu widgets"; `name` builds an exclusive accordion, and
  related `details` "should" share a containing element such as `section` or `article` with a
  heading where sensible (§4.11.1). `summary` must be the first child and "represents a summary,
  caption, or legend" (§4.11.2). Implicit `details`→`group`; `summary` has no corresponding role
  when it is its parent's summary (HTML-ARIA `#el-details`, `#el-summary`).
- **ARIA has no disclosure role.** ARIA 1.2 contains no `disclosure` role (zero role definitions
  match; the only "disclosure" hits are W3C patent boilerplate). The APG Disclosure pattern defines
  disclosure as an element with role `button` plus `aria-expanded` (and optional `aria-controls`):
  never a native role. `details`/`summary` is the host-language equivalent; do not bolt
  `button`/`aria-expanded` onto `summary` (HTML-ARIA `#el-summary` allows no role on a real
  summary).

## 3. Mapping: component → element(s) → implied role → fit

| Component             | Renders                                                                                                           | Implied role / landmark                                                                | Fit and one-line reason                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PageHeaderTitle       | `h1` inside the route's own `header` (command `p`, `h1`, optional meta `div`)                                     | `heading`, level 1; the `header` is `banner` at page level (inside `main` → `generic`) | Fits: `header` is introductory aids usually containing a heading (§4.3.8); page has exactly one `h1` via this component; the `header` around it is plain markup, not a component.                                                                                                                                                                                                                                                                                          |
| DocumentPage          | `div` column + narrow `div`                                                                                       | `generic` / `generic`                                                                  | Fits: pure layout containers, `div` as last resort for styling (§4.4.16).                                                                                                                                                                                                                                                                                                                                                                                                  |
| DetailPage            | `Seo` (head metadata) + `PageColumn`                                                                              | none (metadata)                                                                        | Fits: no body semantics asserted. Breadcrumbs passed via `sectionTrail` are data, not `nav`: correct, since a crumb trail is not a major navigation block (§4.3.4).                                                                                                                                                                                                                                                                                                        |
| DocumentSection       | `section.animate-fade-up[aria-labelledby]` + `h2` + body                                                          | `region` named by the heading                                                          | Fits: thematic group with heading and accessible name, exactly the §4.3.3 + `#el-section` contract.                                                                                                                                                                                                                                                                                                                                                                        |
| TerminalSection       | `section` + border + command `p` + children, named by the command                                                 | `region` named by the command                                                          | Fits: the command is this site's section label, so `aria-labelledby` on the command element satisfies the §4.3.3 naming contract.                                                                                                                                                                                                                                                                                                                                          |
| PageColumn            | `div.flex-1` + padded centered `div`                                                                              | `generic`                                                                              | Fits: layout only.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Register              | `div` / `ul` / `dl`                                                                                               | `generic` / `list` / none implicit                                                     | Fits when the rendered tag matches the data: unordered entries → `ul`; name-value metadata → `dl`; anything else → `div`.                                                                                                                                                                                                                                                                                                                                                  |
| RegisterRow           | `StackRow` (`div`/`li`/`article`) wrapping one link (title, description, and meta as child parts, plus the arrow) | `generic` / `listitem` / `article`                                                     | Fits as `div` or as `li` inside `ul`-Register; strains as `article`: a row in a browsable index is part of something else, not independently distributable (§4.3.12.1). A title rendered as `h2`/`h3` strains inside `li`: a heading in a list item splits the list into sections (§4.4.8): keep `span` unless rows are true subsections. `LogEntryPanel` uses an `article` with an `h2` title for the author's article+heading shape (outline-valid after the page `h1`). |
| RegisterWithRail      | grid `div` + main-col `div` + labelled `aside.sticky`                                                             | `generic` + named `complementary`                                                      | Fits: rail is tangentially related sidebar content (§4.3.5 → `complementary`); `aside` correctly hidden on mobile while `DisclosureRow` carries the same content. The `aside` is named via `labelledby` pointing at the rail label.                                                                                                                                                                                                                                        |
| EmptyRegister         | `StackRow` (`div`) + status `p`s                                                                                  | `generic`                                                                              | Fits: status text in `p`s is honest (§4.4.1).                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ReturnToRegister      | muted back link                                                                                                   | `link`, no landmark                                                                    | Fits: a single link is not a navigation block, so no `nav` (§4.3.4).                                                                                                                                                                                                                                                                                                                                                                                                       |
| RecordRow             | `StackRow` (`div`) > `dt` label + caller `dd`                                                                     | `generic` (+ `term` only via `dfn`, not implied)                                       | Fits as `div` inside `dl`-Register (spec-sanctioned `div` group wrapper, §4.4.9; live use `src/features/project/metadata.tsx:9-11` is exactly this shape). `li` never sits inside `dl`: `li` is conforming only inside `ol`/`ul`/`menu` (§4.4.8).                                                                                                                                                                                                                          |
| Stack                 | `div` / `ul` / `dl`                                                                                               | `generic` / `list` / none implicit                                                     | Fits with the same data-driven choice as Register.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| StackRow              | polymorphic `div`/`li`/`details`/…                                                                                | depends on the rendered tag                                                            | Fits when `render` stays inside one content-model family (see §4); any cross-family pairing (e.g. `details` or `div` directly inside `ul`-Stack, `li` inside `dl`-Stack) breaks the parent's content model (§4.4.6, §4.4.8, §4.4.9).                                                                                                                                                                                                                                       |
| DocumentSectionBody   | `div` by default, or a `p` via `render`; `max-w-prose`                                                            | `generic` / `paragraph`                                                                | Fits: measure wrapper is pure styling (§4.4.16); `p` when the body is one paragraph.                                                                                                                                                                                                                                                                                                                                                                                       |
| SectionHeading        | `h2` + hash + text                                                                                                | `heading`, level 2                                                                     | Fits, under heading discipline: page `h1` comes only from PageHeaderTitle; sections `h2`; never skip to `h3`+ without an intervening level (§4.3.11).                                                                                                                                                                                                                                                                                                                      |
| TerminalCommandHeader | `p` + chevron + command                                                                                           | `paragraph`                                                                            | Fits: a one-line shell prompt is a structural paragraph (§4.4.1).                                                                                                                                                                                                                                                                                                                                                                                                          |
| PanelLabel            | uppercase mono `div`                                                                                              | `generic`                                                                              | Fits as text. In a register rail it names the `aside` through `RegisterWithRailRail` `labelledby` pointing at the `PanelLabel` `id`; the log TOC `aside` has no name of its own (its inner `nav` carries `aria-label`).                                                                                                                                                                                                                                                    |
| DisclosureRow         | `details` + `summary` + body `div`                                                                                | `group` + no-role summary                                                              | Fits: textbook disclosure widget (§4.11.1); mobile-only duplicates (`LogFilterDisclosure`, `ContactStatus` rendered as `details`) are display-gated, so no double exposure.                                                                                                                                                                                                                                                                                                |

## 4. Convention implications (each tied to a cited rule)

1. **A rendered tag must stay inside one semantic family.** `ul` accepts only `li` (+
   script-supporting); `li` lives only in `ol`/`ul`/`menu`; `dl` accepts only `dt`/`dd` groups
   optionally wrapped in `div`; `details` accepts exactly one leading `summary` (§4.4.6, §4.4.8,
   §4.4.9, §4.11.1). So `Stack`/`StackRow`, `Register`/`RegisterRow`, `RecordRow` may switch tags
   only within list-family (`ul`+`li`), description-family (`dl`+`div`+`dt`/`dd`), generic-family
   (`div`), or disclosure-family (`details`+`summary`): never across. Concretely: `RecordRow` is
   `div`-only (`li` would violate §4.4.8); a `StackRow` rendered as `details` requires a `Stack`
   rendered as `div` (or no Stack).
2. **Every `section` ships with a heading or an accessible name, no exceptions in our code.**
   `section` without either is exposed as `generic` while wearing sectioning clothes (`#el-section`)
   and violates "not a generic container" (§4.3.3). `DocumentSection` is the reference shape
   (`aria-labelledby` + `h2`); `TerminalSection` meets it by naming itself with its command.
3. **Landmark uniqueness is a SHOULD/ MUST pair: enforce both.** At most one non-hidden `main` per
   document (§4.4.14, owned by `src/app.tsx:32`); ARIA authors SHOULD mark no more than one `banner`
   and one `contentinfo` (ARIA `#banner`, `#contentinfo`); every `region` MUST carry a brief label
   (ARIA `#region`). Never add a second page-level `header`/`footer`/`main`; name every
   `region`-exposed `section`.
4. **Heading discipline: one `h1`, then step by one.** "At least a single heading … level 1" per
   document; a heading after a lead must be equal or exactly 1 greater (§4.3.11). `PageHeaderTitle`
   owns the `h1`; `SectionHeading` owns `h2`; a `RegisterRow` title may render as `h2`/`h3` only
   where the outline genuinely nests that deep, and never inside `li`, where a heading splits the
   list (§4.4.8).
5. **`dt`/`dd` containment is strict; `div` is the only legal wrapper.** `dt` forbids
   heading/sectioning/`header`/`footer` descendants (§4.4.10); keep `RecordRow` labels plain text.
   `dl` groups may be wrapped in `div` with no semantic change (§4.4.9): that is the licence
   `RecordRow`'s `StackRow`-as-`div` already uses. `dd` holds the value; multiple paragraphs of one
   value stay in one `dd`.
6. **Order decides `ul` vs `ol` vs `dl`: name the data, then pick the tag.** Order-irrelevant →
   `ul`; order-changing-meaning → `ol`; name-value → `dl` (§4.4.5, §4.4.6, §4.4.9). A register that
   is sortable/filterable but whose stored order carries no meaning stays `ul`. Never default to
   `div` when one of the three fits (`div` is last resort, §4.4.16).
7. **Disclosure means `details`/`summary` or APG-button, never a hybrid.** No ARIA `disclosure` role
   exists (verified against ARIA 1.2 role list); APG defines disclosure as `button` +
   `aria-expanded` (+ optional `aria-controls`). Our `DisclosureRow` takes the native path, so do
   not add `role="button"`/`aria-expanded` to `summary` (HTML-ARIA `#el-summary` forbids a role on a
   true summary). For exclusive accordions use the `name` attribute and keep the group inside one
   container with a heading (§4.11.1): do not hand-roll mutual exclusion in script.
8. **Name every landmark the site exposes.** `region` and `form` MUST have accessible names (ARIA
   `#region`, `#form`); prefer visible text via `aria-labelledby` (the `DocumentSection` pattern).
   Apply the same to the rail `aside`: point `aria-labelledby` at the `PanelLabel` (which needs an
   `id`) so the `complementary` landmark is not anonymous.

## 5. HTML we use with care

- **`<search>` (§4.4.15, implicit `search` landmark).** The log filter and site search controls sit
  in labelled `<search>` landmarks. Both use `aria-label`, matching their inputs' own labelling
  where no visible label text exists to reference.
- **`<address>` (§4.3.10).** `ContactStatus` (`src/features/contact/status.tsx`) renders
  contact-adjacent rows as a plain `dl`. If that block is the page author's contact information,
  `address` (implicit `group`) is the honest container; if it is arbitrary metadata, keep `dl`. Note
  the scope trap: `address` always describes the nearest `article`/`body` ancestor, so placing it
  inside the rail `aside` still claims page-level contact info, and only use it if that claim is
  true.
- **`<hgroup>` (§4.3.7).** The page `header` (command `p` + `h1`, optional meta) does not match the
  spec's `hgroup` shape (tagline `p` + `h1` + `p`), so there is no `hgroup` to add.
