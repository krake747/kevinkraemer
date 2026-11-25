import { PageColumn } from "@pattern/page-column"
import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { ReturnToRegister } from "@pattern/register"
import { TerminalCommandHeader } from "@pattern/terminal"
import { httpStatus } from "@solidjs/web"

export function ProjectNotFound() {
    httpStatus(404)
    return (
        <PageColumn>
            <PageHeader>
                <TerminalCommandHeader command="cat missing.txt" class="mb-4" />
                <PageHeaderTitle>Case file not found</PageHeaderTitle>
            </PageHeader>
            <ReturnToRegister href="/projects" class="mt-6">
                Back to all case files
            </ReturnToRegister>
        </PageColumn>
    )
}
