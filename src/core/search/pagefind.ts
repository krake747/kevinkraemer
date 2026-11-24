import { isNonEmpty, type NonEmpty } from "@core/non-empty"
import * as v from "valibot"

export type SearchHit = {
    title: string
    excerpt: string
    href: string
}

export type SearchFailure = "unavailable"

export type SearchOutcome =
    | { kind: "idle" }
    | { kind: "hits"; hits: NonEmpty<SearchHit>; total: number }
    | { kind: "empty" }
    | { kind: "failure"; failure: SearchFailure }

export const PAGEFIND_DEBOUNCE_MS = 120
export const MIN_QUERY_LENGTH = 2
export const SEARCH_PLACEHOLDER = "grep kevinkraemer.com"

const pagefindResultDataSchema = v.object({
    url: v.string(),
    excerpt: v.string(),
    meta: v.optional(v.object({ title: v.optional(v.string()) })),
})

export type PagefindResultData = v.InferOutput<typeof pagefindResultDataSchema>

export function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "")
}

function toPageHref(href: string): string {
    if (!href.startsWith("/") || href === "/") {
        return href
    }
    const trimmed = href.replace(/\/+$/, "").replace(/\.html$/, "")
    if (trimmed === "" || trimmed === "/index") {
        return "/"
    }
    return trimmed
}

export function toSearchHit(data: PagefindResultData): SearchHit {
    return {
        title: data.meta?.title ?? data.url,
        excerpt: stripHtml(data.excerpt),
        href: toPageHref(data.url),
    }
}

function searchHits(hits: NonEmpty<SearchHit>, total: number): SearchOutcome {
    return { kind: "hits", hits, total }
}

export function toSearchOutcome(raw: unknown, total: number): SearchOutcome {
    const entries = v.safeParse(v.array(pagefindResultDataSchema), raw)
    if (!entries.success) {
        return { kind: "failure", failure: "unavailable" }
    }
    const hits = entries.output.map(toSearchHit)
    if (!isNonEmpty(hits)) {
        return { kind: "empty" }
    }
    return searchHits(hits, total)
}
