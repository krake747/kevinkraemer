import { siteContent } from "@core/content/site-content"

export function CvLastUpdated() {
    return (
        <div class="animate-fade-up pt-2 text-center">
            <p class="font-mono text-xs text-stone-600 dark:text-stone-300">
                <span class="text-emerald-600 dark:text-emerald-400">~</span> <span class="mx-1">$</span>{" "}
                <span>git log -1 --format="%cd" -- src/features/cv/</span>{" "}
                <span class="mx-2 text-stone-300 dark:text-stone-600">|</span>{" "}
                <span class="text-stone-600 dark:text-stone-400">{siteContent.meta.cvUpdated}</span>
            </p>
            <p class="mt-1 font-mono text-[11px] text-stone-600 dark:text-stone-300">
                This CV is a living document. Last updated on build
            </p>
        </div>
    )
}
