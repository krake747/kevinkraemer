import {
    createContext,
    createEffect,
    createSignal,
    onCleanup,
    useContext,
    type Accessor,
    type ParentProps,
} from "solid-js"

export type SectionLink = {
    label: string
    href: string
}

type SectionNav = {
    links: Accessor<SectionLink[]>
    setLinks: (links: SectionLink[]) => void
}

const SectionNavContext = createContext<SectionNav>({
    links: () => [],
    setLinks: () => {},
})

export function SectionNavProvider(props: ParentProps) {
    const [links, setLinks] = createSignal<SectionLink[]>([], { ownedWrite: true })
    return <SectionNavContext value={{ links, setLinks }}>{props.children}</SectionNavContext>
}

export function useSectionNav(): SectionNav {
    return useContext(SectionNavContext)
}

export function PageSections(props: { links: SectionLink[] }) {
    const { setLinks } = useSectionNav()
    createEffect(
        () => props.links,
        (links) => {
            setLinks(links)
        },
    )
    onCleanup(() => setLinks([]))
    return null
}
