import type { ComponentProps } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { omit } from "solid-js"

export const anchor = cva({
    base: "transition-colors duration-150 ease-out-quart",
    variants: {
        variant: {
            nav: "font-mono text-xs text-stone-600 hover:text-emerald-800 dark:text-stone-300 dark:hover:text-emerald-400",
            prose: "text-emerald-800 underline decoration-emerald-500/30 underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
            channel:
                "font-mono text-sm wrap-break-word text-emerald-800 underline decoration-emerald-500/30 underline-offset-2 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
            mono: "font-mono text-sm text-emerald-800 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300",
            subtle: "font-mono text-xs text-stone-600 hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-400",
            title: "font-mono text-2xl wrap-break-word text-stone-900 underline decoration-stone-400 underline-offset-4 hover:text-emerald-800 dark:text-stone-100 dark:decoration-stone-600 dark:hover:text-emerald-400",
            muted: "font-mono text-sm wrap-break-word text-stone-800 underline decoration-stone-400 underline-offset-2 hover:text-emerald-800 dark:text-stone-200 dark:decoration-stone-600 dark:hover:text-emerald-400",
        },
    },
    defaultVariants: {
        variant: "prose",
    },
})

export function Anchor(
    props: Omit<ComponentProps<"a">, "target"> & VariantProps<typeof anchor> & { external?: boolean },
) {
    const rest = omit(props, "variant", "class", "children", "external")
    const external = () => props.external === true
    const securityRel = () => (external() ? `noopener noreferrer ${rest.rel ?? ""}`.trim() : rest.rel)

    return (
        <a
            {...rest}
            target={external() ? "_blank" : undefined}
            rel={securityRel()}
            class={cx(anchor({ variant: props.variant, class: props.class }))}
        >
            {props.children}
            {props.external === true ? <span class="sr-only"> (opens in a new tab)</span> : null}
        </a>
    )
}
