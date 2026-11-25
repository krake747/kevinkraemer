import { type ComponentProps, type JSX } from "@solidjs/web"
import { createPolymorphic } from "@ui/create-polymorphic"
import { cx } from "@ui/cva.config"

type StackDivProps = ComponentProps<"div"> & { as?: "div" }
type StackUlProps = ComponentProps<"ul"> & { as: "ul" }
type StackDlProps = ComponentProps<"dl"> & { as: "dl" }

export function Stack(_props: StackDivProps | StackUlProps | StackDlProps): JSX.Element {
    const { props, Tag, rest } = createPolymorphic(_props, "div")

    return (
        <Tag {...rest} class={cx("m-0 flex list-none flex-col gap-2 p-0", props.class)}>
            {props.children}
        </Tag>
    )
}
