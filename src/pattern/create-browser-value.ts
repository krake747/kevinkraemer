import { createSignal, onSettled, type Accessor } from "solid-js"

export function createBrowserValue<T>(serverValue: T, read: () => T): Accessor<T> {
    const [settled, setSettled] = createSignal<{ value: T }>()
    onSettled(() => {
        setSettled({ value: read() })
    })
    return () => settled()?.value ?? serverValue
}

export function createHydrated(): Accessor<boolean> {
    return createBrowserValue(false, () => true)
}
