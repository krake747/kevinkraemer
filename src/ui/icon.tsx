import type { ComponentProps } from "@solidjs/web"
import { omit } from "solid-js"
import KeylineArrowLeft from "~icons/keyline-icons/arrow-left-duotone"
import KeylineArrowRight from "~icons/keyline-icons/arrow-right-duotone"
import KeylineArrowUpRight from "~icons/keyline-icons/arrow-up-right-duotone"
import KeylineBolt from "~icons/keyline-icons/bolt-duotone"
import KeylineBriefcaseBusiness from "~icons/keyline-icons/briefcase-duotone"
import KeylineChevronLeft from "~icons/keyline-icons/chevron-left-duotone"
import KeylineChevronRight from "~icons/keyline-icons/chevron-right-duotone"
import KeylineClock from "~icons/keyline-icons/clock-duotone"
import KeylineCodeXml from "~icons/keyline-icons/code-xml-duotone"
import KeylineDownload from "~icons/keyline-icons/download-duotone"
import KeylineFileText from "~icons/keyline-icons/file-text-duotone"
import KeylineHash from "~icons/keyline-icons/hash-duotone"
import KeylineMail from "~icons/keyline-icons/mail-duotone"
import KeylineMessageCircle from "~icons/keyline-icons/message-duotone"
import KeylineMoon from "~icons/keyline-icons/moon-duotone"
import KeylineRss from "~icons/keyline-icons/rss-duotone"
import KeylineSearch from "~icons/keyline-icons/search-duotone"
import KeylineSun from "~icons/keyline-icons/sun-duotone"

type IconProps = ComponentProps<"svg">

export function ChevronRight(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineChevronRight {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Hash(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineHash {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ArrowRight(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineArrowRight {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ArrowLeft(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineArrowLeft {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ChevronLeft(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineChevronLeft {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Clock(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineClock {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function FileText(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineFileText {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ArrowUpRight(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineArrowUpRight {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Rss(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineRss {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Search(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineSearch {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Moon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineMoon {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Sun(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineSun {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Bolt(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineBolt {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Mail(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineMail {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function Download(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineDownload {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function CodeXml(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineCodeXml {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function BriefcaseBusiness(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineBriefcaseBusiness {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function MessageCircle(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineMessageCircle {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}
