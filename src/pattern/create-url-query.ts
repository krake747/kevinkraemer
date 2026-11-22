import { createHydrated } from "@pattern/create-browser-value"
import { createDebouncedInput } from "@pattern/create-debounced-input"
import { useSearchParams } from "@solidjs/router"

type UrlParams = Record<string, string | string[] | undefined>

type ClearParams = Record<string, undefined>

type UrlQueryOptions = {
    param: string
    wait: number
}

function paramValue(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
        return value[0] ?? ""
    }
    return value ?? ""
}

export function createUrlQuery({ param, wait }: UrlQueryOptions) {
    const [searchParams, setSearchParams] = useSearchParams<UrlParams>()
    const isHydrated = createHydrated()
    const committed = () => (isHydrated() ? paramValue(searchParams[param]) : "")
    const { input, update, reset } = createDebouncedInput({
        commit: (value) => {
            const next: UrlParams = { [param]: value.length > 0 ? value : undefined }
            setSearchParams(next, { replace: true })
        },
        wait,
        source: committed,
    })
    const clear = (extra: ClearParams = {}) => {
        reset()
        const next: UrlParams = { [param]: undefined, ...extra }
        setSearchParams(next, { replace: true })
    }
    return { input, query: committed, update, clear }
}
