import type { ComponentProps } from "@solidjs/web"
import {
    Dialog,
    DialogBackdrop as BaseDialogBackdrop,
    DialogClose as BaseDialogClose,
    DialogContent as BaseDialogContent,
    DialogTitle as BaseDialogTitle,
    DialogTrigger,
} from "@ui-sdk/solid/dialog"
import { cva, cx, type VariantProps } from "@ui/cva.config"
import { omit } from "solid-js"

export { Dialog, DialogTrigger }

const dialogContent = cva({
    base: "fixed z-50 overflow-hidden border border-stone-200 bg-stone-50 transition-[opacity,scale] duration-150 ease-out-quart data-closed:opacity-0 data-ending-style:scale-98 data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-98 data-starting-style:opacity-0 dark:border-stone-800 dark:bg-stone-950",
    variants: {
        align: {
            center: "inset-x-4 inset-y-0 m-auto h-fit",
            top: "inset-x-4 top-20 mx-auto",
        },
        size: {
            sm: "max-w-sm",
            md: "max-w-lg",
            lg: "max-w-2xl",
        },
    },
    defaultVariants: {
        align: "center",
        size: "md",
    },
})

export function DialogBackdrop(props: ComponentProps<typeof BaseDialogBackdrop>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseDialogBackdrop
            {...rest}
            class={cx(
                "fixed inset-0 z-50 bg-stone-950/20 transition-opacity duration-150 ease-out-quart data-closed:opacity-0 data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:opacity-0 dark:bg-stone-950/40",
                props.class,
            )}
        >
            {props.children}
        </BaseDialogBackdrop>
    )
}

export function DialogContent(props: ComponentProps<typeof BaseDialogContent> & VariantProps<typeof dialogContent>) {
    const rest = omit(props, "align", "size", "class", "children")

    return (
        <BaseDialogContent {...rest} class={cx(dialogContent({ align: props.align, size: props.size }), props.class)}>
            {props.children}
        </BaseDialogContent>
    )
}

export function DialogHeader(props: ComponentProps<"div">) {
    const rest = omit(props, "class", "children")

    return (
        <div {...rest} data-slot="dialog-header" class={cx("flex flex-col gap-2", props.class)}>
            {props.children}
        </div>
    )
}

export function DialogFooter(props: ComponentProps<"div">) {
    const rest = omit(props, "class", "children")

    return (
        <div
            {...rest}
            data-slot="dialog-footer"
            class={cx("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", props.class)}
        >
            {props.children}
        </div>
    )
}

export function DialogTitle(props: ComponentProps<typeof BaseDialogTitle>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseDialogTitle {...rest} class={cx("font-mono text-sm text-stone-900 dark:text-stone-100", props.class)}>
            {props.children}
        </BaseDialogTitle>
    )
}

export function DialogClose(props: ComponentProps<typeof BaseDialogClose>) {
    const rest = omit(props, "class", "children")

    return (
        <BaseDialogClose
            {...rest}
            class={cx(
                "hit-area-x-2 hit-area-y-3 font-mono text-xs uppercase tracking-widest text-stone-500 transition-colors hover:text-emerald-700 active:scale-97 dark:text-stone-400 dark:hover:text-emerald-400",
                props.class,
            )}
        >
            {props.children}
        </BaseDialogClose>
    )
}
