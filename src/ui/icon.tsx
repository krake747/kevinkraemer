import type { ComponentProps } from "@solidjs/web"
import { omit } from "solid-js"

type IconProps = ComponentProps<"svg">

function Svg(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...rest}
            aria-hidden={props["aria-hidden"] ?? "true"}
        >
            {props.children}
        </svg>
    )
}

export function ChevronRight(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="m9 18 6-6-6-6" />
        </Svg>
    )
}

export function Hash(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M4 9h16" />
            <path d="M4 15h16" />
            <path d="m10 3-2 18" />
            <path d="m16 3-2 18" />
        </Svg>
    )
}

export function ArrowRight(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </Svg>
    )
}

export function ArrowLeft(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </Svg>
    )
}

export function ChevronLeft(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="m15 18-6-6 6-6" />
        </Svg>
    )
}

export function Clock(props: IconProps) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </Svg>
    )
}

export function FileText(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
        </Svg>
    )
}

export function ArrowUpRight(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </Svg>
    )
}

export function Rss(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
        </Svg>
    )
}

export function Search(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
        </Svg>
    )
}

export function Moon(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </Svg>
    )
}

export function Sun(props: IconProps) {
    return (
        <Svg {...props}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </Svg>
    )
}

export function Bolt(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </Svg>
    )
}

export function Mail(props: IconProps) {
    return (
        <Svg {...props}>
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </Svg>
    )
}

export function Download(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="3" y2="15" />
        </Svg>
    )
}

export function CodeXml(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
        </Svg>
    )
}

export function BriefcaseBusiness(props: IconProps) {
    return (
        <Svg {...props}>
            <path d="M12 12h.01" />
            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <path d="M22 13a18.15 18.15 0 0 1-20 0" />
            <rect width="20" height="14" x="2" y="6" rx="2" />
        </Svg>
    )
}
