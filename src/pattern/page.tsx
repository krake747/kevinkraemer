import { Seo } from "@pattern/seo"
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { omit, type ParentProps } from "solid-js"

export function PageColumn(props: ParentProps<{ class?: string }>) {
    return (
        <div class={cx("flex-1 px-4 pt-page-top pb-24 sm:px-6 md:px-12 lg:px-24", props.class)}>
            <div class="mx-auto max-w-6xl">{props.children}</div>
        </div>
    )
}

export function PageHeader(props: ComponentProps<"header">) {
    const rest = omit(props, "class", "children")
    return (
        <header {...rest} class={cx(props.class)}>
            {props.children}
        </header>
    )
}

export function PageHeaderTitle(props: ComponentProps<"h1">) {
    const rest = omit(props, "class", "children")
    return (
        <h1
            {...rest}
            class={cx("text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100", props.class)}
        >
            {props.children}
        </h1>
    )
}

export function PageHeaderMeta(props: ComponentProps<"div">) {
    const rest = omit(props, "class", "children")
    return (
        <div {...rest} class={cx("mt-4", props.class)}>
            {props.children}
        </div>
    )
}

export function DocumentPage(props: ParentProps) {
    return (
        <PageColumn>
            <div class="mx-auto flex max-w-4xl flex-col gap-8 kk-cascade">{props.children}</div>
        </PageColumn>
    )
}

export function DetailPage(
    props: ParentProps<{
        seo: ComponentProps<typeof Seo>
    }>,
) {
    return (
        <PageColumn>
            <Seo {...props.seo} />
            {props.children}
        </PageColumn>
    )
}
