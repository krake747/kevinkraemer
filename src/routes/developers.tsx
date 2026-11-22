import { DevelopersPage } from "@features/developers/page"
import { ProseShell } from "@pattern/prose-shell"
import { Seo } from "@pattern/seo"
import { Anchor } from "@ui/anchor"

export default function DevelopersRoute() {
    return (
        <ProseShell
            command="cat developers.md"
            title="Developer documentation"
            lede={
                <>
                    kevinkraemer.com is machine-readable. Every page is available as HTML or markdown, and the files
                    below expose its content as data for agents and tooling. The whole interface is described by an{" "}
                    <Anchor href="/openapi.json" variant="prose" rel="external">
                        OpenAPI specification
                    </Anchor>
                </>
            }
        >
            <Seo
                title="Developers"
                description="Machine-readable endpoints, OpenAPI specification, markdown content negotiation, and retrieval quickstart for agents and tooling on kevinkraemer.com."
                path="/developers"
            />
            <DevelopersPage />
        </ProseShell>
    )
}
