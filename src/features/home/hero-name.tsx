import { For } from "solid-js"

const FIRST_NAME_CHARS = ["K", "e", "v", "i", "n"]
const LAST_NAME_CHARS = ["K", "r", "a", "e", "m", "e", "r"]

const TYPE_CADENCE_MS = [26, 18, 44, 22, 96, 30, 20, 52, 24, 18, 34, 110]

function charDelayStyle(index: number): string {
    let at = 0
    for (let i = 0; i < index; i++) {
        at += TYPE_CADENCE_MS[i % TYPE_CADENCE_MS.length] ?? 28
    }
    return `animation-delay: ${at}ms`
}

export function HomeHeroName() {
    return (
        <h1
            aria-label="Kevin Kraemer"
            class="text-[clamp(2.5rem,8vw,6rem)]/[0.9] font-semibold tracking-tight text-stone-900 sm:text-[clamp(3rem,10vw,6rem)] dark:text-stone-100"
            id="hero-name"
        >
            <span class="inline-block overflow-hidden" aria-hidden="true">
                <For keyed={false} each={FIRST_NAME_CHARS}>
                    {(char, index) => (
                        <span class="hero-char inline-block" style={charDelayStyle(index)}>
                            {char()}
                        </span>
                    )}
                </For>
            </span>
            <br />
            <span class="inline-block overflow-hidden" aria-hidden="true">
                <For keyed={false} each={LAST_NAME_CHARS}>
                    {(char, index) => (
                        <span class="hero-char inline-block" style={charDelayStyle(FIRST_NAME_CHARS.length + index)}>
                            {char()}
                        </span>
                    )}
                </For>
            </span>
        </h1>
    )
}
