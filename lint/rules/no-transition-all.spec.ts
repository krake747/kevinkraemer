import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noTransitionAll } from "./no-transition-all.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/no-transition-all", noTransitionAll, {
    valid: [
        {
            name: "specific transition utility",
            filename: "src/features/log/card.tsx",
            code: `const label = "font-mono transition-colors"`,
        },
    ],
    invalid: [
        {
            name: "transition-all utility",
            filename: "src/features/log/card.tsx",
            code: `const label = "font-mono transition-all"`,
            errors: [{ messageId: "transitionAll" }],
        },
    ],
})
