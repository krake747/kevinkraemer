import { origin } from "@core/site/urls"
import { DevelopersLead } from "@features/developers/lead"
import { DevelopersNumeral } from "@features/developers/numeral"
import { DevelopersProse } from "@features/developers/prose"
import { CodeBlock } from "@pattern/code-block"
import { DocumentSection, SectionHeading } from "@pattern/section"
import { InlineCode } from "@ui/inline-code"
import { For } from "solid-js"

type QuickstartStep = {
    title: string
    snippet: string
    hint: string
}

const QUICKSTART_STEPS: QuickstartStep[] = [
    {
        title: "Index",
        snippet: `curl ${origin}/llms.txt`,
        hint: "Site index with when-to-use guidance.",
    },
    {
        title: "Markdown",
        snippet: `curl -H "Accept: text/markdown" \\\n  ${origin}/logs`,
        hint: "Any page returns markdown instead of HTML.",
    },
    {
        title: "JSON",
        snippet: `curl -H "Accept: application/json" \\\n  ${origin}/cv`,
        hint: "Typed descriptor with canonical URL and representations.",
    },
    {
        title: "Agent inventory",
        snippet: `curl "${origin}/?mode=agent"`,
        hint: "Every endpoint with operation IDs, auth, and rate limits.",
    },
    {
        title: "Spec",
        snippet: `curl ${origin}/openapi.json`,
        hint: "OpenAPI description of the whole interface.",
    },
    {
        title: "Ask",
        snippet: `curl "${origin}/ask?question=What%20did%20Kevin%20build%20at%20Dennemeyer%3F"`,
        hint: "Plain-language answer with cited sources. POST JSON to /ask, or MCP to /mcp.",
    },
]

export function DevelopersQuickstart() {
    return (
        <DocumentSection aria-labelledby="quickstart-heading">
            <SectionHeading id="quickstart-heading">quickstart</SectionHeading>
            <ol class="flex flex-col gap-6">
                <For each={QUICKSTART_STEPS}>
                    {(step, index) => (
                        <li class="grid gap-2">
                            <DevelopersProse>
                                <DevelopersNumeral index={index()} class="mr-2" />{" "}
                                <DevelopersLead>{step.title}</DevelopersLead>
                                <span class="text-stone-500 dark:text-stone-400"> {step.hint}</span>
                            </DevelopersProse>
                            <CodeBlock>{step.snippet}</CodeBlock>
                        </li>
                    )}
                </For>
            </ol>
            <DevelopersProse class="mt-4">
                Nonexistent paths return HTTP 404 in both representations; treat it as proof the path does not exist.
                Send <InlineCode>Accept: application/json</InlineCode> anywhere for a typed descriptor, or an RFC 9457
                problem response with <InlineCode>code</InlineCode> and <InlineCode>hint</InlineCode> fields.
            </DevelopersProse>
        </DocumentSection>
    )
}
