import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noSeparateLeading } from "./no-separate-leading.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/no-separate-leading", noSeparateLeading, {
    valid: [
        {
            name: "text size without leading",
            filename: "src/features/log/card.tsx",
            code: `const label = "font-mono text-xs text-stone-600"`,
        },
    ],
    invalid: [
        {
            name: "leading with text size autofixes",
            filename: "src/features/log/card.tsx",
            code: `const label = "font-mono text-xs leading-relaxed text-stone-600"`,
            output: `const label = "font-mono text-xs text-stone-600"`,
            errors: [{ messageId: "separateLeading" }],
        },
        {
            name: "leading without text size reports",
            filename: "src/features/log/card.tsx",
            code: `const label = "mt-2 leading-relaxed"`,
            errors: [{ messageId: "separateLeading" }],
        },
    ],
})
