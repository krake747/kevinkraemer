# Domain Docs

Source of truth: `GLOSSARY.md` at repo root, `docs/adr/` for decisions. This file caches only the
gotcha the layout cannot say.

A skill is done when it uses `GLOSSARY.md` terms and flags any ADR conflict.

## Before exploring: read these

- `GLOSSARY.md` at the repo root; `docs/adr/` read ADRs that touch the area you will change, start
  with `docs/adr/README.md`.

## Layout: single-context

`GLOSSARY.md` plus `docs/adr/` live at the root.

## Use the glossary's vocabulary

Why synonyms drift from the domain. Solve name concepts with `GLOSSARY.md` terms; if the term is
missing, either reconsider the language or note the gap.

## Flag ADR conflicts

Why silently overriding an ADR hides the decision. Solve surface it: _Contradicts ADR-XXXX, but
worth reopening because …_
