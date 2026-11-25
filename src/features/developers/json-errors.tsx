import { origin } from "@core/site/urls"
import { DevelopersProse } from "@features/developers/prose"
import { CodeBlock } from "@pattern/code-block"
import { DocumentSection } from "@pattern/document-section"
import { InlineCode } from "@ui/inline-code"
import { SectionHeading } from "@ui/section-heading"

const JSON_ERROR_EXAMPLE = `curl -H "Accept: application/json" \
  ${origin}/path-that-does-not-exist`

const JSON_ERROR_BODY = `{
  "type": "https://httpstatuses.com/404",
  "title": "Not Found",
  "status": 404,
  "detail": "No page exists at /path-that-does-not-exist.",
  "code": "NOT_FOUND",
  "hint": "Check the URL against /sitemap-index.xml or read /llms.txt."
}`

export function DevelopersJsonErrors() {
    return (
        <DocumentSection aria-labelledby="json-errors-heading">
            <SectionHeading id="json-errors-heading">json errors</SectionHeading>
            <div class="grid gap-6">
                <CodeBlock>{JSON_ERROR_EXAMPLE}</CodeBlock>
                <DevelopersProse>
                    Errors follow RFC 9457 problem details with the site extensions <InlineCode>code</InlineCode> and{" "}
                    <InlineCode>hint</InlineCode>:
                </DevelopersProse>
                <CodeBlock>{JSON_ERROR_BODY}</CodeBlock>
            </div>
        </DocumentSection>
    )
}
