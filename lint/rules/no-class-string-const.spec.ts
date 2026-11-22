import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noClassStringConst } from "./no-class-string-const.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/no-class-string-const", noClassStringConst, {
    valid: [
        {
            name: "object lookup table of class strings",
            code: `const TONE_CLASS: Record<Tone, string> = { dark: "bg-stone-600 dark:bg-stone-500" }`,
        },
        {
            name: "ordinary single-token string",
            code: `const model = "gpt-6-luna"`,
        },
        {
            name: "function-local class string",
            code: `function classes() { const row = "flex px-4 dark:bg-stone-500"; return row }`,
        },
    ],
    invalid: [
        {
            name: "module-level Tailwind string",
            code: `const row = "flex px-4 dark:bg-stone-500"`,
            errors: [{ messageId: "classConst" }],
        },
    ],
})
