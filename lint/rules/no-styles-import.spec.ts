import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noStylesImport } from "./no-styles-import.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "ts" } },
})

tester.run("kk/no-styles-import", noStylesImport, {
    valid: [
        {
            name: "alias import from the ui layer",
            filename: "src/ui/button.tsx",
            code: `import { cx } from "@ui/cva.config"`,
        },
        {
            name: "feature css import",
            filename: "src/routes/logs/[slug].tsx",
            code: `import "@features/log/prose.css"`,
        },
    ],
    invalid: [
        {
            name: "bare styles alias import",
            filename: "src/ui/button.tsx",
            code: `import { tokens } from "@styles/tokens"`,
            errors: [{ messageId: "stylesImport" }],
        },
        {
            name: "file under the styles folder",
            filename: "src/styles/tokens.ts",
            code: `export const gap = 2`,
            errors: [{ messageId: "stylesFile" }],
        },
    ],
})
