export function CvDates(props: { start: string; end: string | null; separator?: "-" | "to" }) {
    return (
        <div class="mb-3 font-mono text-xs text-stone-600 tabular-nums dark:text-stone-300">
            <span>{props.start}</span>
            <span class="mx-1">{props.separator ?? "-"}</span>
            <span>{props.end ?? "Present"}</span>
        </div>
    )
}
