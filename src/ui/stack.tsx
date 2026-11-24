import { dynamic, type ComponentProps, type JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { merge, omit, isStatic } from "solid-js"

type StackDivProps = ComponentProps<"div"> & { as?: "div" }
type StackUlProps = ComponentProps<"ul"> & { as: "ul" }
type StackDlProps = ComponentProps<"dl"> & { as: "dl" }

export function Stack(_props: StackDivProps | StackUlProps | StackDlProps): JSX.Element {
    const props = merge({ as: "div" } as const, _props)
    const Tag = dynamic(() => props.as, { static: isStatic(_props, "as") })
    const rest = omit(props, "as", "class", "children")

    return (
        <Tag {...rest} class={cx("m-0 flex list-none flex-col gap-2 p-0", props.class)}>
            {props.children}
        </Tag>
    )
}
