import { siteContent } from "@core/content/site-content"
import { canonicalFor } from "@core/site/urls"
import { LogFilter } from "@features/log/filter"
import { LogNoScript } from "@features/log/no-script"
import { PageShell } from "@pattern/page-shell"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export default function LogsRoute() {
    return (
        <PageShell>
            <Seo
                title="Logs"
                description="Thoughts on software architecture, type systems, finance meets code, and the spaces between."
                path="/logs"
                breadcrumbs={[{ name: "Home", url: canonicalFor("/") }, { name: "Logs" }]}
            />
            <section>
                <div class="mb-12">
                    <TerminalCommandHeader command="cd ~/logs" class="mb-4" />
                    <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">Logs</h1>
                    <p class="mt-3 max-w-2xl text-sm/relaxed text-stone-600 dark:text-stone-400">
                        What I'm figuring out about building software, written down as I go.
                    </p>
                </div>

                <LogFilter entries={siteContent.logs} />

                <LogNoScript entries={siteContent.logs} />
            </section>
        </PageShell>
    )
}
