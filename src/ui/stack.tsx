import { type ComponentProps, type JSX } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { merge, omit } from "solid-js"

type StackProps = ComponentProps<"div"> & {
    render?: (props: Record<string, any>) => JSX.Element
}

export function Stack(props: StackProps): JSX.Element {
    const rest = omit(props, "class", "children", "render")
    const merged = merge(rest, {
        get class() {
            return cx("m-0 flex list-none flex-col gap-2 p-0", props.class)
        },
        get children() {
            return props.children
        },
    })
    return <>{props.render?.(merged) ?? <div {...merged} />}</>
}
