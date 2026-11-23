import { Anchor } from "@ui/anchor"

export function NotFoundRecovery() {
    return (
        <nav
            aria-label="Recovery"
            class="mb-8 flex animate-fade-up flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
            <Anchor href="/llms.txt" variant="subtle" rel="external" class="underline">
                llms.txt
            </Anchor>
            <Anchor href="/developers" variant="subtle" class="underline">
                developers
            </Anchor>
            <Anchor href="/sitemap-index.xml" variant="subtle" rel="external" class="underline">
                sitemap
            </Anchor>
            <Anchor href="/logs" variant="subtle" class="underline">
                logs
            </Anchor>
        </nav>
    )
}
