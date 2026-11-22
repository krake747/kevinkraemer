import type { Project } from "@core/content/model"
import { TerminalCommandHeader } from "@ui/terminal-command-header"

export function ProjectHeader(props: { project: Project }) {
    return (
        <header class="mb-10">
            <TerminalCommandHeader command={`cat ${props.project.id}.md`} class="mb-4" />
            <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                {props.project.name}
            </h1>
            <p class="mt-3 font-mono text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {props.project.tagline}
            </p>
        </header>
    )
}
