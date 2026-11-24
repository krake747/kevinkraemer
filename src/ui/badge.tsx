import { dynamic, type ComponentProps, type JSX } from "@solidjs/web"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { createMemo, isStatic, merge, omit } from "solid-js"

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
type BadgeSpanProps = BadgeVariants & ComponentProps<"span"> & { as?: "span" }
type BadgeAnchorProps = BadgeVariants & Omit<ComponentProps<"a">, "target"> & { as: "a"; target?: BadgeTarget }

export function Badge(_props: BadgeSpanProps | BadgeAnchorProps): JSX.Element {
    const props = merge({ as: "span", tone: "neutral" } as const, _props)
    const Tag = dynamic(() => props.as, { static: isStatic(_props, "as") })
    const rest = createMemo(() => {
        if (props.as === "a") {
            return omit(props, "as", "tone", "size", "interactive", "class", "children", "target")
        }
        return omit(props, "as", "tone", "size", "interactive", "class", "children")
    })
    const target = (): BadgeTarget => (props.as === "a" ? (props.target ?? { kind: "internal" }) : { kind: "internal" })
    const isExternal = () => props.as === "a" && target().kind === "external"

    return (
        <Tag
            {...rest()}
            {...badgeTargetAttrs(target())}
            class={cx(
                badge({ tone: props.tone, size: props.size, interactive: props.interactive, class: props.class }),
            )}
        >
            {props.children}
            {isExternal() ? <span class="sr-only"> (opens in a new tab)</span> : null}
        </Tag>
    )
}
