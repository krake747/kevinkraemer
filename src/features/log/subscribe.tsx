import { RSS_PATH, origin } from "@core/site/urls"
import { createCopyFeedback } from "@pattern/create-copy-feedback"
import { Anchor } from "@ui/anchor"
import { Button } from "@ui/button"
import { RssIcon } from "@ui/icon"
import { Show } from "solid-js"

const feedUrl = `${origin}${RSS_PATH}`

export function LogSubscribe() {
    const { copyLabel, copy } = createCopyFeedback()

    const handleCopy = async () => {
        const outcome = await copy(feedUrl)
        if (outcome.kind === "failed") {
            window.prompt("Copy feed URL", feedUrl)
        }
    }

    return (
        <span data-subscribe class="inline-flex items-center gap-1.5 font-mono text-xs">
            <RssIcon class="size-3 text-emerald-600 dark:text-emerald-400" />
            <Anchor href={RSS_PATH} variant="prose" rel="external">
                rss
            </Anchor>{" "}
            <Button
                intent="muted"
                class="ml-1 min-w-16 text-center"
                data-copy-rss={feedUrl}
                aria-label="Copy RSS feed URL"
                onClick={handleCopy}
            >
                <span data-copy-label>
                    <Show when={copyLabel() !== "copy"} fallback={copyLabel()}>
                        <span class="animate-confirm-in">{copyLabel()}</span>
                    </Show>
                </span>
            </Button>
        </span>
    )
}
