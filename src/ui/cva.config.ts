import { cn as merge } from "cn"
import type { VariantProps } from "cva"
import { defineConfig } from "cva/config"

export const { cva, cx } = defineConfig({ cx: merge })
export { type VariantProps }
