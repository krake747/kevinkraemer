import type { ComponentProps } from "@solidjs/web"

export type RenderProps = Pick<ComponentProps<"div">, "class" | "children" | "id" | "aria-label" | "aria-labelledby">
