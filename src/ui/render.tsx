import type { ComponentProps, JSX } from "@solidjs/web"
import { Show } from "solid-js"

export type RenderProps = Pick<
    ComponentProps<"div">,
    | "class"
    | "children"
    | "id"
    | "title"
    | "style"
    | "role"
    | "tabindex"
    | "hidden"
    | "lang"
    | "dir"
    | "aria-label"
    | "aria-labelledby"
    | "aria-describedby"
    | "aria-hidden"
    | "aria-expanded"
    | "aria-controls"
    | "aria-current"
> & {
    [key: `data-${string}`]: string | number | boolean | undefined
}

export type WithRender<P = RenderProps> = {
    render?: (props: P) => JSX.Element
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
