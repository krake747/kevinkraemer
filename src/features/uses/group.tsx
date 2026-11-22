import type { UsesGroup as UsesGroupData, UsesItem } from "@core/content/model"
import { Anchor } from "@ui/anchor"
import { PanelLabel } from "@ui/panel-label"
import { Stack } from "@ui/stack"
import { StackRow } from "@ui/stack-row"
import { For, Match, Show, Switch } from "solid-js"

function toolName(item: UsesItem, variant: "channel" | "muted") {
    const href = item.href
    if (href === undefined) {
        return <span class="font-mono text-sm font-medium text-stone-900 dark:text-stone-100">{item.name}</span>
    }
    return (
        <Anchor href={href} variant={variant} external aria-label={item.ariaLabel} class="hit-area-y-2">
            {item.name}
        </Anchor>
    )
}

function UsesRow(props: { item: UsesItem }) {
    return (
        <StackRow as="li" size="compact" class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
            <span class="sm:w-56 sm:shrink-0">{toolName(props.item, "muted")}</span>
            <span class="min-w-0 text-sm leading-relaxed text-stone-600 sm:flex-1 dark:text-stone-400">
                {props.item.note}
            </span>
        </StackRow>
    )
}

function UsesRows(props: { items: UsesItem[] }) {
    return (
        <Stack as="ul">
            <For each={props.items}>{(item) => <UsesRow item={item} />}</For>
        </Stack>
    )
}

function UsesDailyPanel(props: { items: UsesItem[] }) {
    return (
        <StackRow size="relaxed">
            <ul class="m-0 grid list-none gap-6 p-0 sm:grid-cols-3">
                <For each={props.items}>
                    {(item) => (
                        <li class="flex flex-col gap-1">
                            {toolName(item, "channel")}
                            <span class="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{item.note}</span>
                        </li>
                    )}
                </For>
            </ul>
        </StackRow>
    )
}

function UsesHardware(props: { items: UsesItem[] }) {
    return (
        <StackRow size="relaxed">
            <dl class="m-0 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <For each={props.items}>
                    {(item) => (
                        <div class="flex flex-col gap-1">
                            <dt class="font-mono text-sm font-medium text-stone-900 dark:text-stone-100">
                                {item.name}
                            </dt>
                            <dd class="m-0 font-mono text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                                {item.note}
                            </dd>
                        </div>
                    )}
                </For>
            </dl>
        </StackRow>
    )
}

function UsesPlain(props: { items: UsesItem[] }) {
    return (
        <dl class="m-0 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <For each={props.items}>
                {(item) => (
                    <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                        <dt class="sm:w-32 sm:shrink-0">{toolName(item, "muted")}</dt>
                        <dd class="m-0 min-w-0 text-sm leading-relaxed text-stone-600 sm:flex-1 dark:text-stone-400">
                            {item.note}
                        </dd>
                    </div>
                )}
            </For>
        </dl>
    )
}

export function UsesGroup(props: { group: UsesGroupData }) {
    const layout = () => props.group.layout

    return (
        <div>
            <Show when={layout() !== "plain"}>
                <PanelLabel class={props.group.note ? "mb-2" : "mb-4"}>
                    {props.group.label}
                    <span class="tracking-normal text-stone-500 tabular-nums dark:text-stone-400">
                        ({props.group.items.length})
                    </span>
                </PanelLabel>
            </Show>
            <Show when={props.group.note}>
                <p class="mb-4 max-w-prose text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    {props.group.note}
                </p>
            </Show>
            <Switch>
                <Match when={layout() === "daily"}>
                    <UsesDailyPanel items={props.group.items} />
                </Match>
                <Match when={layout() === "hardware"}>
                    <UsesHardware items={props.group.items} />
                </Match>
                <Match when={layout() === "plain"}>
                    <UsesPlain items={props.group.items} />
                </Match>
                <Match when={layout() === "rows"}>
                    <UsesRows items={props.group.items} />
                </Match>
            </Switch>
        </div>
    )
}
