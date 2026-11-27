import { siteContent } from "@core/content/site-content"
import { isLogsPath } from "@core/site/navigation"
import { FooterPixelAvatar, type PixelMood } from "@features/footer/pixel-avatar"
import { useLocation } from "@solidjs/router"
import { Anchor } from "@ui/anchor"
import { DecorMark } from "@ui/decor-mark"
import { ZapIcon } from "@ui/icon"
import { createSignal, onSettled } from "solid-js"

const MOOD_BY_PATHNAME: Record<string, PixelMood> = {
    "/about": "wink",
    "/contact": "talk",
    "/": "scan",
}

function moodForPathname(pathname: string, night: boolean): PixelMood {
    if (night || isLogsPath(pathname)) {
        return "sleepy"
    }
    return MOOD_BY_PATHNAME[pathname] ?? "idle"
}

export function Footer() {
    const location = useLocation()
    const [night, setNight] = createSignal(false)
    onSettled(() => {
        setNight(new Date().getHours() < 6)
    })
    return (
        <footer
            data-pagefind-ignore
            class="fixed right-0 bottom-0 left-0 z-40 border-t border-stone-200 bg-stone-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm dark:border-stone-800 dark:bg-stone-950/95 print:hidden"
        >
            <div class="flex h-10 max-w-full items-stretch text-xs">
                <div class="relative flex shrink-0 items-center gap-2 border-r border-stone-200 px-3 sm:px-4 dark:border-stone-800">
                    <FooterPixelAvatar mood={moodForPathname(location.pathname, night())} />
                    <DecorMark position="top-right" arm="short" class="rotate-180" />
                </div>
                <div class="relative hidden flex-1 items-center justify-center gap-4 border-r border-stone-200 px-4 font-mono text-stone-600 sm:flex dark:border-stone-800 dark:text-stone-300">
                    <span class="flex items-center gap-1.5">
                        Built with intent <ZapIcon class="inline size-4" />
                    </span>
                    <DecorMark position="top-right" arm="short" class="rotate-180" />
                </div>
                <div class="flex items-center gap-2 px-2 sm:gap-3 sm:px-4">
                    <span class="hidden font-mono text-stone-600 dark:text-stone-300">Solid</span>
                    <span class="hidden text-stone-300 dark:text-stone-700">|</span>
                    <Anchor href="/developers" variant="subtle" class="hit-area-x-2 hit-area-y-3">
                        ~/developers
                    </Anchor>
                    <span class="text-stone-300 dark:text-stone-700">|</span>
                    <span class="font-mono text-xs text-stone-600 tabular-nums dark:text-stone-300">
                        (c) {siteContent.meta.buildYear}
                    </span>
                </div>
            </div>
        </footer>
    )
}
