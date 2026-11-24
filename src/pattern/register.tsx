import { dynamic, type ComponentProps, type JSX } from "@solidjs/web"
import { Anchor } from "@ui/anchor"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { ArrowRight, ChevronLeft } from "@ui/icon"
import { StackRow } from "@ui/stack-row"
import { merge, omit, Show, type ParentProps, type VoidProps } from "solid-js"

type RegisterDivProps = ComponentProps<"div"> & { as?: "div" }
type RegisterUlProps = ComponentProps<"ul"> & { as: "ul" }
type RegisterDlProps = ComponentProps<"dl"> & { as: "dl" }

export function Register(props: RegisterDivProps | RegisterUlProps | RegisterDlProps) {
    const merged = merge({ as: "div" } as const, props)
    const rest = omit(merged, "as", "class", "children")
    const Tag = dynamic(() => merged.as)
    return (
        <Tag {...rest} class={cx("m-0 flex list-none flex-col gap-2 p-0", merged.class)}>
            {merged.children}
        </Tag>
    )
}

type RegisterRowProps = ParentProps<{
    href: string
    title: string
    description?: string
    meta?: JSX.Element
    lines?: 1 | 2
    titleAs?: "span" | "h2" | "h3"
    as?: "div" | "li" | "article"
    class?: string
}>

export function RegisterRow(props: RegisterRowProps) {
    const lines = (): string => {
        if (props.lines === 1) {
            return "line-clamp-1"
        }
        return "line-clamp-2"
    }
    const Title = dynamic(() => props.titleAs ?? "span")
    return (
        <StackRow as={props.as ?? "div"} interactive class={cx("flex items-center justify-between", props.class)}>
            <a href={props.href} class="flex min-w-0 flex-1 items-center justify-between gap-4">
                <span class="min-w-0 flex-1">
                    <Title class="block truncate font-semibold text-stone-900 transition-colors group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400">
                        {props.title}
                    </Title>
                    <Show when={props.description}>
                        {(description) => (
                            <span class={cx("mt-1 block text-sm/relaxed text-stone-600 dark:text-stone-400", lines())}>
                                {description()}
                            </span>
                        )}
                    </Show>
                    <Show when={props.meta}>
                        {(meta) => (
                            <span class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400">
                                {meta()}
                            </span>
                        )}
                    </Show>
                </span>
                <span
                    aria-hidden="true"
                    class="hidden shrink-0 items-center text-stone-600 transition-colors group-hover:text-emerald-700 sm:inline-flex dark:text-stone-400 dark:group-hover:text-emerald-400"
                >
                    <ArrowRight class="size-4 transition-transform duration-150 ease-out-quart group-hover:pointer-fine:translate-x-1" />
                </span>
            </a>
        </StackRow>
    )
}

const railMain = cva({
    base: "flex min-w-0 flex-col",
    variants: {
        spacing: {
            tight: "gap-6",
            loose: "gap-10",
        },
    },
    defaultVariants: {
        spacing: "tight",
    },
})

type RegisterWithRailProps = ParentProps<
    {
        rail: JSX.Element
        labelledby?: string
        class?: string
    } & VariantProps<typeof railMain>
>

export function RegisterWithRail(props: RegisterWithRailProps) {
    return (
        <div class={cx("grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]", props.class)}>
            <div class={cx(railMain({ spacing: props.spacing }))}>{props.children}</div>
            <aside class="hidden lg:block" aria-labelledby={props.labelledby}>
                <div class="sticky top-[calc(var(--header-h)+1rem)] flex flex-col gap-4">{props.rail}</div>
            </aside>
        </div>
    )
}

type EmptyRegisterProps = ParentProps<{
    title: JSX.Element
    note?: JSX.Element
    action?: JSX.Element
    size?: "relaxed" | "spacious"
    class?: string
}>

export function EmptyRegister(props: EmptyRegisterProps) {
    return (
        <StackRow size={props.size ?? "relaxed"} class={cx("text-center", props.class)}>
            <p class="font-mono text-sm text-stone-700 dark:text-stone-300">{props.title}</p>
            <Show when={props.note}>
                {(note) => <p class="mt-2 font-mono text-xs text-stone-600 dark:text-stone-400">{note()}</p>}
            </Show>
            <Show when={props.action}>{(action) => <div class="mt-4">{action()}</div>}</Show>
            {props.children}
        </StackRow>
    )
}

export function ReturnToRegister(props: VoidProps<{ href: string; label: string; class?: string }>) {
    return (
        <Anchor
            href={props.href}
            variant="muted"
            class={cx("hit-area-y-2 inline-flex items-center gap-1.5", props.class)}
        >
            <ChevronLeft class="size-3 shrink-0" />
            {props.label}
        </Anchor>
    )
}
