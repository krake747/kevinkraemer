import { createColorScheme, createLocalStorage } from "@ui-sdk/core"

const THEME_KEY = "kk-color-scheme"

export function applyWithoutTransitions(apply: () => void) {
    const root = document.documentElement
    root.classList.add("disable-transitions")
    apply()
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            root.classList.remove("disable-transitions")
        })
    })
}

export const colorScheme = createColorScheme({
    storage: createLocalStorage(THEME_KEY),
    global: true,
})
