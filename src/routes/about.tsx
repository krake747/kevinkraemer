import { AboutBackground } from "@features/about/background"
import { AboutElsewhere } from "@features/about/elsewhere"
import { AboutOutside } from "@features/about/outside"
import { AboutWork } from "@features/about/work"
import { DocumentPage, PageHeaderTitle } from "@pattern/page"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal"

export default function AboutRoute() {
    return (
        <DocumentPage>
            <header class="animate-rise">
                <TerminalCommandHeader command="cat story.md" class="mb-4" />
                <PageHeaderTitle>Hi, I'm Kevin.</PageHeaderTitle>
            </header>
            <Seo
                title="About"
                description="Full-stack developer in Luxembourg. I came to software from financial risk, where the small tools I wrote were the part I looked forward to."
                path="/about"
            />
            <AboutBackground />
            <AboutWork />
            <AboutOutside />
            <AboutElsewhere />
        </DocumentPage>
    )
}
