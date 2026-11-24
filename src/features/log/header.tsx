import { PageHeader } from "@pattern/page-header"

export function LogHeader() {
    return (
        <PageHeader
            command="cd ~/logs"
            title="Logs"
            lede="What I'm figuring out about building software, written down as I go."
            class="mb-12"
        />
    )
}
