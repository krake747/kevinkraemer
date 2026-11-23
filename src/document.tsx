import { HydrationScript } from "@solidjs/web"
import type { ParentProps } from "solid-js"

export default function Document(props: ParentProps) {
    return (
        <html lang="en" class="kk-scrollbar">
            <head>
                <script innerHTML={'document.documentElement.classList.add("js")'} />
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="color-scheme" content="light dark" />
                <link rel="ard" href="/.well-known/ard.json" />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" media="(prefers-color-scheme: light)" />
                <link rel="icon" type="image/svg+xml" href="/favicon-light.svg" media="(prefers-color-scheme: dark)" />
                <link
                    rel="preload"
                    href="/fonts/geist-variable.woff2"
                    as="font"
                    type="font/woff2"
                    crossorigin="anonymous"
                />
                <link
                    rel="preload"
                    href="/fonts/jetbrains-mono-latin-400-normal.woff2"
                    as="font"
                    type="font/woff2"
                    crossorigin="anonymous"
                />
                <HydrationScript />
            </head>
            <body class="flex min-h-dvh flex-col selection:bg-emerald-200 selection:text-stone-900 dark:selection:bg-emerald-700 dark:selection:text-white">
                <a
                    href="#main-content"
                    class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
                >
                    Skip to content
                </a>
                {props.children}
            </body>
        </html>
    )
}
