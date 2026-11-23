import { siteContent } from "@core/content/site-content"
import { Anchor } from "@ui/anchor"

export function PrivacyFooter() {
    return (
        <footer class="animate-fade-up pt-6">
            <p class="font-mono text-xs text-stone-600 dark:text-stone-400">
                Last updated {siteContent.meta.buildDate} · For questions, see{" "}
                <Anchor href="/contact" variant="prose">
                    contact
                </Anchor>
                .
            </p>
        </footer>
    )
}
