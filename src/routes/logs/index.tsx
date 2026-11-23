import { siteContent } from "@core/content/site-content"
import { canonicalFor } from "@core/site/urls"
import { LogFilter } from "@features/log/filter"
import { LogHeader } from "@features/log/header"
import { LogNoScript } from "@features/log/no-script"
import { PageShell } from "@pattern/page-shell"
import { Seo } from "@pattern/seo"

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
                <LogHeader />
                <LogFilter entries={siteContent.logs} />
                <LogNoScript entries={siteContent.logs} />
            </section>
        </PageShell>
    )
}
