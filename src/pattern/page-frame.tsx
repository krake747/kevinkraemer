import { dynamic, type ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { merge, omit } from "solid-js"

type PageFrameProps = (ComponentProps<"div"> | ComponentProps<"section">) & { as?: "div" | "section" }

export function PageFrame(_props: PageFrameProps) {
    const props = merge({ as: "div" } as const, _props)
    const Tag = dynamic(() => props.as)
    const rest = omit(props, "as", "class", "children")
    return (
        <Tag {...rest} class={cx("px-4 pt-page-top pb-20 sm:px-6 md:px-12 lg:px-24", props.class)}>
            {props.children}
        </Tag>
    )
}
