import type { SearchHit } from "@core/search/pagefind"
import { RegisterRow } from "@pattern/register"
import type { VoidProps } from "solid-js"

export function SearchHitRow(props: VoidProps<{ hit: SearchHit }>) {
    return (
        <RegisterRow
            as="li"
            href={props.hit.href}
            title={props.hit.title}
            description={props.hit.excerpt}
            lines={2}
            meta={<span>{props.hit.href}</span>}
        />
    )
}
