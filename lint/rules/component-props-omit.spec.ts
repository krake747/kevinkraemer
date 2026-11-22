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
            name: "polymorphic host with an as prop is skipped",
            filename: "src/ui/stack-row.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nexport function StackRow(props: ComponentProps<"div"> & { as?: "div" }) {\nreturn <div />\n}`,
        },
        {
            name: "files outside ui and pattern are skipped",
            filename: "src/features/log/card.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nexport function LogCard(props: ComponentProps<"div">) {\nreturn <div />\n}`,
        },
    ],
    invalid: [
        {
            name: "single host without omit and spread",
            filename: "src/ui/panel-label.tsx",
            code: `import type { ComponentProps } from "@solidjs/web"\nexport function PanelLabel(props: ComponentProps<"div">) {\nreturn <div class="mb-3" />\n}`,
            errors: [{ messageId: "missingOmit" }],
        },
    ],
})
