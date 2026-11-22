import { test, expect } from "@playwright/test"

test("the page registers its read and navigation tools where WebMCP exists", async ({ page }) => {
    await page.addInitScript(() => {
        const names: string[] = []
        Object.defineProperty(document, "modelContext", {
            value: {
                registerTool(tool: { name: string }) {
                    names.push(tool.name)
                    document.documentElement.dataset.webmcp = names.join(",")
                },
            },
        })
    })

    await page.goto("/logs?q=agents")
    await expect(page.locator("html")).toHaveAttribute("data-webmcp", "search_logs,read_log,open_page")
})

test("pages still hydrate when the browser has no WebMCP", async ({ page }) => {
    await page.goto("/logs")
    await expect(page.locator("html")).toHaveAttribute("data-hydrated", "")
    await expect(page.locator("html")).not.toHaveAttribute("data-webmcp", /.+/)
})
