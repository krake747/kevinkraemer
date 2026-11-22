import { StackRow } from "@ui/stack-row"
import { For } from "solid-js"

type SkillCategory = {
    name: string
    skills: string[]
}

const SKILL_CATEGORIES: SkillCategory[] = [
    {
        name: "Primary Stack",
        skills: ["TypeScript", "React", "Go", "C#"],
    },
    {
        name: "Cloud & Infrastructure",
        skills: ["Azure", "Kubernetes", "Helm", "CI/CD"],
    },
    {
        name: "Additional Tech",
        skills: ["MongoDB", "SQL", "Python", "Angular"],
    },
]

export function CvSkills() {
    return (
        <StackRow>
            <div class="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
                <For each={SKILL_CATEGORIES}>
                    {(category) => (
                        <div>
                            <h3 class="mb-2 font-mono text-xs tracking-wide text-stone-600 dark:text-stone-300">
                                {category.name}
                            </h3>
                            <div class="flex flex-col gap-1">
                                <For each={category.skills}>
                                    {(skill) => (
                                        <div class="flex items-center gap-2">
                                            <span class="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                                                #
                                            </span>{" "}
                                            <span class="text-sm text-stone-700 dark:text-stone-300">{skill}</span>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </StackRow>
    )
}
