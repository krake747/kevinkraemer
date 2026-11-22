import type { ComponentProps } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { omit } from "solid-js"

const decorMark = cva({
    base: "pointer-events-none absolute z-1 size-5 shrink-0 stroke-stone-400 stroke-1 dark:stroke-stone-600",
    variants: {
        position: {
            "top-left": "top-0 left-0 -translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)]",
            "top-right": "top-0 right-0 translate-x-[calc(50%+0.5px)] -translate-y-[calc(50%+0.5px)]",
            "bottom-right": "right-0 bottom-0 translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]",
            "bottom-left": "bottom-0 left-0 -translate-x-[calc(50%+0.5px)] translate-y-[calc(50%+0.5px)]",
        },
    },
    defaultVariants: {
        position: "top-left",
    },
})

const ARM_PATHS = {
    full: "M12 5v14",
    short: "M12 5v7",
} as const

type DecorArm = keyof typeof ARM_PATHS

export function DecorMark(props: ComponentProps<"svg"> & VariantProps<typeof decorMark> & { arm?: DecorArm }) {
    const rest = omit(props, "position", "arm", "class")
    const verticalPath = () => ARM_PATHS[props.arm ?? "full"]

    return (
        <svg
            {...rest}
            aria-hidden="true"
            class={cx(decorMark({ position: props.position, class: props.class }))}
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M5 12h14" />
            <path d={verticalPath()} />
        </svg>
    )
}
