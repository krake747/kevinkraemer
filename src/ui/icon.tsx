import type { ComponentProps } from "@solidjs/web"
import { omit, type VoidProps } from "solid-js"
import KeylineArrowLeft from "~icons/keyline-icons/arrow-left"
import KeylineArrowRight from "~icons/keyline-icons/arrow-right"
import KeylineArrowUpRight from "~icons/keyline-icons/arrow-up-right"
import KeylineBolt from "~icons/keyline-icons/bolt"
import KeylineBriefcaseBusiness from "~icons/keyline-icons/briefcase"
import KeylineChevronLeft from "~icons/keyline-icons/chevron-left"
import KeylineChevronRight from "~icons/keyline-icons/chevron-right"
import KeylineClock from "~icons/keyline-icons/clock"
import KeylineCodeXml from "~icons/keyline-icons/code-xml"
import KeylineDownload from "~icons/keyline-icons/download"
import KeylineFileText from "~icons/keyline-icons/file-text"
import KeylineHash from "~icons/keyline-icons/hash"
import KeylineMail from "~icons/keyline-icons/mail"
import KeylineMessageCircle from "~icons/keyline-icons/message-duotone"
import KeylineMoon from "~icons/keyline-icons/moon"
import KeylineRss from "~icons/keyline-icons/rss"
import KeylineSearch from "~icons/keyline-icons/search"
import KeylineSun from "~icons/keyline-icons/sun"

type IconProps = VoidProps<ComponentProps<"svg">>

export function ChevronRightIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineChevronRight {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function HashIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineHash {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ArrowRightIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineArrowRight {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ArrowLeftIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineArrowLeft {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ChevronLeftIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineChevronLeft {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ClockIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineClock {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function FileTextIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineFileText {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function ArrowUpRightIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineArrowUpRight {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function RssIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineRss {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function SearchIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineSearch {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function MoonIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineMoon {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function SunIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineSun {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function BoltIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineBolt {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function MailIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineMail {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function DownloadIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineDownload {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function CodeXmlIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineCodeXml {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function BriefcaseBusinessIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineBriefcaseBusiness {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}

export function MessageCircleIcon(props: IconProps) {
    const rest = omit(props, "children", "aria-hidden")
    return <KeylineMessageCircle {...rest} aria-hidden={props["aria-hidden"] ?? "true"} />
}
