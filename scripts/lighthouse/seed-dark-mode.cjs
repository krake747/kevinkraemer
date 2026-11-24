module.exports = async function seedDarkMode(browser, context) {
    const page = await browser.newPage()
    await page.goto(context.url, { waitUntil: "domcontentloaded" })
    await page.evaluate(() => {
        window.localStorage.setItem("kk-color-scheme", "dark")
    })
    await page.close()
}
