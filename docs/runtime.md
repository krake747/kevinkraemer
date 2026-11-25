# Runtime: edge negotiation, on-demand routes, preview

Source of truth: `netlify/edge-functions/`, `netlify.toml`, `scripts/function.ts`, `src/routes/`.

## Markdown and JSON negotiation

`Accept: text/markdown` or a `.md` suffix returns the page through turndown with
`Content-Type: text/markdown` plus `x-markdown-tokens`. Extension-less, `.html`, and `.md` page
paths negotiate; `*.txt`, `*.xml`, images, `/.well-known/*`, `/assets/*`, and `/pagefind/*` pass
through. `Accept: application/json` returns a typed page descriptor; missing pages return a real 404
problem body. No SPA fallback. Pure logic lives in `netlify/edge-functions/lib/negotiation.ts`;
conversion in `lib/markdown.ts`. See `docs/adr/0004-edge-negotiation-conversion.md`.

## On-demand routes and preview

`/ask` and `/mcp` are file-system routes whose handlers live in `src/features/` behind
`Request -> Response`. `scripts/function.ts` emits `dist/functions/api.mjs` and declares both paths
in its inline `config`. The MCP server card is a static file; the edge layer stamps its media type.
`pnpm preview` serves `dist/client/` with the function and edge function and is the only local stack
exercising negotiation; e2e runs against it. Keep `netlify/edge-functions/` to production
entrypoints plus `lib/`; no top-level specs there.

## In-browser tools

Where a browser exposes `document.modelContext` or `navigator.modelContext`, the app registers three
WebMCP tools when hydration ends: `search_logs`, `read_log` (which fetches `/logs/{id}.md`), and
`open_page`. Tool shapes and matching live in `src/features/webmcp/tools.ts`; registration in
`src/features/webmcp/register.ts` no-ops in browsers without the API, so the feature ships
everywhere and activates nowhere by default.
