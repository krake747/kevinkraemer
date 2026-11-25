import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { ReturnToRegister } from "@pattern/register"
import { ResourceNotFound } from "@pattern/resource-not-found"
import { httpStatus } from "@solidjs/web"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export function ProjectNotFound() {
    httpStatus(404)
    return (
        <ResourceNotFound>
            <PageHeader>
                <TerminalCommandHeader command="cat missing.txt" class="mb-4" />
                <PageHeaderTitle>Case file not found</PageHeaderTitle>
            </PageHeader>
            <ReturnToRegister href="/projects" class="mt-6">
                Back to all case files
            </ReturnToRegister>
        </ResourceNotFound>
    )
}
