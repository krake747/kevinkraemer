import { makeIntersectionObserver } from "@solid-primitives/intersection-observer"
import { createMediaQuery } from "@solid-primitives/media"

export function createScrollReveal() {
    const prefersReducedMotion = createMediaQuery("(prefers-reduced-motion: reduce)")
    const revealItems = (section: Element, stagger: boolean) => {
        section.querySelectorAll(".reveal-item").forEach((item, index) => {
            if (stagger && !prefersReducedMotion() && item instanceof HTMLElement) {
                item.style.animationDelay = `${Math.min(index, 3) * 40}ms`
            }
            item.classList.add("is-visible")
        })
    }
    const { add, remove } = makeIntersectionObserver(
        [],
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    revealItems(entry.target, true)
                    remove(entry.target)
                }
            })
        },
        { threshold: 0.1 },
    )
    return (el: Element) => {
        if (el.getBoundingClientRect().bottom < 0) {
            revealItems(el, false)
            return
        }
        add(el)
    }
}
