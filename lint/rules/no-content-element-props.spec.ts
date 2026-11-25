import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noContentElementProps } from "./no-content-element-props.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/no-content-element-props", noContentElementProps, {
    valid: [
        {
            name: "host with children stays allowed",
            filename: "src/ui/panel-label.tsx",
            code: `import type { ComponentProps, JSX } from "@solidjs/web"\nexport function PanelLabel(props: ComponentProps<"div"> & { label?: string; children?: JSX.Element }) {\nreturn <div />\n}`,
        },
        {
            name: "host with a render function stays allowed",
            filename: "src/ui/stack-row.tsx",
            code: `import type { ComponentProps, JSX } from "@solidjs/web"\nexport function StackRow(props: ComponentProps<"div"> & { render?: (props: Record<string, any>) => JSX.Element }) {\nreturn <div />\n}`,
        },
        {
            name: "parent props with a return type stay allowed",
            filename: "src/pattern/page.tsx",
            code: `import type { JSX } from "@solidjs/web"\nimport type { ParentProps } from "solid-js"\nexport function PageColumn(props: ParentProps<{ class?: string }>): JSX.Element {\nreturn <div />\n}`,
        },
        {
            name: "files outside ui and pattern are skipped",
            filename: "src/features/log/card.tsx",
            code: `import type { JSX } from "@solidjs/web"\nexport function LogCard(props: { as?: "div"; rail: JSX.Element }) {\nreturn <div />\n}`,
        },
    ],
    invalid: [
        {
            name: "as prop on a ui component",
            filename: "src/ui/stack-row.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nexport function StackRow(props: ComponentProps<"div"> & { as?: "div" }) {\nreturn <div />\n}`,
            errors: [{ messageId: "noAsProp" }],
        },
        {
            name: "optional element prop on a pattern component",
            filename: "src/pattern/register.tsx",
            code: `import type { JSX } from "@solidjs/web"\nexport function RegisterRowMeta(props: { meta?: JSX.Element }) {\nreturn <div />\n}`,
            errors: [{ messageId: "noElementProp" }],
        },
        {
            name: "required element prop through an alias",
            filename: "src/pattern/register.tsx",
            code: `import type { JSX } from "@solidjs/web"\ntype RegisterRailProps = { rail: JSX.Element }\nexport function RegisterRail(props: RegisterRailProps) {\nreturn <div />\n}`,
            errors: [{ messageId: "noElementProp" }],
        },
    ],
})
