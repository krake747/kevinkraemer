import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { strictTypes } from "./strict-types.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "ts" } },
})

tester.run("kk/strict-types", strictTypes, {
    valid: [
        {
            name: "as const stays allowed",
            code: `const tones = ["dark", "mid"] as const`,
        },
        {
            name: "as const satisfies stays allowed",
            code: `const faces = {} as const satisfies Record<string, readonly string[]>`,
        },
        {
            name: "satisfies without a cast",
            code: `const entry = { id: "a" } satisfies LogEntry`,
        },
        {
            name: "precise record value type",
            code: `const table: Record<string, number> = {}`,
        },
    ],
    invalid: [
        {
            name: "as unknown as double cast",
            code: `const value = raw as unknown as string`,
            errors: [{ messageId: "uncheckedCast" }, { messageId: "uncheckedCast" }],
        },
        {
            name: "weak record shape",
            code: `const meta: Record<string, unknown> = {}`,
            errors: [{ messageId: "weakRecord" }],
        },
        {
            name: "parenthesized as cast",
            code: `const label = (maybe()) as string`,
            errors: [{ messageId: "uncheckedCast" }],
        },
    ],
})
