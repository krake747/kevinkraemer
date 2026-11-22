import type { ComponentProps } from "@solidjs/web"
import {
    Command,
    CommandEmpty as BaseCommandEmpty,
    CommandGroup,
    CommandGroupLabel as BaseCommandGroupLabel,
    CommandInput as BaseCommandInput,
    CommandItem as BaseCommandItem,
    CommandList as BaseCommandList,
} from "@ui-sdk/solid/command"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export { Command, CommandGroup }

export function CommandInput(props: ComponentProps<typeof BaseCommandInput>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseCommandInput
            {...rest}
            class={cx(
                "h-12 w-full bg-transparent font-mono text-base outline-none placeholder:text-stone-500 dark:placeholder:text-stone-400",
                props.class,
            )}
        >
            {props.children}
        </BaseCommandInput>
    )
}

export function CommandEmpty(props: ComponentProps<typeof BaseCommandEmpty>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseCommandEmpty {...rest} class={cx("font-mono text-xs outline-none", props.class)}>
            {props.children}
        </BaseCommandEmpty>
    )
}

export function CommandList(props: ComponentProps<typeof BaseCommandList>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseCommandList
            {...rest}
            class={cx("kk-scrollbar max-h-100 overflow-y-auto scroll-fade-y py-2 outline-none", props.class)}
        >
            {props.children}
        </BaseCommandList>
    )
}

export function CommandGroupLabel(props: ComponentProps<typeof BaseCommandGroupLabel>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseCommandGroupLabel
            {...rest}
            class={cx("px-4 pt-2 pb-1 font-mono text-xs text-stone-600 select-none dark:text-stone-400", props.class)}
        >
            {props.children}
        </BaseCommandGroupLabel>
    )
}

export function CommandItem(props: ComponentProps<typeof BaseCommandItem>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseCommandItem
            {...rest}
            class={cx(
                "hit-area-y-0.5 flex w-full items-center gap-3 px-4 py-2.5 text-left font-mono text-sm text-stone-600 select-none data-highlighted:bg-stone-100 data-highlighted:text-emerald-800 dark:text-stone-300 dark:data-highlighted:bg-stone-900 dark:data-highlighted:text-emerald-400",
                props.class,
            )}
        >
            {props.children}
        </BaseCommandItem>
    )
}
