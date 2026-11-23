import { test, expect, type Page } from "@playwright/test"

import { prerenderedRoutes } from "./prerendered-routes"

const OUTSIDE_CONTRACT = new Set(["/scalar", "/404"])

function pageRoutes(): string[] {
    return prerenderedRoutes().filter((route) => !OUTSIDE_CONTRACT.has(route))
}

function logArticleRoutes(): string[] {
    return pageRoutes().filter((route) => /^\/logs\/.+/.test(route))
}

function jsonLdBlocks(html: string): string[] {
    return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(
        (match) => match[1] ?? "",
    )
}

function personBlockCount(html: string): number {
    let count = 0
    for (const block of jsonLdBlocks(html)) {
        const node: unknown = JSON.parse(block)
        if (typeof node === "object" && node !== null && "@type" in node && node["@type"] === "Person") {
            count += 1
        }
    }
    return count
}

function occurrences(html: string, needle: string): number {
    return html.split(needle).length - 1
}

async function servedHtml(page: Page, route: string): Promise<string> {
    const response = await page.request.get(route)
    expect(response.ok(), `${route} serves`).toBe(true)
    return response.text()
}

test("every page emits each json-ld block once", async ({ page }) => {
    for (const route of pageRoutes()) {
        const blocks = jsonLdBlocks(await servedHtml(page, route))
        expect(blocks.length, `${route} has structured data`).toBeGreaterThan(0)
        expect(new Set(blocks).size, `${route} repeats a json-ld block`).toBe(blocks.length)
    }
})

test("pathed pages carry one canonical, og:url, and person", async ({ page }) => {
    for (const route of pageRoutes()) {
        const html = await servedHtml(page, route)
        expect(occurrences(html, 'rel="canonical"'), `${route} canonical`).toBe(1)
        expect(occurrences(html, 'property="og:url"'), `${route} og:url`).toBe(1)
        expect(personBlockCount(html), `${route} person`).toBe(1)
    }
})

test("log articles carry article metadata", async ({ page }) => {
    const articles = logArticleRoutes()
    expect(articles.length).toBeGreaterThan(0)
    for (const route of articles) {
        const html = await servedHtml(page, route)
        expect(occurrences(html, 'property="article:published_time"'), `${route} published_time`).toBe(1)
        expect(occurrences(html, 'type="text/markdown"'), `${route} markdown alternate`).toBe(1)
        expect(occurrences(html, '"@type":"BlogPosting"'), `${route} blog posting`).toBe(1)
        expect(occurrences(html, '"@type":"BreadcrumbList"'), `${route} breadcrumbs`).toBe(1)
    }
})

test("non-article pages carry no article metadata", async ({ page }) => {
    const articles = new Set(logArticleRoutes())
    for (const route of pageRoutes().filter((candidate) => !articles.has(candidate))) {
        const html = await servedHtml(page, route)
        expect(html, `${route} leaks article metadata`).not.toContain('property="article:published_time"')
    }
})

test("only unlisted pages opt out of indexing", async ({ page }) => {
    const unlisted = new Set(["/search"])
    for (const route of pageRoutes()) {
        const html = await servedHtml(page, route)
        if (unlisted.has(route)) {
            expect(html, `${route} opts out`).toContain("noindex")
        } else {
            expect(html, `${route} stays indexable`).not.toContain("noindex")
        }
    }
    const missing = await page.request.get("/this-page-does-not-exist-xyz")
    expect(missing.status()).toBe(404)
    expect(await missing.text()).toContain("noindex")
})

test("every page titles once with the site name", async ({ page }) => {
    for (const route of pageRoutes()) {
        const html = await servedHtml(page, route)
        expect(occurrences(html, "</title>"), `${route} title`).toBe(1)
        const title = html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1]
        expect(title, `${route} title names the site`).toContain("Kevin Kraemer")
    }
})
