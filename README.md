# Kevin Kraemer · Full-stack Developer Portfolio

[![Netlify Status](https://api.netlify.com/api/v1/badges/f958cbb7-8d3f-46d3-bde7-a7fd5d8a636f/deploy-status)](https://app.netlify.com/projects/kevinkraemer/deploys)

A terminal-inspired portfolio: a CV, logs, uses, contact, and a machine-readable surface for agents
(`llms.txt`, `openapi.json`, `/mcp`). Solid 2 with prerendered pages, Tailwind CSS v4, Pagefind, and
Netlify functions for the on-demand endpoints.

## Features

- Command Palette (`Cmd+K`): page navigation plus full-text search
- `/ask`: questions over site content, with sources
- Machine surface: `llms.txt`, `openapi.json`, `/mcp`, and API docs at `/scalar`
- Logs with RSS feed, plus CV, projects, uses, and contact pages
- Light and dark theme, follows the system until the visitor chooses

Production: [www.kevinkraemer.com](https://www.kevinkraemer.com)

## Run it locally

To run it locally, follow [CONTRIBUTING](CONTRIBUTING.md) for setup, secrets, and checks.

## Learn more

- [AGENTS.md](AGENTS.md): the index an agent loads before working here
- [GLOSSARY.md](GLOSSARY.md): domain vocabulary
- [docs/agents/](docs/agents/README.md): architecture, testing, review, prose
- [docs/design/](docs/design/system.md): the design system (system, tokens, structure, motion)
- [docs/adr/](docs/adr/README.md): recorded decisions
- [docs/](docs/discovery.md): crawler policy, SEO, feeds, AI retrieval
- [docs/runtime.md](docs/runtime.md): edge negotiation, on-demand routes

## License

Code: MPL-2.0 © 2025-2026 Kevin Kraemer, see [LICENSE](LICENSE).

Content (log entries, about/experience copy, images, CV PDF) is © Kevin Kraemer under CC BY-NC-ND
4.0, see [LICENSE-CONTENT](LICENSE-CONTENT).
