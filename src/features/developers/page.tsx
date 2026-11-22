import { DevelopersFooter } from "@features/developers/footer"
import { DevelopersJsonErrors } from "@features/developers/json-errors"
import { DevelopersOnThisPage } from "@features/developers/on-this-page"
import { DevelopersQuickstart } from "@features/developers/quickstart"
import { DevelopersResources } from "@features/developers/resources"
import { DevelopersResponses } from "@features/developers/responses"
import { DevelopersStability } from "@features/developers/stability"

export function DevelopersPage() {
    return (
        <>
            <DevelopersOnThisPage />
            <DevelopersResources />
            <DevelopersQuickstart />
            <DevelopersJsonErrors />
            <DevelopersResponses />
            <DevelopersStability />
            <DevelopersFooter />
        </>
    )
}
