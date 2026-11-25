import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { TerminalCommandHeader } from "@pattern/terminal"

export function LogHeader() {
    return (
        <PageHeader class="mb-12">
            <TerminalCommandHeader command="cd ~/logs" class="mb-4" />
            <PageHeaderTitle>Logs</PageHeaderTitle>
        </PageHeader>
    )
}
