import type { ComponentProps, JSX } from "@solidjs/web"

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
    const render = options.render()
    if (render === undefined) {
        const props = options.props()
        return options.defaultTag === "span" ? <span {...props} /> : <div {...props} />
    }
    return <>{render(options.props())}</>
}
