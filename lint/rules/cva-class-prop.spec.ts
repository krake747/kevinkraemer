import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { cvaClassProp } from "./cva-class-prop.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/cva-class-prop", cvaClassProp, {
    valid: [
        {
            name: "class folded into the variant call",
            code: `const label = cx(badge({ tone: tone(), class: props.class }))`,
        },
        {
            name: "plain classes with a trailing props.class",
            code: `const label = cx("font-mono text-xs outline-none", props.class)`,
        },
        {
            name: "variant call without a trailing class",
            code: `const label = cx(badge({ tone: tone() }))`,
        },
        {
            name: "variant call that already folds class",
            code: `const label = cx(badge({ tone: tone(), class: "extra" }), props.class)`,
        },
    ],
    invalid: [
        {
            name: "trailing props.class folds into the variant call",
            code: `const label = cx(badge({ tone: tone() }), props.class)`,
            output: `const label = cx(badge({ tone: tone(), class: props.class }))`,
            errors: [{ messageId: "foldClass" }],
        },
    ],
})
