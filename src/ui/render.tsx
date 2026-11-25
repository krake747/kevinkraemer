import type { ComponentProps, JSX } from "@solidjs/web"
import { Show } from "solid-js"

export type RenderProps = Pick<ComponentProps<"div">, "class" | "children" | "id" | "aria-label" | "aria-labelledby">

export type WithRender = {
    render?: (props: RenderProps) => JSX.Element
}

export function renderElement<P extends { class?: string; children?: JSX.Element }>(options: {
    defaultTag: "div" | "span"
    render: () => ((props: P) => JSX.Element) | undefined
    props: () => P
}): JSX.Element {
    return (
        <Show
            when={options.render()}
            fallback={options.defaultTag === "span" ? <span {...options.props()} /> : <div {...options.props()} />}
        >
            {(render) => render()(options.props())}
        </Show>
    )
}
