import { createCopyFeedback } from "@pattern/create-copy-feedback"
import type { ComponentProps } from "@solidjs/web"
import { cx } from "@ui/cva.config"
import { Show, createSignal, omit, onSettled } from "solid-js"

export function CodeBlock(props: ComponentProps<"pre">) {
    const rest = omit(props, "class", "children")
    const { copyLabel, copy } = createCopyFeedback()
    const [supported, setSupported] = createSignal(true)
    onSettled(() => {
        setSupported(navigator.clipboard !== undefined && "writeText" in navigator.clipboard)
    })
    let code!: HTMLElement

    const handleCopy = () => {
        const text = code.textContent ?? ""
        void copy(text)
    }

    return (
        <pre
            {...rest}
            data-codeblock
            class={cx(
                "kk-scrollbar relative border border-stone-200 bg-stone-900 p-4 dark:border-stone-800 dark:bg-stone-950",
                props.class,
            )}
        >
            <Show when={supported()}>
                <button
                    type="button"
                    data-copy-code
                    aria-label="Copy code snippet"
                    class="absolute top-2 right-2 min-w-16 border border-stone-700 bg-stone-800 px-2 py-1 text-center font-mono text-xs text-stone-300 transition-[opacity,scale] duration-150 ease-out-quart after:absolute after:-inset-3 after:content-[''] active:scale-97 hover:pointer-fine:text-emerald-300"
                    onClick={handleCopy}
                >
                    <span data-copy-label>
                        <Show when={copyLabel() !== "copy"} fallback={copyLabel()}>
                            <span class="animate-confirm-in">{copyLabel()}</span>
                        </Show>
                    </span>
                </button>
            </Show>
            <code ref={code} class="block pr-20 font-mono text-sm break-all whitespace-pre-wrap text-stone-200">
                {props.children}
            </code>
        </pre>
    )
}
