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
  "I wanted one address for the work. The register shows the cases. The stream shows the thinking.
  The palette jumps anywhere."
decisions:
  - title: "A Bloomberg screen meets a terminal."
    reason:
      "The design is a homage to both sides of my path. I used to be a financial risk analyst,
      looking at Bloomberg screens all day. Now I'm a software developer living in tools like
      OpenCode, Herdr and Ghostty. Mixing the two felt like fun."
  - title: "Built to iterate."
    reason:
      "The first version was rough. The register, the case file, the motion pass, and this directory
      each landed as their own commit. Design holds."
implementation:
  "Solid 2 with filesystem routes, prerendered to static HTML at build time. Content lives as
  Markdown and is validated against a schema before it renders, so a typo fails the build instead of
  shipping a broken page. Search is a Pagefind index, and /ask and /mcp run as Netlify functions."
evidence:
  - caption:
      "I run pnpm generate and the content bundle lands. The home stream renders 3 rows. No fetch.
      No spinner. You read the stream."
tradeoffs:
  - title: "Strict intake for loose authorship."
    reason:
      "Authors write Markdown, but every field is schema-checked at build time. The cost is a failed
      build on a typo; the return is no broken page ever ships."
  - title: "Metaphor without live data."
    reason:
      "The market language is presentation, not prices. No live widgets means nothing to operate,
      nothing to break, and nothing a visitor can mistake for a real quote."
---
