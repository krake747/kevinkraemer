import { ContactChannels } from "@features/contact/channels"
import { ContactStatus } from "@features/contact/status"
import type { JSX } from "@solidjs/web"

export function ContactLayout(props: { children?: JSX.Element }) {
    return (
        <div class="flex flex-col gap-10">
            <ContactChannels />

            <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem]">
                <div class="flex min-w-0 flex-col gap-10">
                    <ContactStatus as="details" />
                    {props.children}
                </div>

                <aside class="hidden lg:block">
                    <ContactStatus as="aside" />
                </aside>
            </div>
        </div>
    )
}
