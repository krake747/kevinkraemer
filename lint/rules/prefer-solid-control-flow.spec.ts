import { RuleTester } from "vite-plus/lint/plugins-dev"
import { describe, it } from "vite-plus/test"

import { preferSolidControlFlow } from "./prefer-solid-control-flow.js"

RuleTester.describe = describe
RuleTester.it = it

const tester = new RuleTester({
    languageOptions: { parserOptions: { lang: "tsx" } },
})

tester.run("kk/prefer-solid-control-flow", preferSolidControlFlow, {
    valid: [
        {
            name: "ternary in a class attribute stays allowed",
            filename: "src/features/log/card.tsx",
            code: `export function Card(props: { active: boolean }) {\nreturn <div class={props.active ? "on" : "off"} />\n}`,
        },
        {
            name: "render prop with nullish fallback stays allowed",
            filename: "src/ui/stack-row.tsx",
            code: `export function StackRow(props: { render?: (props: Record<string, any>) => JSX.Element }) {\nconst merged = {}\nreturn <>{props.render?.(merged) ?? <div {...merged} />}</>\n}`,
        },
        {
            name: "Show control flow stays allowed",
            filename: "src/features/log/card.tsx",
            code: `import { Show } from "solid-js"\nexport function Card(props: { when: boolean }) {\nreturn <Show when={props.when}><span>on</span></Show>\n}`,
        },
    ],
    invalid: [
        {
            name: "ternary with a null fallback",
            filename: "src/features/log/card.tsx",
            code: `export function Card(props: { active: boolean }) {\nreturn <div>{props.active ? <span>on</span> : null}</div>\n}`,
            errors: [{ messageId: "preferShow" }],
        },
        {
            name: "logical and with a JSX branch",
            filename: "src/features/log/card.tsx",
            code: `export function Card(props: { active: boolean }) {\nreturn <div>{props.active && <span>on</span>}</div>\n}`,
            errors: [{ messageId: "preferShow" }],
        },
        {
            name: "ternary in a For callback",
            filename: "src/features/log/card.tsx",
            code: `import { For } from "solid-js"\nexport function Card(props: { items: string[] }) {\nreturn <For each={props.items}>{(item) => (item.length > 0 ? <span>{item}</span> : null)}</For>\n}`,
            errors: [{ messageId: "preferShow" }],
        },
        {
            name: "ternary with a JSX branch on both sides",
            filename: "src/features/log/card.tsx",
            code: `export function Card(props: { href?: string; label: string }) {\nreturn <div>{props.href ? <a href={props.href}>{props.label}</a> : <span>{props.label}</span>}</div>\n}`,
            errors: [{ messageId: "preferSwitch" }],
        },
    ],
})
