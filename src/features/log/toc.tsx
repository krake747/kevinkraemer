import type { LogTocEntry } from "@core/content/model"
import { DisclosureRow } from "@pattern/disclosure-row"
import { cva } from "@ui/cva.config"
import { PanelLabel } from "@ui/panel-label"
import { For, Show, createSignal, onSettled, type VoidProps } from "solid-js"

const tocLink = cva({
    base: "-ml-px block border-l py-1.5 pl-3 wrap-break-word font-mono text-xs transition-colors duration-150 ease-out-quart",
    variants: {
        state: {
            active: "border-emerald-500 text-emerald-800 dark:text-emerald-400",
            idle: "border-transparent text-stone-600 hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-400",
        },
    },
    defaultVariants: {
        state: "idle",
    },
})

export function LogTocDisclosure(props: VoidProps<{ entries: LogTocEntry[] }>) {
    return (
        <Show when={props.entries.length > 1}>
            <DisclosureRow
                class="mb-8"
                summary={
                    <>
                        <span class="group-open:hidden">+ on this page</span>
                        <span class="hidden group-open:inline">− on this page</span>
                        <span class="text-stone-600 tabular-nums dark:text-stone-400"> · {props.entries.length}</span>
                    </>
                }
            >
                <nav aria-label="On this page">
                    <ul class="flex flex-col gap-1">
                        <For each={props.entries}>
                            {(item) => (
                                <li>
                                    <a
                                        href={`#${item.id}`}
                                        class="block font-mono text-xs text-stone-600 dark:text-stone-400"
                                    >
                                        {item.text}
                                    </a>
                                </li>
                            )}
                        </For>
                    </ul>
                </nav>
            </DisclosureRow>
        </Show>
    )
}

export function LogToc(props: VoidProps<{ entries: LogTocEntry[] }>) {
    const [active, setActive] = createSignal<string | undefined>(undefined)

    onSettled(() => {
        const headings = [...document.querySelectorAll(".log-entry h2[id]")]
        if (headings.length > 0) {
            const hash = window.location.hash.slice(1)
            if (hash.length > 0) {
                setActive(hash)
            } else if (headings[0] instanceof HTMLElement) {
                setActive(headings[0].id)
            }
            const observer = new IntersectionObserver(
                (observed) => {
                    for (const one of observed) {
                        if (one.isIntersecting && one.target instanceof HTMLElement) {
                            setActive(one.target.id)
                        }
                    }
                },
                { rootMargin: "-96px 0px -70% 0px" },
            )
            for (const heading of headings) {
                observer.observe(heading)
            }
            return () => {
                observer.disconnect()
            }
        }
        return () => {}
    })

    return (
        <Show when={props.entries.length > 1}>
            <aside class="hidden lg:block">
                <nav
                    aria-label="On this page"
                    class="sticky top-[calc(var(--header-h)+1.5rem)] kk-scrollbar max-h-[calc(100vh-var(--header-h)-3rem)] overflow-y-auto"
                >
                    <PanelLabel>On this page</PanelLabel>
                    <ul class="border-l border-stone-200 dark:border-stone-800">
                        <For each={props.entries}>
                            {(item) => (
                                <li>
                                    <a
                                        href={`#${item.id}`}
                                        aria-current={active() === item.id ? "true" : "false"}
                                        class={tocLink({ state: active() === item.id ? "active" : "idle" })}
                                    >
                                        {item.text}
                                    </a>
                                </li>
                            )}
                        </For>
                    </ul>
                </nav>
            </aside>
        </Show>
    )
}
