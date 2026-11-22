import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noRawColor } from "./no-raw-color.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/no-raw-color", noRawColor, {
    valid: [
        {
            name: "theme token class",
            filename: "src/features/log/card.tsx",
            code: `const label = "font-mono text-stone-600"`,
        },
        {
            name: "seo theme-color hex",
            filename: "src/pattern/seo.tsx",
            code: `const color = "#fafaf9"`,
        },
    ],
    invalid: [
        {
            name: "raw hex in a class string",
            filename: "src/features/log/card.tsx",
            code: `const label = "bg-[#fafaf9]"`,
            errors: [{ messageId: "rawColor" }],
        },
    ],
})
