import type { EmploymentPeriod } from "@core/content/model"
import { merge, type VoidProps } from "solid-js"

function endLabel(period: EmploymentPeriod): string {
    switch (period.kind) {
        case "current": {
            return "Present"
        }
        case "past": {
            return period.end
        }
        default: {
            const exhaustive: never = period
            return exhaustive
        }
    }
}

export function CvDates(_props: VoidProps<{ period: EmploymentPeriod; separator?: "-" | "to" }>) {
    const props = merge({ separator: "-" } as const, _props)
    return (
        <div class="mb-3 font-mono text-xs text-stone-600 tabular-nums dark:text-stone-300">
            <span>{props.period.start}</span>
            <span class="mx-1">{props.separator}</span>
            <span>{endLabel(props.period)}</span>
        </div>
    )
}
