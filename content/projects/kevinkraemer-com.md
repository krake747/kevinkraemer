---
name: kevinkraemer.com
tagline: "A personal site built like a tool: fast, useful, and always evolving."
category: site
featured: true
status: Live
year: 2025
stack:
  - Solid
  - TypeScript
  - Tailwind CSS
role: "Design and passion project."
liveUrl: https://www.kevinkraemer.com
repoUrl: https://github.com/krake747/kevinkraemer
figure:
  label: routes prerendered
  source: prerender-routes
order: 1
problem: >-
  I wanted one place for everything I make and think about. Projects show what I build, logs capture
  how I think, and the command palette makes everything one keystroke away.
decisions:
  - title: "A Bloomberg screen meets a developer terminal."
    reason: >-
      I spent years reading Bloomberg screens as a risk analyst. Now I spend my days in developer
      terminals. Bringing those worlds together felt natural: dense information, fast navigation,
      and no decoration without a purpose.
  - title: "A site that's never finished."
    reason: >-
      I built the site because I wanted a place to experiment. The first version was rough, and
      that's fine. I keep iterating on the design, writing, and interactions. The site evolves
      alongside what I learn.
implementation: >-
  The site is a single Solid application, prerendered into static pages at deploy time. Content
  lives in Markdown files and is validated against schemas during the build, catching mistakes
  before they reach production. Search uses a Pagefind index, while the ask box and agent endpoints
  run as Netlify Functions.
evidence:
  - caption: >-
      Content is generated at build time. The homepage renders its three latest log entries directly
      into the HTML: no fetching, no loading state, no spinner. The content is already there.
tradeoffs:
  - title: "Typos fail the build."
    reason: >-
      Every Markdown file is validated against a schema before rendering. A small mistake can break
      a build, but I'd rather catch it there than ship incomplete content.
  - title: "No live market data."
    reason: >-
      The market-terminal aesthetic is visual language, not a promise of live financial data. There
      are no live quotes or widgets to maintain, break, or mislead.
---
