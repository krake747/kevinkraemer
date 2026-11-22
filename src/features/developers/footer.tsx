import { DevelopersProse } from "@features/developers/prose"
import { Anchor } from "@ui/anchor"

export function DevelopersFooter() {
    return (
        <footer class="pt-6">
            <DevelopersProse>
                For retrieval guidance aimed at language models, see{" "}
                <Anchor href="/llms.txt" variant="prose" rel="external">
                    llms.txt
                </Anchor>
                . No API keys are required; everything above is public.
            </DevelopersProse>
        </footer>
    )
}
