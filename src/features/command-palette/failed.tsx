export function CommandPaletteFailed(props: { message: string; onRetry: () => void }) {
    return (
        <div class="px-4 py-6 text-center font-mono text-xs">
            <p class="text-stone-600 dark:text-stone-300">$ grep: search failed</p>
            <p class="mt-2 text-stone-500 dark:text-stone-500">{props.message}</p>
            <button
                type="button"
                class="hit-area-y-2.5 mt-4 border border-stone-300 px-2.5 py-1 text-stone-700 transition-[color,border-color,scale] duration-150 ease-out-quart hover:border-emerald-500/30 hover:text-emerald-800 active:scale-97 dark:border-stone-700 dark:text-stone-300 dark:hover:text-emerald-400"
                onClick={() => props.onRetry()}
            >
                retry
            </button>
        </div>
    )
}
