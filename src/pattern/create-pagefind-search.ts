import {
    MIN_QUERY_LENGTH,
    toSearchOutcome,
    type PagefindResultData,
    type SearchHit,
    type SearchOutcome,
} from "@core/search/pagefind"
import { createMemo, isPending, type Accessor } from "solid-js"
import * as v from "valibot"

type PagefindResult = {
    data: () => Promise<PagefindResultData>
}

type PagefindModule = {
    search: (query: string) => Promise<{ results: PagefindResult[] }>
}

const PagefindModuleSchema = v.object({
    search: v.custom<PagefindModule["search"]>((value) => typeof value === "function"),
})

type PagefindCache = { status: "cold" } | { status: "ready"; module: PagefindModule }

const pagefindCache: { current: PagefindCache } = { current: { status: "cold" } }

async function loadPagefind(): Promise<PagefindModule | null> {
    if (pagefindCache.current.status === "ready") {
        return pagefindCache.current.module
    }
    const moduleUrl = "/pagefind/pagefind.js"
    try {
        const loaded: unknown = await import(/* @vite-ignore */ moduleUrl)
        const parsed = v.safeParse(PagefindModuleSchema, loaded)
        if (!parsed.success) {
            return null
        }
        pagefindCache.current = { status: "ready", module: parsed.output }
        return parsed.output
    } catch {
        return null
    }
}

async function searchPagefind(query: string, limit = 5): Promise<SearchOutcome> {
    const pagefind = await loadPagefind()
    if (pagefind === null) {
        return { kind: "failure", failure: "unavailable" }
    }

    const response = await pagefind.search(query)
    const raw = await Promise.all(response.results.slice(0, limit).map((result) => result.data()))
    return toSearchOutcome(raw, response.results.length)
}

export function createPagefindSearch(query: Accessor<string>, limit?: number) {
    const outcome = createMemo<SearchOutcome>(() =>
        query().length < MIN_QUERY_LENGTH ? { kind: "idle" } : searchPagefind(query(), limit),
    )

    const hits = createMemo<SearchHit[]>(() => {
        const result = outcome()
        return result.kind === "hits" ? result.hits : []
    })

    const total = createMemo<number | null>(() => {
        const result = outcome()
        return result.kind === "hits" ? result.total : null
    })

    return { outcome, hits, total, isLoading: () => isPending(() => outcome()) }
}
