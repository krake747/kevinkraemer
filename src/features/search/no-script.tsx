import { Anchor } from "@ui/anchor"

export function SearchNoScript() {
    return (
        <footer class="pt-6">
            <noscript>
                <p class="font-mono text-xs text-stone-600 dark:text-stone-400">
                    Search needs JavaScript. Browse{" "}
                    <Anchor href="/logs" variant="prose">
                        logs
                    </Anchor>
                    ,{" "}
                    <Anchor href="/cv" variant="prose">
                        cv
                    </Anchor>
                    , or{" "}
                    <Anchor href="/sitemap-index.xml" variant="prose">
                        sitemap
                    </Anchor>{" "}
                    instead.
                </p>
            </noscript>
        </footer>
    )
}
