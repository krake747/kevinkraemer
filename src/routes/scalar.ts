import { html } from "@core/site/respond"
import { buildTitle } from "@core/site/seo"
import { canonicalFor } from "@core/site/urls"
import { colorScheme } from "@core/theme"
import { preferencesScript } from "@ui-sdk/core"

const pageTitle = buildTitle("API Reference")
const description =
    "Interactive reference for the kevinkraemer.com retrieval API: content negotiation, agent endpoints, the ask API, and the MCP server."
const canonical = canonicalFor("/scalar")

const themeScript = preferencesScript([colorScheme])

function htmlDocument(): string {
    return `<!doctype html>
<html lang="en" class="kk-scrollbar" data-color-scheme="system">
    <head>
        <script>${themeScript}</script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="color-scheme" content="light dark" />
        <meta name="description" content="${description}" />
        <link rel="canonical" href="${canonical}" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/svg+xml" href="/favicon-light.svg" media="(prefers-color-scheme: dark)" />
        <title>${pageTitle}</title>
        <link rel="preload" href="/fonts/geist-variable.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
        <style>
            html,
            body {
                height: 100%;
                margin: 0;
            }
            #app {
                min-height: 100dvh;
            }
        </style>
    </head>
    <body>
        <div id="app"></div>
        <p id="scalar-fallback" style="font-family: monospace; padding: 2rem">
            Loading the API reference… If it does not appear, read the raw document at
            <a href="/openapi.json">/openapi.json</a>.
        </p>
        <noscript>
            <p style="font-family: monospace; padding: 2rem">
                The interactive reference needs JavaScript. Read the raw OpenAPI document at
                <a href="/openapi.json">/openapi.json</a> instead.
            </p>
        </noscript>
        <script type="module">
            const app = document.querySelector("#app")
            const fallback = document.querySelector("#scalar-fallback")
            const scheme = document.documentElement.getAttribute("data-color-scheme")
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
            const darkMode = scheme === "dark" || (scheme === "system" && prefersDark)
            try {
                const { createApiReference } =
                    await import("https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.79.0/esm.js")
                createApiReference(app, { url: "/openapi.json", darkMode })
                fallback?.remove()
            } catch {
                if (fallback) {
                    fallback.textContent = "The API reference could not load. Read the raw document at /openapi.json."
                }
            }
        </script>
    </body>
</html>`
}

export function GET(): Response {
    return html(htmlDocument())
}
