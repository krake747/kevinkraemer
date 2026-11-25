import { PageColumn, PageHeaderTitle } from "@pattern/page"
import { ReturnToRegister } from "@pattern/register"
import { TerminalCommandHeader } from "@pattern/terminal"
import { httpStatus } from "@solidjs/web"

export function LogNotFound() {
    httpStatus(404)
    return (
        <PageColumn>
            <header>
                <TerminalCommandHeader command="cat missing.txt" class="mb-4" />
                <PageHeaderTitle>Log not found</PageHeaderTitle>
            </header>
            <ReturnToRegister href="/logs" class="mt-6">
                Back to all logs
            </ReturnToRegister>
        </PageColumn>
    )
}
