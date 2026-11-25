import { type ComponentProps, type JSX } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { Show, merge, omit } from "solid-js"

const badge = cva({
    base: "inline-flex items-center border font-mono transition-colors",
    variants: {
        tone: {
            neutral: "border-stone-300/60 bg-transparent text-stone-700 dark:border-stone-700/60 dark:text-stone-300",
            emerald:
                "border-stone-300/60 bg-transparent text-emerald-800 dark:border-stone-700/60 dark:text-emerald-400",
        },
        size: {
            sm: "px-2 py-0.5 text-xs",
            xs: "px-1.5 py-0.5 text-[11px]/none",
        },
        interactive: {
            true: "hit-area-x-1 hit-area-y-3",
            false: "",
        },
    },
    defaultVariants: {
        tone: "neutral",
        size: "sm",
        interactive: false,
    },
    compoundVariants: [
        {
            interactive: true,
            tone: "neutral",
            class: "hover:border-emerald-500/30 hover:text-emerald-800 dark:text-stone-400 dark:hover:text-emerald-400",
        },
        {
            interactive: true,
            tone: "emerald",
            class: "hover:border-emerald-500/30 hover:bg-emerald-500/5 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10",
        },
    ],
})

type BadgeTarget = { kind: "internal" } | { kind: "external" }

function badgeTargetAttrs(target: BadgeTarget): { target?: "_blank"; rel?: string } {
    switch (target.kind) {
        case "internal": {
            return {}
        }
        case "external": {
            return { target: "_blank", rel: "noopener noreferrer" }
        }
        default: {
            const exhaustive: never = target
            return exhaustive
        }
    }
}

type BadgeVariants = VariantProps<typeof badge>

type BadgeProps = BadgeVariants &
    ComponentProps<"span"> & {
        target?: BadgeTarget
        render?: (props: Record<string, any>) => JSX.Element
    }

export function Badge(props: BadgeProps): JSX.Element {
    const rest = omit(props, "tone", "size", "interactive", "class", "children", "render", "target")
    const target = (): BadgeTarget => props.target ?? { kind: "internal" }
    const isExternal = (): boolean => target().kind === "external"
    const merged = merge(rest, {
        get target() {
            return badgeTargetAttrs(target()).target
        },
        get rel() {
            return badgeTargetAttrs(target()).rel
        },
        get class() {
            return cx(badge({ tone: props.tone, size: props.size, interactive: props.interactive, class: props.class }))
        },
        get children() {
            return (
                <>
                    {props.children}
                    <Show when={isExternal()}>
                        <span class="sr-only"> (opens in a new tab)</span>
                    </Show>
                </>
            )
        },
    })
    return <>{props.render?.(merged) ?? <span {...merged} />}</>
}
