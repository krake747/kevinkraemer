import { createMediaQuery } from "@solid-primitives/media"
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { For, Show, createEffect, createSignal, merge, omit, type Accessor, type VoidProps } from "solid-js"

export type PixelMood = "idle" | "wink" | "sleepy" | "talk" | "scan"
type Tone = "dark" | "mid" | "lid" | "open" | "off"
type Face = readonly (readonly Tone[])[]

const BLINK_MS = 150
const BLINK_MIN_DELAY = 2000
const BLINK_JITTER = 4000
const GLANCE_MIN_DELAY = 2400
const GLANCE_JITTER = 2600

const TONE_CLASS: Record<Tone, string> = {
    dark: "bg-stone-600 dark:bg-stone-500",
    mid: "bg-stone-500 dark:bg-stone-400",
    lid: "bg-transparent",
    open: "bg-transparent",
    off: "bg-transparent",
}

function pixelClass(closed: boolean, tone: Tone): string {
    if (closed && tone === "lid") {
        return "bg-stone-500 dark:bg-stone-400"
    }
    return TONE_CLASS[tone]
}

const TOP: readonly Tone[] = ["off", "dark", "dark", "dark", "dark", "off"]
const SECOND: readonly Tone[] = ["dark", "mid", "mid", "mid", "mid", "dark"]
const BOTTOM: readonly Tone[] = ["off", "dark", "dark", "dark", "dark", "off"]
const EYES_OPEN: readonly Tone[] = ["dark", "mid", "lid", "mid", "lid", "dark"]
const EYES_WINK: readonly Tone[] = ["dark", "mid", "lid", "mid", "open", "dark"]
const EYES_SHUT: readonly Tone[] = ["dark", "mid", "mid", "mid", "mid", "dark"]
const MOUTH_FLAT: readonly Tone[] = ["dark", "mid", "mid", "dark", "mid", "dark"]
const MOUTH_SHUT: readonly Tone[] = ["dark", "mid", "dark", "dark", "mid", "dark"]

const FACES = {
    idle: [TOP, SECOND, EYES_OPEN, MOUTH_FLAT, BOTTOM],
    wink: [TOP, SECOND, EYES_WINK, MOUTH_FLAT, BOTTOM],
    sleepy: [TOP, SECOND, EYES_SHUT, MOUTH_SHUT, BOTTOM],
    talk: [TOP, SECOND, EYES_OPEN, MOUTH_FLAT, BOTTOM],
    scan: [TOP, SECOND, EYES_OPEN, MOUTH_FLAT, BOTTOM],
} as const satisfies Record<PixelMood, Face>

const SCAN_LEFT_ROWS: readonly [readonly Tone[], readonly Tone[]] = [
    ["dark", "lid", "mid", "lid", "mid", "dark"],
    ["dark", "mid", "dark", "mid", "mid", "dark"],
]
const SCAN_RIGHT_ROWS: readonly [readonly Tone[], readonly Tone[]] = [EYES_OPEN, MOUTH_FLAT]

function scanRows(left: boolean): readonly [readonly Tone[], readonly Tone[]] {
    return left ? SCAN_LEFT_ROWS : SCAN_RIGHT_ROWS
}

function createBlink(active: () => boolean): Accessor<boolean> {
    const [blinking, setBlinking] = createSignal(false)
    createEffect(
        () => active(),
        (on) => {
            if (!on) {
                setBlinking(false)
                return () => {}
            }
            let open: ReturnType<typeof setTimeout> | undefined
            let close: ReturnType<typeof setTimeout> | undefined
            const blink = () => {
                setBlinking(true)
                close = setTimeout(() => {
                    setBlinking(false)
                }, BLINK_MS)
            }
            const schedule = () => {
                open = setTimeout(
                    () => {
                        blink()
                        schedule()
                    },
                    BLINK_MIN_DELAY + Math.random() * BLINK_JITTER,
                )
            }
            schedule()
            return () => {
                clearTimeout(open)
                clearTimeout(close)
            }
        },
    )
    return blinking
}

function createGlance(active: () => boolean): Accessor<boolean> {
    const [left, setLeft] = createSignal(false)
    createEffect(
        () => active(),
        (on) => {
            if (!on) {
                setLeft(false)
                return () => {}
            }
            let timer: ReturnType<typeof setTimeout> | undefined
            const step = () => {
                timer = setTimeout(
                    () => {
                        setLeft((v) => !v)
                        step()
                    },
                    GLANCE_MIN_DELAY + Math.random() * GLANCE_JITTER,
                )
            }
            step()
            return () => {
                clearTimeout(timer)
            }
        },
    )
    return left
}

function PixelRow(props: VoidProps<{ cells: readonly Tone[]; closed: boolean }>) {
    return (
        <div class="flex">
            <For each={props.cells}>
                {(cell) => (
                    <span
                        class={cx(
                            "size-1 transition-colors duration-150 ease-out-quart",
                            pixelClass(props.closed, cell),
                        )}
                    />
                )}
            </For>
        </div>
    )
}

function SleepyZzz() {
    return (
        <div class="pointer-events-none absolute bottom-full left-1/2 mb-0.5 hidden -translate-x-1/2 items-end gap-0.5 font-mono text-stone-400 motion-safe:flex dark:text-stone-500">
            <span class="text-[8px]/none motion-safe:animate-zzz motion-safe:[animation-delay:-1.6s]">z</span>
            <span class="text-[10px]/none motion-safe:animate-zzz motion-safe:[animation-delay:-0.8s]">z</span>
            <span class="text-[12px]/none motion-safe:animate-zzz">z</span>
        </div>
    )
}

const BUB_TOP: readonly Tone[] = ["dark", "dark", "dark", "dark", "dark", "dark"]
const BUB_MID: readonly Tone[] = ["dark", "off", "off", "off", "off", "dark"]
const BUB_TAIL: readonly Tone[] = ["dark", "dark", "off", "off", "off", "off"]

function TalkBubble() {
    return (
        <div class="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 motion-safe:flex">
            <span class="flex flex-col motion-safe:animate-send">
                <PixelRow cells={BUB_TOP} closed={false} />
                <PixelRow cells={BUB_MID} closed={false} />
                <PixelRow cells={BUB_MID} closed={false} />
                <PixelRow cells={BUB_TAIL} closed={false} />
            </span>
        </div>
    )
}

export function FooterPixelAvatar(_props: VoidProps<ComponentProps<"div"> & { mood?: PixelMood }>) {
    const props = merge({ mood: "idle" } as const, _props)
    const mood = () => props.mood
    const prefersReducedMotion = createMediaQuery("(prefers-reduced-motion: reduce)")
    const blinking = createBlink(() => {
        if (prefersReducedMotion()) {
            return false
        }
        return FACES[mood()].some((row) => row.includes("lid"))
    })
    const glanceLeft = createGlance(() => {
        if (prefersReducedMotion()) {
            return false
        }
        return mood() === "scan"
    })
    const rows = (): Face => {
        if (mood() !== "scan") {
            return FACES[mood()]
        }
        const [eyes, mouth] = scanRows(glanceLeft())
        return [TOP, SECOND, eyes, mouth, BOTTOM]
    }
    const forwarded = omit(props, "class", "mood", "children")

    return (
        <div
            {...forwarded}
            class={cx("relative flex h-5 w-6 items-center justify-center", props.class)}
            aria-hidden="true"
        >
            <Show keyed when={mood()}>
                {(current) => (
                    <div class="flex animate-confirm-in flex-col items-center">
                        <Show when={current === "sleepy"}>
                            <SleepyZzz />
                        </Show>
                        <Show when={current === "talk"}>
                            <TalkBubble />
                        </Show>
                        <For each={rows()}>{(row) => <PixelRow cells={row} closed={blinking()} />}</For>
                    </div>
                )}
            </Show>
        </div>
    )
}
