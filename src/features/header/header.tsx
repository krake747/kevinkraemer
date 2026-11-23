import { getCurrentPageLabel, isActiveFor, TOP_NAV } from "@core/site/navigation"
import { CommandPalette } from "@features/command-palette/command-palette"
import { ThemeToggle } from "@features/theme/toggle"
import { useSectionLinks } from "@pattern/section-nav"
import { useLocation } from "@solidjs/router"
import { anchor } from "@ui/anchor"
import { cx } from "@ui/cva.config"
import { DecorMark } from "@ui/decor-mark"
import { For, Show, createMemo } from "solid-js"

export function Header() {
    const location = useLocation()
    const pageLabel = createMemo(() => getCurrentPageLabel(location.pathname))
    const sectionLinks = useSectionLinks()

    return (
        <header
            data-pagefind-ignore
            class="fixed top-0 right-0 left-0 z-40 h-(--header-h) border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm dark:border-stone-800 dark:bg-stone-950/95 print:hidden"
        >
            <div class="flex h-full max-w-full items-stretch text-sm">
                <div class="relative flex shrink-0 items-center gap-2 border-r border-stone-200 px-3 sm:px-4 dark:border-stone-800">
                    <a
                        href="/"
                        class="hit-area-x-5 hit-area-y-3.5 font-mono text-xs text-emerald-800 dark:text-emerald-300"
                        aria-label="Home"
                    >
                        KK
                    </a>
                    <DecorMark position="bottom-right" arm="short" />
                </div>
                <div class="flex flex-1 items-center border-r border-stone-200 px-3 md:hidden dark:border-stone-800">
                    <span class="font-mono text-xs text-stone-600 dark:text-stone-300">{pageLabel()}</span>
                </div>
                <div class="relative hidden flex-1 items-center justify-center border-r border-stone-200 px-2 sm:px-4 md:flex dark:border-stone-800">
                    <nav class="flex items-center gap-4">
                        <For each={TOP_NAV}>
                            {(item) => {
                                const active = () => isActiveFor(item, location.pathname)
                                return (
                                    <a
                                        href={item.href}
                                        aria-current={active() ? "page" : undefined}
                                        class={cx(
                                            "hit-area-x-1 hit-area-y-3",
                                            anchor({ variant: "nav" }),
                                            active() && "text-emerald-800 dark:text-emerald-400",
                                        )}
                                    >
                                        {item.label}
                                    </a>
                                )
                            }}
                        </For>
                    </nav>
                    <DecorMark position="bottom-right" arm="short" />
                </div>
                <div class="hidden flex-1 items-center justify-center border-r border-stone-200 px-2 sm:px-4 md:flex dark:border-stone-800">
                    <Show when={sectionLinks().length > 0}>
                        <nav class="flex items-center gap-4">
                            <For each={sectionLinks()}>
                                {(section) => (
                                    <a
                                        href={section.href}
                                        class={cx("hit-area-x-1 hit-area-y-3", anchor({ variant: "nav" }))}
                                    >
                                        {section.label}
                                    </a>
                                )}
                            </For>
                        </nav>
                    </Show>
                </div>
                <div class="relative flex shrink-0 items-center gap-2 px-2 sm:gap-3 sm:px-4">
                    <DecorMark position="bottom-left" arm="short" />
                    <CommandPalette />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
