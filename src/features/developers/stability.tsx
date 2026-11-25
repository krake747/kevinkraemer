import { DEPRECATION_SUNSET_DAYS } from "@core/site/policy"
import { DevelopersLead } from "@features/developers/lead"
import { DevelopersProse } from "@features/developers/prose"
import { DevelopersRow } from "@features/developers/row"
import { DocumentSection } from "@pattern/document-section"
import { Register } from "@pattern/register"
import { SectionHeading } from "@pattern/section-heading"
import { Anchor } from "@ui/anchor"
import { InlineCode } from "@ui/inline-code"

export function DevelopersStability() {
    return (
        <DocumentSection aria-labelledby="stability-heading">
            <SectionHeading id="stability-heading">stability</SectionHeading>
            <Register render={(renderProps) => <ul {...renderProps} />}>
                <DevelopersRow>
                    <DevelopersLead>Versioning</DevelopersLead>{" "}
                    <DevelopersProse>
                        Pinned through the <InlineCode>API-Version</InlineCode> header: send it to pin the version you
                        built against, read it back on every machine-readable response. Also echoed as{" "}
                        <InlineCode>apiVersion</InlineCode> in each JSON descriptor. Changes are additive only.
                    </DevelopersProse>
                </DevelopersRow>
                <DevelopersRow>
                    <DevelopersLead>Deprecation</DevelopersLead>{" "}
                    <DevelopersProse>
                        Signaled with <InlineCode>Deprecation: true</InlineCode> plus a <InlineCode>Sunset</InlineCode>{" "}
                        date at least {DEPRECATION_SUNSET_DAYS} days out. Removals are announced in{" "}
                        <Anchor href="/logs" variant="prose">
                            logs
                        </Anchor>{" "}
                        and{" "}
                        <Anchor href="/rss.xml" variant="prose" rel="external">
                            RSS
                        </Anchor>{" "}
                        before they take effect.
                    </DevelopersProse>
                </DevelopersRow>
                <DevelopersRow>
                    <DevelopersLead class="tabular-nums">Rate limits</DevelopersLead>{" "}
                    <DevelopersProse class="tabular-nums">
                        Rate-limited per address, no keys. Every page and API response carries{" "}
                        <InlineCode>RateLimit-Limit</InlineCode>, <InlineCode>RateLimit-Remaining</InlineCode>, and{" "}
                        <InlineCode>RateLimit-Reset</InlineCode>; a 429 adds <InlineCode>Retry-After</InlineCode> plus
                        the JSON error envelope. Prefer{" "}
                        <Anchor href="/llms-full.txt" variant="prose" rel="external">
                            llms-full.txt
                        </Anchor>{" "}
                        or{" "}
                        <Anchor href="/rss.xml" variant="prose" rel="external">
                            RSS
                        </Anchor>{" "}
                        over polling pages.
                    </DevelopersProse>
                </DevelopersRow>
            </Register>
        </DocumentSection>
    )
}
