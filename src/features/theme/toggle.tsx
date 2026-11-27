import { applyWithoutTransitions, colorScheme } from "@core/theme"
import { usePreference } from "@ui-sdk/solid/preferences"
import { Toggle } from "@ui-sdk/solid/toggle"
import { cx } from "@ui/cva.config"
import { MoonIcon, SunIcon } from "@ui/icon"

export function ThemeToggle() {
    const scheme = usePreference(colorScheme)
    const isDark = () => scheme().resolved === "dark"

    return (
        <Toggle
            aria-label={`Switch to ${isDark() ? "light" : "dark"} theme`}
            pressed={isDark()}
            onPressedChange={(pressed) => applyWithoutTransitions(() => colorScheme.set(pressed ? "dark" : "light"))}
            class={cx(
                "hit-area-x-3 hit-area-y-3 flex size-5 items-center justify-center",
                "text-emerald-800 transition-[color,scale] duration-150 ease-out-quart",
                "hover:text-emerald-600",
                "active:scale-97",
                "dark:text-emerald-300 dark:hover:text-emerald-400",
            )}
        >
            <span class="relative size-4">
                <SunIcon
                    class={cx(
                        "theme-toggle-icon ease-out-quart absolute inset-0 size-4 transition-[opacity,scale,rotate] duration-150",
                        isDark() ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
                    )}
                />
                <MoonIcon
                    class={cx(
                        "theme-toggle-icon ease-out-quart absolute inset-0 size-4 transition-[opacity,scale,rotate] duration-150",
                        isDark() ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0",
                    )}
                />
            </span>
        </Toggle>
    )
}
