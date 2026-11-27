/// <reference types="vite/client" />
/// <reference types="filesystem-routing/types" />

declare module "@ui-sdk/core/web.css"

declare module "~icons/*" {
    import type { ComponentProps, JSX } from "@solidjs/web"

    const component: (props: ComponentProps<"svg">) => JSX.Element
    export default component
}
