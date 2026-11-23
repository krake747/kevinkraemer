import { test, expect, type Page } from "@playwright/test"

import { prerenderedRoutes } from "./prerendered-routes"

const HYDRATED = "html[data-hydrated]"

async function waitForHydration(page: Page) {
    await page.locator(HYDRATED).waitFor({ state: "attached" })
}

test("prerendered routes hydrate without browser errors", async ({ page }) => {
    const failures: string[] = []
    page.on("pageerror", (error) => failures.push(`${error.name}: ${error.message}`))
    page.on("console", (message) => {
        const text = message.text()
        if (message.type() === "error" || /Hydration|unclaimed server-rendered/.test(text)) {
            failures.push(`${message.type()}: ${text}`)
        }
    })

    const routes = [
        ...prerenderedRoutes().filter((route) => route !== "/scalar" && route !== "/404"),
        "/logs?q=zzzz-no-such-post",
        "/search?q=memo",
    ]

    for (const path of routes) {
        await page.goto(path)
        await page.locator(HYDRATED).waitFor({ state: "attached" })
        expect(failures, `${path} logged browser errors`).toEqual([])
    }

    await page.goto("/")
    const firstStoryItem = page.locator("#story .reveal-item").first()
    await firstStoryItem.scrollIntoViewIfNeeded()
    await expect(firstStoryItem).toHaveClass(/is-visible/)
})

test("homepage publishes the entity resolution signals", async ({ page }) => {
    await page.goto("/")
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.kevinkraemer.com/")
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website")
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        "https://www.kevinkraemer.com/social-preview.png",
    )
})

test("homepage loads and navigates to logs", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByText("whoami")).toBeVisible()
    await expect(page.getByText(/Full-stack developer/)).toBeVisible()
    await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute(
        "href",
        "https://www.kevinkraemer.com/rss.xml",
    )
    await page.getByRole("link", { name: "~/logs" }).first().click()
    await expect(page).toHaveURL(/\/logs$/)
    await expect(page.getByLabel("Search logs")).toBeVisible()
})

test("resource links load as documents instead of client routes", async ({ page }) => {
    await page.goto("/logs")
    await waitForHydration(page)
    await page.getByRole("link", { name: "rss" }).first().click()
    await expect(page).toHaveURL(/\/rss\.xml$/)
    await expect(page.locator("rss > channel > title")).toHaveText("Logs · Kevin Kraemer")
})

test("logs filters live in the URL", async ({ page }) => {
    await page.goto("/logs")
    const search = page.getByLabel("Search logs")
    await expect(search).toBeVisible()
    await waitForHydration(page)
    await search.fill("zzzz-no-such-post")
    await expect(page.getByText("No log entries match the selected filters.")).toBeVisible()
    await expect(page).toHaveURL(/\?q=zzzz-no-such-post$/)
    await page.reload()
    await waitForHydration(page)
    await expect(search).toHaveValue("zzzz-no-such-post")
    await expect(page.getByText("No log entries match the selected filters.")).toBeVisible()
    await search.fill("")
    await expect(page.getByText("No log entries match the selected filters.")).not.toBeVisible()
    await page.locator("aside button[aria-pressed]").first().click()
    await expect(page).toHaveURL(/\?tag=/)
    await page.reload()
    await waitForHydration(page)
    await expect(page.locator('aside button[aria-pressed="true"]').first()).toBeVisible()
})

test("command palette opens from the keyboard and searches the site", async ({ page }) => {
    await page.goto("/logs")
    await waitForHydration(page)
    await page.keyboard.press("Control+k")
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText("$ ls pages/")).toBeVisible()
    const input = dialog.getByRole("combobox")
    await input.fill("omarchy")
    await expect(dialog.getByText("$ grep -r")).toBeVisible()
    await expect(dialog.getByRole("option").first()).toContainText("Omarchy")
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
})

test("trust pages are indexable with cross-links", async ({ page }) => {
    for (const path of ["/about", "/contact", "/privacy"]) {
        const response = await page.request.get(path)
        expect(response.status()).toBe(200)
        const html = await response.text()
        expect(html.toLowerCase()).not.toContain("noindex")
        expect(html.length).toBeGreaterThan(500)
    }
    const about = await (await page.request.get("/about")).text()
    expect(about).toContain('href="/contact"')
    expect(about).toContain('href="/cv"')
    const privacy = (await (await page.request.get("/privacy")).text()).toLowerCase()
    expect(privacy).toContain("netlify")
    expect(privacy).toContain("theme")
    expect(privacy).not.toContain("market mode")
    expect(privacy).not.toContain("google analytics")
})

test("api-catalog is valid RFC 9264 linkset", async ({ page }) => {
    const res = await page.request.get("/.well-known/api-catalog")
    expect(res.status()).toBe(200)
    const body = await res.json()
    const links = body.linkset?.[0]?.item ?? []
    expect(links.length).toBeGreaterThan(0)
    const hrefs = links.map((l: { href: string }) => l.href)
    expect(hrefs).toEqual(expect.arrayContaining([expect.stringContaining("/openapi.json")]))
})

test("ARD manifest and MCP server card are served as declared", async ({ page }) => {
    const manifest = await page.request.get("/.well-known/ard.json")
    expect(manifest.status()).toBe(200)
    expect(manifest.headers()["content-type"]).toContain("application/json")
    const body = await manifest.json()
    expect(body.entries?.[0]?.identifier).toContain("urn:air:")

    const home = await (await page.request.get("/")).text()
    expect(home).toMatch(/<link[^>]+rel="ard"[^>]+href="\/\.well-known\/ard\.json"/)

    const card = await page.request.get("/mcp/server-card", {
        headers: { Accept: "application/mcp-server-card+json" },
    })
    expect(card.status()).toBe(200)
    expect(card.headers()["content-type"]).toContain("application/mcp-server-card+json")
    const document = await card.json()
    expect(document.remotes?.[0]?.url).toBe("https://www.kevinkraemer.com/mcp")

    const negotiated = await page.request.get("/mcp/server-card", { headers: { Accept: "text/markdown" } })
    expect(negotiated.headers()["content-type"]).toContain("application/mcp-server-card+json")
})

test("search page initial and empty states", async ({ page }) => {
    await page.goto("/search")
    const input = page.getByLabel("Search site")
    await expect(input).toBeVisible()
    await expect(page.getByText(/Type 2\+ characters/)).toBeVisible()
    await input.fill("hello")
    await expect(input).toHaveValue("hello")
    await input.fill("")
    await expect(input).toBeEmpty()
})

test("openapi and llms discovery files", async ({ page }) => {
    const openapi = await page.request.get("/openapi.json")
    expect(openapi.status()).toBe(200)
    expect(openapi.headers()["content-type"]).toContain("application/json")
    const doc = await openapi.json()
    expect(doc.openapi).toBe("3.2.0")

    const llms = await page.request.get("/llms.txt")
    expect(llms.status()).toBe(200)
    const text = await llms.text()
    expect(text).toContain("# Kevin Kraemer")
    expect(text).toContain("/developers")
})

test("404 page is real 404", async ({ page }) => {
    const res = await page.request.get("/this-page-does-not-exist-xyz")
    expect(res.status()).toBe(404)
    const html = await res.text()
    expect(html).not.toContain("og:url")
    expect(html).not.toContain('rel="canonical"')
    await page.goto("/this-page-does-not-exist-xyz")
    await expect(page.getByRole("heading", { name: /Page Not Found/ })).toBeVisible()
    await expect(page.getByText("404").first()).toBeVisible()
})

test("content negotiation fallback serves html by default", async ({ page }) => {
    const res = await page.request.get("/about", { headers: { Accept: "text/html" } })
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toContain("text/html")
    const html = await res.text()
    expect(html).toContain("<html")
})
