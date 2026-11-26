---
name: kevinkraemer.com
tagline: "My personal site, built like a tool I'd want to use."
category: site
featured: true
status: Live
year: 2025
stack:
  - Solid
  - TypeScript
  - Tailwind CSS
role: "Design and engineering, end to end."
liveUrl: https://www.kevinkraemer.com
repoUrl: https://github.com/krake747/kevinkraemer
figure:
  label: routes prerendered
  source: prerender-routes
order: 1
problem:
  "I wanted one address for the work. The projects show what I built, the logs show how I think, and
  the command palette gets you anywhere fast."
decisions:
  - title: "A Bloomberg screen meets a terminal."
    reason:
      "I spent years reading Bloomberg screens as a risk analyst, and now I live in terminals.
      Mixing the two felt like fun, and it fits: dense, fast, no decoration."
  - title: "Never finished."
    reason:
      "The first version was rough. I keep this site as the place where I try things out: the
      design, the writing, the motion. It is never done, and that is the point."
implementation:
  "The site is one Solid app, prerendered to static pages when I deploy. The words are Markdown
  files, checked against a schema at build time, so a typo breaks the build instead of the page.
  Search runs off a Pagefind index, and the ask box and agent endpoints run as Netlify functions."
evidence:
  - caption:
      "Content is generated at build time, so the home page renders three log rows with no fetching
      and no spinner. The words are already there."
tradeoffs:
  - title: "Typos break the build."
    reason:
      "Every Markdown file is checked against a schema before it renders. That costs me a red build
      now and then; the return is a page that never renders half-missing."
  - title: "No live numbers."
    reason:
      "Nothing here is a real quote. The market look is presentation, not prices, so there are no
      live widgets to operate, break, or mislead anyone."
---
