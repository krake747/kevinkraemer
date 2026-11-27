import { site } from "@core/site/site-meta"
import { DocumentSection, SectionHeading } from "@pattern/section"
import { cva } from "@ui/cva.config"
import { ArrowUpRightIcon } from "@ui/icon"
import { For, Show } from "solid-js"

const contactCell = cva({
    base: "group flex h-full min-h-40 flex-col justify-between gap-8 p-5 transition-colors duration-150 ease-out-quart md:min-h-56 md:gap-10 md:p-6",
    variants: {
        primary: {
            true: "bg-stone-900 text-stone-50 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700",
            false: "hover:bg-emerald-500/8",
        },
    },
    defaultVariants: {
        primary: false,
    },
})

const contactTitle = cva({
    base: "block text-3xl font-semibold tracking-tight transition-colors duration-150 ease-out-quart lg:text-4xl",
    variants: {
        primary: {
            true: "text-stone-50 group-hover:text-emerald-300",
            false: "text-stone-900 group-hover:text-emerald-800 dark:text-stone-50 dark:group-hover:text-emerald-400",
        },
    },
    defaultVariants: {
        primary: false,
    },
})

const contactNote = cva({
    base: "mt-3 block max-w-[26ch] text-sm/relaxed",
    variants: {
        primary: {
            true: "text-stone-300",
            false: "text-stone-600 dark:text-stone-400",
        },
    },
    defaultVariants: {
        primary: false,
    },
})

const contactAction = cva({
    base: "flex items-center justify-between gap-4 font-mono text-xs tracking-widest uppercase",
    variants: {
        primary: {
            true: "text-stone-400",
            false: "text-stone-600 dark:text-stone-400",
        },
    },
    defaultVariants: {
        primary: false,
    },
})

const contactArrow = cva({
    base: "size-3 shrink-0 transition-transform duration-150 ease-out-quart group-hover:pointer-fine:-translate-y-0.5 group-hover:pointer-fine:translate-x-0.5",
    variants: {
        primary: {
            true: "text-emerald-400",
            false: "text-emerald-800 dark:text-emerald-400",
        },
    },
    defaultVariants: {
        primary: false,
    },
})

type Channel = {
    label: string
    href: string
    note: string
    action: string
    primary: boolean
} & ({ kind: "email"; address: string } | { kind: "external" })

const CHANNELS: Channel[] = [
    {
        kind: "email",
        label: "Email",
        href: `mailto:${site.email}`,
        note: "Roles, projects, or talking shop",
        address: site.email,
        action: "write",
        primary: true,
    },
    {
        kind: "external",
        label: "GitHub",
        href: site.socials.github,
        note: "Code and open source",
        action: "browse code",
        primary: false,
    },
    {
        kind: "external",
        label: "LinkedIn",
        href: site.socials.linkedin,
        note: "The formal career history",
        action: "career",
        primary: false,
    },
]

function linkAttrs(channel: Channel): { target?: "_blank"; rel?: string } {
    switch (channel.kind) {
        case "email": {
            return {}
        }
        case "external": {
            return { target: "_blank", rel: "me noopener noreferrer" }
        }
        default: {
            const exhaustive: never = channel
            return exhaustive
        }
    }
}

export function ContactChannels() {
    return (
        <DocumentSection aria-labelledby="contact-channels-heading">
            <SectionHeading id="contact-channels-heading">channels</SectionHeading>
            <ul class="grid border border-stone-300 md:grid-cols-3 dark:border-stone-700">
                <For each={CHANNELS}>
                    {(channel) => {
                        const attrs = linkAttrs(channel)
                        return (
                            <li class="border-t border-stone-300 first:border-t-0 md:border-t-0 md:border-l md:first:border-l-0 dark:border-stone-700">
                                <a
                                    href={channel.href}
                                    target={attrs.target}
                                    rel={attrs.rel}
                                    class={contactCell({ primary: channel.primary })}
                                >
                                    <div>
                                        <span class={contactTitle({ primary: channel.primary })}>{channel.label}</span>
                                        <span class={contactNote({ primary: channel.primary })}>{channel.note}</span>
                                        <Show when={channel.kind === "email" ? channel.address : undefined}>
                                            {(shown) => (
                                                <span class="mt-2 block font-mono text-xs wrap-break-word text-stone-400">
                                                    {shown()}
                                                </span>
                                            )}
                                        </Show>
                                    </div>
                                    <span class={contactAction({ primary: channel.primary })}>
                                        {channel.action}
                                        <Show when={channel.kind === "external"}>
                                            <span class="sr-only"> (opens in a new tab)</span>
                                        </Show>
                                        <ArrowUpRightIcon class={contactArrow({ primary: channel.primary })} />
                                    </span>
                                </a>
                            </li>
                        )
                    }}
                </For>
            </ul>
        </DocumentSection>
    )
}
