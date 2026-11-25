import { PageColumn } from "@pattern/page-column"
import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { ReturnToRegister } from "@pattern/register"
import { TerminalCommandHeader } from "@pattern/terminal"
import { httpStatus } from "@solidjs/web"

export function LogNotFound() {
    httpStatus(404)
    return (
        <PageColumn>
            <PageHeader>
                <TerminalCommandHeader command="cat missing.txt" class="mb-4" />
                <PageHeaderTitle>Log not found</PageHeaderTitle>
            </PageHeader>
            <ReturnToRegister href="/logs" class="mt-6">
                Back to all logs
            </ReturnToRegister>
        </PageColumn>
    )
}
