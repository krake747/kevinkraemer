import { DevelopersFooter } from "@features/developers/footer"
import { DevelopersJsonErrors } from "@features/developers/json-errors"
import { DevelopersOnThisPage } from "@features/developers/on-this-page"
import { DevelopersQuickstart } from "@features/developers/quickstart"
import { DevelopersResources } from "@features/developers/resources"
import { DevelopersResponses } from "@features/developers/responses"
import { DevelopersStability } from "@features/developers/stability"
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
            <DevelopersOnThisPage />
            <DevelopersResources />
            <DevelopersQuickstart />
            <DevelopersJsonErrors />
            <DevelopersResponses />
            <DevelopersStability />
            <DevelopersFooter />
        </ProseShell>
    )
}
