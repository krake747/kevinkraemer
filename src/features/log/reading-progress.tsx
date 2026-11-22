import { WindowEventListener } from "@solid-primitives/event-listener"
import { onSettled } from "solid-js"

const hasScrollTimeline = () => typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()")

export function LogReadingProgress() {
    let bar!: HTMLDivElement
    let frame = 0
    const native = hasScrollTimeline()

    const update = () => {
        frame = 0
        if (native) {
            return
        }
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 1
        bar.style.transform = `scaleX(${progress})`
    }

    const schedule = () => {
        if (!native && !frame) {
            frame = requestAnimationFrame(update)
        }
    }

    onSettled(() => {
        update()
        return () => {
            if (frame) {
                cancelAnimationFrame(frame)
            }
        }
    })

    return (
        <div class="pointer-events-none fixed top-10 right-0 left-0 z-50 h-0.5">
            <div ref={bar} class="h-full origin-left bg-emerald-500 read-progress" style={{ transform: "scaleX(0)" }} />
            <WindowEventListener onScroll={schedule} onResize={schedule} />
        </div>
    )
}
