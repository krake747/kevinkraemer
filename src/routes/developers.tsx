import { DevelopersFooter } from "@features/developers/footer"
import { DevelopersJsonErrors } from "@features/developers/json-errors"
import { DevelopersOnThisPage } from "@features/developers/on-this-page"
import { DevelopersQuickstart } from "@features/developers/quickstart"
import { DevelopersResources } from "@features/developers/resources"
import { DevelopersResponses } from "@features/developers/responses"
import { DevelopersStability } from "@features/developers/stability"
import { DocumentPage } from "@pattern/document-page"
import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { Seo } from "@pattern/seo"
import { TerminalCommandHeader } from "@pattern/terminal-command-header"

export default function DevelopersRoute() {
    return (
        <DocumentPage>
            <PageHeader class="animate-rise">
                <TerminalCommandHeader command="cat developers.md" class="mb-4" />
                <PageHeaderTitle>Developer documentation</PageHeaderTitle>
            </PageHeader>
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
        </DocumentPage>
    )
}
