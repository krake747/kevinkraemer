import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noDescribeFunctionTitle } from "./no-describe-function-title.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "ts" } },
})

tester.run("kk/no-describe-function-title", noDescribeFunctionTitle, {
    valid: [
        {
            name: "behaviour title",
            code: `describe("the tag list", () => {})`,
        },
        {
            name: "single lowercase word",
            code: `describe("tags", () => {})`,
        },
        {
            name: "non-string title",
            code: `describe(suiteName, () => {})`,
        },
    ],
    invalid: [
        {
            name: "camelCase function title",
            code: `describe("sortLogEntries", () => {})`,
            errors: [{ messageId: "functionTitle" }],
        },
    ],
})
