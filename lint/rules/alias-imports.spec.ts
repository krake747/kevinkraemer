import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { aliasImports } from "./alias-imports.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "ts" } },
})

tester.run("kk/alias-imports", aliasImports, {
    valid: [
        {
            name: "alias import under src",
            filename: "src/features/log/card.tsx",
            code: `import { siteContent } from "@core/content/site-content"`,
        },
        {
            name: "relative css import",
            filename: "src/app.tsx",
            code: `import "./app.css"`,
        },
        {
            name: "relative import in the allowlisted file",
            filename: "src/core/site/problem.ts",
            code: `import { apiVersion } from "./api-version.ts"`,
        },
        {
            name: "relative import in the content intake allowlisted file",
            filename: "src/core/content/content-intake.ts",
            code: `import { PROJECT_CATEGORIES } from "./project-category.ts"`,
        },
        {
            name: "relative import outside src",
            filename: "lint/rules/helper.ts",
            code: `import { helper } from "./helper-util"`,
        },
    ],
    invalid: [
        {
            name: "relative sibling import under src",
            filename: "src/features/log/card.tsx",
            code: `import { filterLogs } from "./filter"`,
            errors: [{ messageId: "relativeImport" }],
        },
        {
            name: "relative parent import under src",
            filename: "src/features/log/card.tsx",
            code: `export { siteContent } from "../content/site-content"`,
            errors: [{ messageId: "relativeImport" }],
        },
    ],
})
