import { AmaInterface } from "@features/ama/interface"
import { PageColumn, PageHeaderTitle } from "@pattern/page"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal"

export default function AmaRoute() {
    return (
        <PageColumn>
            <header class="mb-8 animate-rise">
                <TerminalCommandHeader command='echo "ask anything"' class="mb-4" />
                <PageHeaderTitle>Ask Me Anything</PageHeaderTitle>
            </header>
            <Seo
                title="Ask Me Anything"
                description="Ask anything about Kevin and this site. Answers come only from published pages and list sources."
                path="/ama"
            />
            <AmaInterface />
        </PageColumn>
    )
}
