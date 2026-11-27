import type { ComponentProps } from "@solidjs/web"
import { omit, type VoidProps } from "solid-js"

type IconProps = VoidProps<ComponentProps<"svg">>

export function ChevronRightIcon(props: IconProps) {
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
            <path d="M9 6L15 12L9 18" />
        </svg>
    )
}

export function HashIcon(props: IconProps) {
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
            <path d="M3 8.5L21 8.5M3 15.5L21 15.5M7.5 21L9.5 3M14.5 21L16.5 3" />
        </svg>
    )
}

export function ArrowRightIcon(props: IconProps) {
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
            <path d="M5 12H18.0587M12.1229 5L18.8261 11.5875C19.058 11.8153 19.058 12.1847 18.8261 12.4125L12.1229 19" />
        </svg>
    )
}

export function ArrowLeftIcon(props: IconProps) {
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
            <path d="M19 12H5.94129M11.8771 5L5.17385 11.5875C4.94205 11.8153 4.94205 12.1847 5.17385 12.4125L11.8771 19" />
        </svg>
    )
}

export function ChevronLeftIcon(props: IconProps) {
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
            <path d="M15 6L9 12L15 18" />
        </svg>
    )
}

export function ClockIcon(props: IconProps) {
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
            <path d="M12 6L12 12L17 12M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" />
        </svg>
    )
}

export function FileTextIcon(props: IconProps) {
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
            <path d="M14 2H8C5.79086 2 4 3.79086 4 6V18C4 20.2091 5.79086 22 8 22H16C18.2091 22 20 20.2091 20 18V8L14 2ZM14 2V5C14 6.65685 15.3431 8 17 8H20M8 13H12M8 17H16" />
        </svg>
    )
}

export function ArrowUpRightIcon(props: IconProps) {
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
            <path d="M6 6H17.5C17.77614 6 18 6.22386 18 6.5V18M7.2 16.8L17.4 6.6" />
        </svg>
    )
}

export function RssIcon(props: IconProps) {
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
            <path
                d="M3 3C12.9411 3 21 11.0589 21 21M3 9C9.6274 9 15 14.3726 15 21M3 15C6.3137 15 9 17.6863 9 21"
                fill="none"
            />
            <path
                d="M5 20.5C5 21.3284 4.3284 22 3.5 22C2.6716 22 2 21.3284 2 20.5C2 19.6716 2.6716 19 3.5 19C4.3284 19 5 19.6716 5 20.5Z"
                fill="currentColor"
                stroke="none"
            />
        </svg>
    )
}

export function SearchIcon(props: IconProps) {
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
            <path d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10ZM15 15L21 21" />
        </svg>
    )
}

export function MoonIcon(props: IconProps) {
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
            <path
                d="M22 12C22 17.5228 17.5228 22 12 22C6.4772 22 2 17.5228 2 12C2 6.4772 6.4772 2 12 2C12.3844 2 12.7348 2.2203 12.9013 2.5668C13.0678 2.9133 13.021 3.3245 12.7809 3.6247C11.061 5.7746 11.2326 8.8738 13.1794 10.8206C15.1262 12.7674 18.2254 12.939 20.3753 11.2191C20.6755 10.979 21.0867 10.9322 21.4332 11.0987C21.7797 11.2652 22 11.6156 22 12Z"
                fill="currentColor"
                fill-opacity="0.4"
                stroke="none"
            />
            <path
                d="M21 12C21 16.9706 16.9706 21 12 21C7.0294 21 3 16.9706 3 12C3 7.0294 7.0294 3 12 3C9.9618 5.5477 10.1652 9.2206 12.4723 11.5277C14.7794 13.8348 18.4523 14.0382 21 12Z"
                fill="none"
            />
        </svg>
    )
}

export function SunIcon(props: IconProps) {
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
            <path
                d="M17.5 12C17.5 15.0377 15.0377 17.5 12 17.5C8.9624 17.5 6.5 15.0377 6.5 12C6.5 8.9624 8.9624 6.5 12 6.5C15.0377 6.5 17.5 8.9624 17.5 12Z"
                fill="currentColor"
                fill-opacity="0.4"
                stroke="none"
            />
            <path
                d="M16.5 12C16.5 14.4854 14.4854 16.5 12 16.5C9.5147 16.5 7.5 14.4854 7.5 12C7.5 9.5147 9.5147 7.5 12 7.5C14.4854 7.5 16.5 9.5147 16.5 12ZM20.5 12L22 12M18.0104 18.0104L19.0711 19.0711M12 20.5L12 22M5.9896 18.0104L4.9289 19.0711M3.5 12L2 12M5.9896 5.9896L4.9289 4.9289M12 3.5L12 2M18.0104 5.9896L19.0711 4.9289"
                fill="none"
            />
        </svg>
    )
}

export function SunMoonIcon(props: IconProps) {
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
            <path d="M9 8C5.134 8 2 11.134 2 15C2 18.866 5.134 22 9 22C12.866 22 16 18.866 16 15C15.1345 15.6491 14.0819 16 13 16C10.2386 16 8 13.7614 8 11C8 9.9181 8.3509 8.8655 9 8ZM13 4.5V2M17.5962 6.4038L19.364 4.636M19.5 11H22" />
        </svg>
    )
}

export function ZapIcon(props: IconProps) {
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
            <path
                d="M12.2476 2.4507L2.4307 12.4491C2.1553 12.7296 2.001 13.1069 2.001 13.5C2.001 14.3284 2.6726 15 3.501 15L9.8656 15L9.194 20.3102C9.1861 20.3726 9.1821 20.4355 9.1821 20.4984C9.1821 21.3268 9.8537 21.9984 10.6821 21.9984C11.0847 21.9984 11.4704 21.8366 11.7524 21.5493L21.5693 11.5509C21.8447 11.2704 21.999 10.8931 21.999 10.5C21.999 9.6716 21.3274 9 20.499 9L14.1344 9L14.806 3.6898C14.8139 3.6274 14.8179 3.5645 14.8179 3.5016C14.8179 2.6732 14.1463 2.0016 13.3179 2.0016C12.9153 2.0016 12.5296 2.1634 12.2476 2.4507Z"
                fill="currentColor"
                fill-opacity="0.4"
                stroke="none"
            />
            <path
                d="M12.9611 3.1513L3.1443 13.1497C3.0525 13.2432 3.001 13.369 3.001 13.5C3.001 13.7761 3.2249 14 3.501 14L9.8656 14C10.4178 14 10.8656 14.4477 10.8656 15C10.8656 15.0419 10.8629 15.0839 10.8577 15.1255L10.1861 20.4357C10.1834 20.4565 10.1821 20.4774 10.1821 20.4984C10.1821 20.7745 10.406 20.9984 10.6821 20.9984C10.8163 20.9984 10.9449 20.9445 11.0389 20.8487L20.8557 10.8503C20.9475 10.7568 20.999 10.631 20.999 10.5C20.999 10.2239 20.7751 10 20.499 10L14.1344 10C13.5822 10 13.1344 9.5523 13.1344 9C13.1344 8.9581 13.1371 8.9161 13.1423 8.8745L13.8139 3.5643C13.8166 3.5435 13.8179 3.5226 13.8179 3.5016C13.8179 3.2255 13.594 3.0016 13.3179 3.0016C13.1837 3.0016 13.0551 3.0555 12.9611 3.1513Z"
                fill="none"
            />
        </svg>
    )
}

export function MailIcon(props: IconProps) {
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
            <path d="M5 4H19C20.6569 4 22 5.34315 22 7V17C22 18.6569 20.6569 20 19 20H5C3.34315 20 2 18.6569 2 17V7C2 5.34315 3.34315 4 5 4ZM2 7L11.2929 11C11.7154 11.2817 12.2846 11.2817 12.7071 11L22 7" />
        </svg>
    )
}

export function DownloadIcon(props: IconProps) {
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
            <path d="M12 3V14M8 10L12 14L16 10M4 18V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V18" />
        </svg>
    )
}

export function CodeXmlIcon(props: IconProps) {
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
            <path d="M6 7L2 12L6 17M18 7L22 12L18 17M10 19L14 5" />
        </svg>
    )
}

export function BriefcaseBusinessIcon(props: IconProps) {
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
            <path d="M8.25 6.5V6C8.25 4.3431 9.5931 3 11.25 3H12.75C14.4069 3 15.75 4.3431 15.75 6V6.5M2 10.5C6 12.75 18 12.75 22 10.5M9.5 12.1132V13.5C9.5 14.6046 10.3954 15.5 11.5 15.5H12.5C13.6046 15.5 14.5 14.6046 14.5 13.5V12.1132M5 6.5H19C20.6569 6.5 22 7.8431 22 9.5V18C22 19.6569 20.6569 21 19 21H5C3.3431 21 2 19.6569 2 18V9.5C2 7.8431 3.3431 6.5 5 6.5Z" />
        </svg>
    )
}

export function MessageCircleIcon(props: IconProps) {
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
            <path
                d="M4.5686 16.353 C2.915 14.8839 2 12.9769 2 11 C2 6.5817 6.4772 3 12 3 C17.5228 3 22 6.5817 22 11 C22 15.4183 17.5228 19 12 19 C11.1845 19 10.3721 18.9202 9.5808 18.7624 L5 21 L4.5686 16.353 Z"
                fill="none"
            />
        </svg>
    )
}

export function XIcon(props: IconProps) {
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
            <path d="M7 7L17 17M17 7L7 17" />
        </svg>
    )
}
