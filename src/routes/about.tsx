import { AboutBackground } from "@features/about/background"
import { AboutElsewhere } from "@features/about/elsewhere"
import { AboutOutside } from "@features/about/outside"
import { AboutWork } from "@features/about/work"
import { DocumentPage } from "@pattern/document-page"
import { Seo } from "@pattern/seo"

export default function AboutRoute() {
    return (
        <DocumentPage
            command="cat story.md"
            title="Hi, I'm Kevin."
            lede="Full-stack developer in Luxembourg. I started in financial risk; now I build the tools instead of the reports."
        >
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
