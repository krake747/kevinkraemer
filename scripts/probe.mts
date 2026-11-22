import { chromium } from "playwright"
import type { Page } from "playwright"

type Viewport = { width: number; height: number }

type Clip = { x: number; y: number; width: number; height: number }

type Probe = {
    url: string
    viewport: Viewport
    selectors: string[]
    scroll?: number
    hover?: string
    focus?: string
    click?: string
    shot?: string
    clip?: Clip
    wait: number
}

type Measurement = {
    top: number
    height: number
    bottom: number
    position: string
    display: string
    transform: string
    fontSize: string
}

function fail(message: string): never {
    console.error(message)
    process.exit(1)
}

function flag(args: readonly string[], name: string): string | undefined {
    const prefix = `--${name}=`
    for (const arg of args) {
        if (arg.startsWith(prefix)) {
            return arg.slice(prefix.length)
        }
    }
    return undefined
}

function numberFlag(args: readonly string[], name: string): number | undefined {
    const value = flag(args, name)
    if (value === undefined) {
        return undefined
    }
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) {
        return fail(`--${name} expects a number, got "${value}"`)
    }
    return parsed
}

function viewportFlag(args: readonly string[]): Viewport {
    const value = flag(args, "viewport")
    if (value === undefined) {
        return fail("--viewport=<width>x<height> is required")
    }
    const [width, height] = value.split("x").map(Number)
    if (width === undefined || height === undefined || !Number.isFinite(width) || !Number.isFinite(height)) {
        return fail(`--viewport expects <width>x<height>, got "${value}"`)
    }
    return { width, height }
}

function clipFlag(args: readonly string[]): Clip | undefined {
    const value = flag(args, "clip")
    if (value === undefined) {
        return undefined
    }
    const parts = value.split(",").map(Number)
    const [x, y, width, height] = parts
    if (
        parts.length !== 4 ||
        x === undefined ||
        y === undefined ||
        width === undefined ||
        height === undefined ||
        parts.some((part) => !Number.isFinite(part))
    ) {
        return fail(`--clip expects <x>,<y>,<width>,<height>, got "${value}"`)
    }
    return { x, y, width, height }
}

function parse(args: readonly string[]): Probe {
    const positionals = args.filter((arg) => !arg.startsWith("--"))
    const [url, ...selectors] = positionals
    if (url === undefined) {
        return fail("usage: node scripts/probe.mts <url> --viewport=<width>x<height> [flags] <selector>...")
    }
    if (selectors.length === 0) {
        return fail("probe needs at least one selector")
    }
    const shot = flag(args, "shot")
    const clip = clipFlag(args)
    if (clip !== undefined && shot === undefined) {
        return fail("--clip needs --shot")
    }
    return {
        url,
        viewport: viewportFlag(args),
        selectors,
        scroll: numberFlag(args, "scroll"),
        hover: flag(args, "hover"),
        focus: flag(args, "focus"),
        click: flag(args, "click"),
        shot,
        clip,
        wait: numberFlag(args, "wait") ?? 0,
    }
}

async function waitForHydration(page: Page): Promise<void> {
    try {
        await page.locator("html[data-hydrated]").waitFor({ state: "attached", timeout: 10_000 })
    } catch {
        throw new Error("page did not hydrate: html[data-hydrated] never appeared")
    }
}

function format(selector: string, index: number, row: Measurement): string {
    const { top, height, bottom, position, display, transform, fontSize } = row
    return `${selector}[${index}] top=${top} height=${height} bottom=${bottom} position=${position} display=${display} transform=${transform} font-size=${fontSize}`
}

const options = parse(process.argv.slice(2))
const { url, viewport, selectors, scroll, hover, focus, click, shot, clip, wait } = options
const browser = await chromium.launch()
let failed = false

try {
    const page = await browser.newPage({ viewport })
    await page.goto(url, { waitUntil: "load" })
    await waitForHydration(page)

    if (scroll !== undefined) {
        await page.evaluate((y) => window.scrollTo(0, y), scroll)
    }
    if (hover !== undefined) {
        await page.locator(hover).first().hover()
    }
    if (focus !== undefined) {
        await page.locator(focus).first().focus()
    }
    if (click !== undefined) {
        await page.locator(click).first().click()
        await page.waitForLoadState("load")
        await waitForHydration(page)
    }
    if (wait > 0) {
        await page.waitForTimeout(wait)
    }
    if (shot !== undefined) {
        await page.screenshot(clip === undefined ? { path: shot } : { path: shot, clip })
        console.log(`shot ${shot}`)
    }

    console.log(`probe ${url} viewport ${viewport.width}x${viewport.height}`)
    for (const selector of selectors) {
        const rows = await page.locator(selector).evaluateAll((elements) =>
            elements.map((element) => {
                const rect = element.getBoundingClientRect()
                const style = getComputedStyle(element)
                return {
                    top: Math.round(rect.top * 10) / 10,
                    height: Math.round(rect.height * 10) / 10,
                    bottom: Math.round(rect.bottom * 10) / 10,
                    position: style.position,
                    display: style.display,
                    transform: style.transform,
                    fontSize: style.fontSize,
                }
            }),
        )
        if (rows.length === 0) {
            console.error(`${selector}: no match`)
            failed = true
            continue
        }
        for (const [index, row] of rows.entries()) {
            console.log(format(selector, index, row))
        }
    }
} finally {
    await browser.close()
}

process.exit(failed ? 1 : 0)
