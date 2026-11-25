import { type ComponentProps, type JSX } from "@solidjs/web"
import { createPolymorphic } from "@ui/create-polymorphic"
import { cx } from "@ui/cva.config"
import { omit } from "solid-js"

export function DocumentSection(props: ComponentProps<"section">) {
    const rest = omit(props, "class", "children")
    return (
        <section {...rest} class={cx("animate-fade-up", props.class)}>
            {props.children}
        </section>
    )
}

type DocumentSectionBodyDivProps = ComponentProps<"div"> & { as?: "div" }
type DocumentSectionBodyPProps = ComponentProps<"p"> & { as: "p" }

export function DocumentSectionBody(_props: DocumentSectionBodyDivProps | DocumentSectionBodyPProps): JSX.Element {
    const { props, Tag, rest } = createPolymorphic(_props, "div")
    return (
        <Tag
            {...rest}
            class={cx(
                "max-w-prose text-base/[1.8] text-stone-600 dark:text-stone-400",
                props.as === "div" && "flex flex-col gap-4",
                props.class,
            )}
        >
            {props.children}
        </Tag>
    )
}
