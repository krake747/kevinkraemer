import { test, expect, type Page } from "@playwright/test"

const FAKE_PAGEFIND = `
const delays = { so: 1200 }
export async function search(query) {
    await new Promise((resolve) => setTimeout(resolve, delays[query] ?? 50))
    return {
        results: [
            { data: async () => ({ url: "/logs/" + query, excerpt: "excerpt " + query, meta: { title: "Result for " + query } }) },
        ],
    }
}
`

async function openSearch(page: Page, path: string) {
    await page.route(/\/pagefind\/pagefind\.js(\?.*)?$/, (route) =>
        route.fulfill({ contentType: "text/javascript", body: FAKE_PAGEFIND }),
    )
    await page.goto(path)
    await page.waitForLoadState("networkidle")
    return page.getByLabel("Search site")
}

test("search shows hits for the latest term and drops a slower stale response", async ({ page }) => {
    const input = await openSearch(page, "/search")
    await input.pressSequentially("so")
    await page.waitForTimeout(300)
    await input.pressSequentially("lid")
    await expect(page.getByText("Result for solid")).toBeVisible()
    await expect(page).toHaveURL(/\?q=solid$/)
    await page.waitForTimeout(1500)
    await expect(page.getByText("Result for so", { exact: true })).toHaveCount(0)
    await expect(page.getByText("Result for solid")).toBeVisible()
    await expect(input).toHaveValue("solid")
})

test("search query lives in the URL and survives back and forward", async ({ page }) => {
    const input = await openSearch(page, "/search?q=solid")
    await expect(input).toHaveValue("solid")
    await page.getByText("Result for solid").click()
    await expect(page).toHaveURL(/\/logs\/solid$/)
    await page.goBack()
    await expect(page).toHaveURL(/\?q=solid$/)
    await expect(page.getByLabel("Search site")).toHaveValue("solid")
    await expect(page.getByText("Result for solid")).toBeVisible()
    await page.goForward()
    await expect(page).toHaveURL(/\/logs\/solid$/)
})

test("clearing the query empties the URL and shows the intro", async ({ page }) => {
    const input = await openSearch(page, "/search?q=solid")
    await expect(page.getByText("Result for solid")).toBeVisible()
    await page.getByRole("button", { name: "clear", exact: true }).click()
    await expect(input).toHaveValue("")
    await expect(page).not.toHaveURL(/q=/)
    await expect(page.getByText("Type 2+ characters to grep the site.")).toBeVisible()
})
