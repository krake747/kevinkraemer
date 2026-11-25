import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { componentPropsOmit } from "./component-props-omit.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/component-props-omit", componentPropsOmit, {
    valid: [
        {
            name: "single host omits owned keys and spreads the rest",
            filename: "src/ui/panel-label.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nimport { omit } from "solid-js"\nexport function PanelLabel(props: ComponentProps<"div">) {\nconst rest = omit(props, "class", "children")\nreturn <div {...rest} />\n}`,
        },
        {
            name: "host with render omits owned keys including render",
            filename: "src/ui/stack-row.tsx",
            code: `import type { ComponentProps, JSX } from "@solidjs/web"\nimport { omit } from "solid-js"\nexport function StackRow(props: ComponentProps<"div"> & { render?: (props: Record<string, any>) => JSX.Element }) {\nconst rest = omit(props, "class", "children", "render")\nreturn <div {...rest} />\n}`,
        },
        {
            name: "files outside ui and pattern are skipped",
            filename: "src/features/log/card.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nexport function LogCard(props: ComponentProps<"div">) {\nreturn <div />\n}`,
        },
        {
            name: "single host with merged defaults omits from the merged object",
            filename: "src/ui/decor-mark.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nimport { merge, omit } from "solid-js"\nexport function DecorMark(_props: ComponentProps<"svg"> & { arm?: "full" }) {\nconst props = merge({ arm: "full" } as const, _props)\nconst rest = omit(props, "arm", "class", "children")\nreturn <svg {...rest} />\n}`,
        },
        {
            name: "host delegating spread to renderElement",
            filename: "src/pattern/stack.tsx",
            code: `import type { ComponentProps, JSX } from "@solidjs/web"\nimport { renderElement } from "@ui/render"\nimport { merge, omit } from "solid-js"\nexport function Stack(props: ComponentProps<"div"> & { render?: (props: object) => JSX.Element }) {\nconst rest = omit(props, "class", "children", "render")\nconst merged = merge(rest, { get class() { return props.class } })\nreturn renderElement({ defaultTag: "div", render: () => props.render, props: () => merged })\n}`,
        },
    ],
    invalid: [
        {
            name: "single host without omit and spread",
            filename: "src/ui/panel-label.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nexport function PanelLabel(props: ComponentProps<"div">) {\nreturn <div class="mb-3" />\n}`,
            errors: [{ messageId: "missingOmit" }],
        },
        {
            name: "single host with merged defaults but no omit",
            filename: "src/ui/decor-mark.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nimport { merge } from "solid-js"\nexport function DecorMark(_props: ComponentProps<"svg"> & { arm?: "full" }) {\nconst props = merge({ arm: "full" } as const, _props)\nreturn <svg class="mark" />\n}`,
            errors: [{ messageId: "missingOmit" }],
        },
        {
            name: "host with render but no omit",
            filename: "src/ui/stack-row.tsx",
            code: `import type { ComponentProps, JSX } from "@solidjs/web"\nexport function StackRow(props: ComponentProps<"div"> & { render?: (props: Record<string, any>) => JSX.Element }) {\nreturn <div />\n}`,
            errors: [{ messageId: "missingOmit" }],
        },
    ],
})
