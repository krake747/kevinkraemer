import { PageHeader, PageHeaderTitle } from "@pattern/page"
import { TerminalCommandHeader } from "@pattern/terminal"

export function LogHeader() {
    return (
        <PageHeader class="mb-8">
            <TerminalCommandHeader command="cd ~/logs" class="mb-4" />
            <PageHeaderTitle>Logs</PageHeaderTitle>
        </PageHeader>
    )
}
