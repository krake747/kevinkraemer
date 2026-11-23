import { TerminalCommandHeader } from "@ui/terminal-command-header"

export function LogHeader() {
    return (
        <div class="mb-12">
            <TerminalCommandHeader command="cd ~/logs" class="mb-4" />
            <h1 class="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">Logs</h1>
            <p class="mt-3 max-w-2xl text-sm/relaxed text-stone-600 dark:text-stone-400">
                What I'm figuring out about building software, written down as I go.
            </p>
        </div>
    )
}
