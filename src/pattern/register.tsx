import { StackRow } from "@pattern/stack"
import type { ComponentProps, JSX } from "@solidjs/web"
import { Anchor } from "@ui/anchor"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { ArrowRight, ChevronLeft } from "@ui/icon"
import type { RenderProps } from "@ui/render"
import { createContext, merge, omit, useContext, type ParentProps } from "solid-js"

type RegisterRowProps = ParentProps<{
    href: string
    class?: string
    render?: (props: RenderProps) => JSX.Element
}>

export function RegisterRow(props: RegisterRowProps) {
    const rest = omit(props, "class", "children", "href", "render")
    return (
        <StackRow
            {...rest}
            render={props.render}
            interactive
            class={cx("flex items-center justify-between", props.class)}
        >
            <a href={props.href} class="flex min-w-0 flex-1 items-center justify-between gap-4">
                <span class="min-w-0 flex-1">{props.children}</span>
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

type RegisterRowTitleProps = ComponentProps<"span"> & {
    render?: (props: { class?: string; children?: JSX.Element }) => JSX.Element
}

export function RegisterRowTitle(props: RegisterRowTitleProps) {
    const rest = omit(props, "class", "children", "render")
    const resolved = merge(rest, {
        get class() {
            return cx(
                "block truncate font-semibold text-stone-900 transition-colors group-hover:text-emerald-800 dark:text-stone-100 dark:group-hover:text-emerald-400",
                props.class,
            )
        },
        get children() {
            return props.children
        },
    })
    return <>{props.render?.(resolved) ?? <span {...resolved} />}</>
}

const registerRowDescription = cva({
    base: "mt-1 block text-sm/relaxed text-stone-600 dark:text-stone-400",
    variants: {
        lines: {
            1: "line-clamp-1",
            2: "line-clamp-2",
        },
    },
    defaultVariants: {
        lines: 2,
    },
})

type RegisterRowDescriptionProps = ComponentProps<"span"> & VariantProps<typeof registerRowDescription>

export function RegisterRowDescription(props: RegisterRowDescriptionProps) {
    const rest = omit(props, "class", "children", "lines")
    return (
        <span {...rest} class={cx(registerRowDescription({ lines: props.lines, class: props.class }))}>
            {props.children}
        </span>
    )
}

export function RegisterRowMeta(props: ComponentProps<"span">) {
    const rest = omit(props, "class", "children")
    return (
        <span
            {...rest}
            class={cx(
                "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-stone-600 tabular-nums dark:text-stone-400",
                props.class,
            )}
        >
            {props.children}
        </span>
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

const RegisterWithRailSpacing = createContext<() => VariantProps<typeof railMain>["spacing"]>(() => undefined)

type RegisterWithRailProps = ParentProps<
    {
        class?: string
    } & VariantProps<typeof railMain>
>

export function RegisterWithRail(props: RegisterWithRailProps) {
    const rest = omit(props, "class", "children", "spacing")
    const spacing = (): VariantProps<typeof railMain>["spacing"] => props.spacing
    return (
        <RegisterWithRailSpacing value={spacing}>
            <div {...rest} class={cx("grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]", props.class)}>
                {props.children}
            </div>
        </RegisterWithRailSpacing>
    )
}

export function RegisterWithRailMain(props: ParentProps<{ class?: string }>) {
    const spacing = useContext(RegisterWithRailSpacing)
    const rest = omit(props, "class", "children")
    return (
        <div {...rest} class={cx(railMain({ spacing: spacing(), class: props.class }))}>
            {props.children}
        </div>
    )
}

export function RegisterWithRailRail(props: ParentProps<{ labelledby?: string; class?: string }>) {
    const rest = omit(props, "class", "children", "labelledby")
    return (
        <aside {...rest} class={cx("hidden lg:block", props.class)} aria-labelledby={props.labelledby}>
            <div class="sticky top-[calc(var(--header-h)+1rem)] flex flex-col gap-4">{props.children}</div>
        </aside>
    )
}

type EmptyRegisterProps = ParentProps<{
    size?: "relaxed" | "spacious"
    class?: string
}>

export function EmptyRegister(props: EmptyRegisterProps) {
    const rest = omit(props, "class", "children", "size")
    return (
        <StackRow {...rest} size={props.size ?? "relaxed"} class={cx("text-center", props.class)}>
            {props.children}
        </StackRow>
    )
}

export function EmptyRegisterTitle(props: ComponentProps<"p">) {
    const rest = omit(props, "class", "children")
    return (
        <p {...rest} class={cx("font-mono text-sm text-stone-700 dark:text-stone-300", props.class)}>
            {props.children}
        </p>
    )
}

export function EmptyRegisterNote(props: ComponentProps<"p">) {
    const rest = omit(props, "class", "children")
    return (
        <p {...rest} class={cx("mt-2 font-mono text-xs text-stone-600 dark:text-stone-400", props.class)}>
            {props.children}
        </p>
    )
}

export function EmptyRegisterAction(props: ComponentProps<"div">) {
    const rest = omit(props, "class", "children")
    return (
        <div {...rest} class={cx("mt-4", props.class)}>
            {props.children}
        </div>
    )
}

export function ReturnToRegister(props: ParentProps<{ href: string; class?: string }>) {
    const rest = omit(props, "class", "children", "href")
    return (
        <Anchor
            {...rest}
            href={props.href}
            variant="muted"
            class={cx("hit-area-y-2 inline-flex items-center gap-1.5", props.class)}
        >
            <ChevronLeft class="size-3 shrink-0" />
            {props.children}
        </Anchor>
    )
}
