import { type ComponentProps, type JSX } from "@solidjs/web"
import { createPolymorphic } from "@ui/create-polymorphic"
import { cx } from "@ui/cva.config"
import { SectionHeading } from "@ui/section-heading"
import { omit, type ParentProps } from "solid-js"

type DocumentSectionProps = ParentProps<{
    id: string
    title: string
    sectionId?: string
    class?: string
}>

export function DocumentSection(props: DocumentSectionProps) {
    const sectionId = (): string | undefined => {
        if (props.sectionId) {
            return props.sectionId
        }
        return undefined
    }
    const rest = omit(props, "id", "title", "sectionId", "class", "children")
    return (
        <section {...rest} aria-labelledby={props.id} id={sectionId()} class={cx("animate-fade-up", props.class)}>
            <SectionHeading id={props.id}>{props.title}</SectionHeading>
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
