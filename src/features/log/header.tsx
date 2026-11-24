import { DossierHead } from "@pattern/dossier-head"

export function LogHeader() {
    return (
        <DossierHead
            command="cd ~/logs"
            title="Logs"
            lede="What I'm figuring out about building software, written down as I go."
            class="mb-12"
        />
    )
}
