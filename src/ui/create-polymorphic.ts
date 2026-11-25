import { dynamic, type ValidComponent } from "@solidjs/web"
import { isStatic, merge, omit } from "solid-js"

export function createPolymorphic<TProps extends { as?: ValidComponent; class?: unknown; children?: unknown }>(
    _props: TProps,
    defaultAs: ValidComponent,
    ...extraKeys: (keyof TProps & string)[]
) {
    const props = merge({ as: defaultAs } as const, _props)
    const Tag = dynamic(() => props.as, { static: isStatic(_props, "as") })
    const rest = omit(props, "as", "class", "children", ...extraKeys)
    return { props, Tag, rest }
}
