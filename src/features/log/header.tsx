import { PageHeader, PageHeaderTitle } from "@pattern/page-header"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export function LogHeader() {
    return (
        <PageHeader class="mb-12">
            <TerminalCommandHeader command="cd ~/logs" class="mb-4" />
            <PageHeaderTitle>Logs</PageHeaderTitle>
        </PageHeader>
    )
}
