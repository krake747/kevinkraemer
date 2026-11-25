import type { UsesGroup as UsesGroupData, UsesItem } from "@core/content/model"
import { PanelLabel } from "@pattern/section"
import { Stack, StackRow } from "@pattern/stack"
import { Anchor } from "@ui/anchor"
import { For, Match, Show, Switch, type VoidProps } from "solid-js"

function toolName(item: UsesItem, variant: "channel" | "muted") {
    if (item.kind === "text") {
        return <span class="font-mono text-sm font-medium text-stone-900 dark:text-stone-100">{item.name}</span>
    }
    return (
        <Anchor
            href={item.href}
            variant={variant}
            target={{ kind: "external" }}
            aria-label={item.ariaLabel}
            class="hit-area-y-2"
        >
            {item.name}
        </Anchor>
    )
}

function UsesRow(props: VoidProps<{ item: UsesItem }>) {
    return (
        <StackRow
            render={(renderProps) => <li {...renderProps} />}
            size="compact"
            class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4"
        >
            <span class="sm:w-56 sm:shrink-0">{toolName(props.item, "muted")}</span>
            <span class="min-w-0 text-sm/relaxed text-stone-600 sm:flex-1 dark:text-stone-400">{props.item.note}</span>
        </StackRow>
    )
}

function UsesRows(props: VoidProps<{ items: UsesItem[] }>) {
    return (
        <Stack render={(renderProps) => <ul {...renderProps} />}>
            <For each={props.items}>{(item) => <UsesRow item={item} />}</For>
        </Stack>
    )
}

function UsesDailyPanel(props: VoidProps<{ items: UsesItem[] }>) {
    return (
        <StackRow size="relaxed">
            <ul class="m-0 grid list-none gap-6 p-0 sm:grid-cols-3">
                <For each={props.items}>
                    {(item) => (
                        <li class="flex flex-col gap-1">
                            {toolName(item, "channel")}
                            <span class="text-sm/relaxed text-stone-600 dark:text-stone-400">{item.note}</span>
                        </li>
                    )}
                </For>
            </ul>
        </StackRow>
    )
}

function UsesHardware(props: VoidProps<{ items: UsesItem[] }>) {
    return (
        <StackRow size="relaxed">
            <dl class="m-0 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                <For each={props.items}>
                    {(item) => (
                        <div class="flex flex-col gap-1">
                            <dt class="font-mono text-sm font-medium text-stone-900 dark:text-stone-100">
                                {item.name}
                            </dt>
                            <dd class="m-0 font-mono text-xs/relaxed text-stone-600 dark:text-stone-400">
                                {item.note}
                            </dd>
                        </div>
                    )}
                </For>
            </dl>
        </StackRow>
    )
}

function UsesPlain(props: VoidProps<{ items: UsesItem[] }>) {
    return (
        <dl class="m-0 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <For each={props.items}>
                {(item) => (
                    <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                        <dt class="sm:w-32 sm:shrink-0">{toolName(item, "muted")}</dt>
                        <dd class="m-0 min-w-0 text-sm/relaxed text-stone-600 sm:flex-1 dark:text-stone-400">
                            {item.note}
                        </dd>
                    </div>
                )}
            </For>
        </dl>
    )
}

export function UsesGroup(props: VoidProps<{ group: UsesGroupData }>) {
    const layout = () => props.group.layout

    return (
        <div>
            <Show when={layout() !== "plain"}>
                <PanelLabel class={props.group.note ? "mb-2" : "mb-4"}>{props.group.label}</PanelLabel>
            </Show>
            <Show when={props.group.note}>
                <p class="mb-4 max-w-prose text-sm/relaxed text-stone-600 dark:text-stone-400">{props.group.note}</p>
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
