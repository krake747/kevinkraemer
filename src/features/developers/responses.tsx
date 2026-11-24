import { DevelopersLead } from "@features/developers/lead"
import { DevelopersProse } from "@features/developers/prose"
import { DevelopersRow } from "@features/developers/row"
import { DocumentSection } from "@pattern/document-section"
import { Register } from "@pattern/register"
import { For } from "solid-js"

type ResponseRow = {
    code: string
    title: string
    body: string
}

const RESPONSE_ROWS: ResponseRow[] = [
    {
        code: "200",
        title: "Resource exists",
        body: "HTML by default, markdown for text/markdown, JSON descriptor for application/json.",
    },
    {
        code: "404",
        title: "Path does not exist",
        body: "Markdown variant points back at llms.txt and the sitemap. JSON variant returns the RFC 9457 envelope.",
    },
    {
        code: "Vary",
        title: "Accept, Accept-Encoding",
        body: "Negotiated responses are cached per representation. Never reuse a cached HTML body for a markdown request.",
    },
]

export function DevelopersResponses() {
    return (
        <DocumentSection id="responses-heading" title="responses">
            <Register as="ul">
                <For each={RESPONSE_ROWS}>
                    {(row) => (
                        <DevelopersRow>
                            <DevelopersLead class="tabular-nums">
                                {row.code} <span class="text-stone-600 dark:text-stone-400">· {row.title}</span>
                            </DevelopersLead>{" "}
                            <DevelopersProse>{row.body}</DevelopersProse>
                        </DevelopersRow>
                    )}
                </For>
                <DevelopersRow>
                    <DevelopersLead>
                        Files <span class="text-stone-600 dark:text-stone-400">: *.txt, *.xml</span>
                    </DevelopersLead>{" "}
                    <DevelopersProse>
                        Served untouched, or as a typed JSON FileDescriptor for application/json.
                    </DevelopersProse>
                </DevelopersRow>
            </Register>
        </DocumentSection>
    )
}
