import { MIN_QUERY_LENGTH, PAGEFIND_DEBOUNCE_MS, SEARCH_PLACEHOLDER } from "@core/search/pagefind"
import { SearchFailed } from "@features/search/failed"
import { SearchIntro } from "@features/search/intro"
import { SearchOutcomeView } from "@features/search/outcome-view"
import { SearchSkeleton } from "@features/search/skeleton"
import { createPagefindSearch } from "@pattern/create-pagefind-search"
import { createUrlQuery } from "@pattern/create-url-query"
import { Button } from "@ui/button"
import { cx } from "@ui/cva.config"
import { Input, InputPrompt } from "@ui/input"
import { Errored, Loading, Show, latest } from "solid-js"

export function SearchInterface() {
    const query = createUrlQuery({ param: "q", wait: PAGEFIND_DEBOUNCE_MS })
    const committedQuery = () => query.query()?.trim() ?? ""
    const { outcome, total, isLoading: isStale } = createPagefindSearch(committedQuery, 10)
    let input!: HTMLInputElement

    const resetQuery = () => {
        query.clear()
        input.focus()
    }

    return (
        <div class="flex flex-col gap-6">
            <search aria-label="Site search" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <Input
                    ref={input}
                    value={latest(query.input)}
                    onInput={(event) => {
                        query.update(event.currentTarget.value)
                    }}
                    placeholder={SEARCH_PLACEHOLDER}
                    aria-label="Search site"
                    autocomplete="off"
                    spellcheck={false}
                    autofocus
                >
                    <InputPrompt />
                </Input>
                <div class="flex items-center justify-end gap-3 sm:contents">
                    <Loading fallback={null}>
                        <Show when={total() !== null}>
                            <span class="min-w-14 shrink-0 text-right font-mono text-xs whitespace-nowrap text-stone-600 tabular-nums dark:text-stone-400">
                                {total()} {total() === 1 ? "hit" : "hits"}
                            </span>
                        </Show>
                    </Loading>
                    <Show when={latest(query.input).length > 0}>
                        <Button class="shrink-0" onClick={resetQuery}>
                            clear
                        </Button>
                    </Show>
                </div>
            </search>
            <Show when={committedQuery().length >= MIN_QUERY_LENGTH} fallback={<SearchIntro />}>
                <Errored fallback={(error, retry) => <SearchFailed message={String(error())} onRetry={retry} />}>
                    <Loading fallback={<SearchSkeleton />}>
                        <div
                            aria-busy={isStale() ? "true" : "false"}
                            class={cx("transition-opacity duration-150", isStale() && "opacity-60")}
                        >
                            <SearchOutcomeView outcome={outcome()} query={committedQuery()} onClear={resetQuery} />
                        </div>
                    </Loading>
                </Errored>
            </Show>
        </div>
    )
}
