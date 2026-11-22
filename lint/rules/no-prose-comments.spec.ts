import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { noProseComments } from "./no-prose-comments.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "ts" } },
})

tester.run("kk/no-prose-comments", noProseComments, {
    valid: [
        {
            name: "tooling directives stay allowed",
            code: `// oxlint-disable-next-line no-unused-vars\nconst used = 1\nvoid used`,
        },
        {
            name: "see-adr pointer stays allowed",
            code: `// See ADR-0004 for why this alias is relative.\nconst edge = true\nvoid edge`,
        },
        {
            name: "trailing code comment is not a prose block",
            code: `const retry = 3 // attempts, not prose`,
        },
    ],
    invalid: [
        {
            name: "full-line prose comment",
            code: `// Retry the fetch when the edge function is cold.\nconst retry = 3\nvoid retry`,
            errors: [{ messageId: "prose" }],
        },
    ],
})
