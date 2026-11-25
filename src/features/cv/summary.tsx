import { CvFact, CvFacts } from "@features/cv/facts"
import { StackRow } from "@pattern/stack-row"
import { For } from "solid-js"

const CV_FACTS = [
    { label: "Focus", value: "Full-stack · Software Engineering" },
    { label: "Status", value: "Currently @ Dennemeyer" },
    { label: "Domain", value: "Finance" },
    { label: "Stack", value: "TypeScript · C# · Go · React" },
    { label: "Exploring", value: "Rust · SolidJS" },
    { label: "Background", value: "Financial Risk Analysis" },
    { label: "Location", value: "Luxembourg" },
    { label: "Languages", value: "EN · LU · DE · FR" },
    { label: "Education", value: "Banking & Finance" },
    { label: "Interests", value: "Cyclist · Coding · Learner · Dining" },
]

export function CvSummary() {
    return (
        <div class="animate-fade-up">
            <StackRow class="text-sm">
                <CvFacts>
                    <For each={CV_FACTS}>{(fact) => <CvFact label={fact.label}>{fact.value}</CvFact>}</For>
                </CvFacts>
            </StackRow>
        </div>
    )
}
