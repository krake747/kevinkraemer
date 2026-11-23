import { makeBlogSchema, makeBreadcrumbListSchema, makePersonSchema, toJsonLd, type JsonLd } from "@core/site/jsonld"
import { buildTitle, seoDefaults, type ContentType } from "@core/site/seo"
import { site } from "@core/site/site-meta"
import { canonicalFor, origin } from "@core/site/urls"
import { Head, Link, Meta, Script, Title } from "@solidjs/meta"
import type { JSX } from "@solidjs/web"
import { For, Show } from "solid-js"

type SeoLocation = { path: string; canonical?: undefined } | { path?: undefined; canonical?: string }

type SeoBase = {
    title?: string
    description?: string
    image?: string
    robots?: "index" | "noindex"
    markdown?: string
    extraMeta?: JSX.MetaHTMLAttributes<HTMLMetaElement>[]
    extraSchemas?: JsonLd[]
    breadcrumbs?: { name: string; url?: string }[]
    identity?: boolean
} & SeoLocation

type SeoArticle = {
    type: "article"
    publishedTime: string
    modifiedTime?: string
    author?: string
    tags?: string[]
}

type SeoProps = SeoBase & ({ type?: Exclude<ContentType, "article"> } | SeoArticle)

export function Seo(props: SeoProps) {
    const fullTitle = () => buildTitle(props.title ?? seoDefaults.title)
    const description = () => props.description ?? seoDefaults.description
    const identity = () => props.identity ?? true
    const url = () => props.canonical ?? (props.path === undefined ? site.url : canonicalFor(props.path))
    const located = () => props.path !== undefined || props.canonical !== undefined
    const image = () => props.image ?? seoDefaults.image
    const type = () => props.type ?? seoDefaults.type
    const article = (): Extract<SeoProps, { type: "article" }> | undefined =>
        props.type === "article" ? props : undefined

    return (
        <Head>
            <Title>{fullTitle()}</Title>
            <Link rel="alternate" type="application/rss+xml" title={`${site.name} · Logs`} href={`${origin}/rss.xml`} />
            <Meta name="description" content={description()} />
            <Show when={located()}>
                <Link rel="canonical" href={url()} />
            </Show>
            <Show when={props.markdown}>
                {(markdown) => <Link rel="alternate" type="text/markdown" href={canonicalFor(markdown())} />}
            </Show>
            <Meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)" />
            <Meta name="theme-color" content="#0c0a09" media="(prefers-color-scheme: dark)" />
            <Meta property="og:title" content={fullTitle()} />
            <Meta property="og:description" content={description()} />
            <Meta property="og:type" content={type()} />
            <Show when={identity()}>
                <Meta property="og:url" content={url()} />
            </Show>
            <Meta property="og:site_name" content={site.name} />
            <Meta property="og:image" content={image()} />
            <Meta property="og:image:width" content={String(site.imageDimensions.width)} />
            <Meta property="og:image:height" content={String(site.imageDimensions.height)} />
            <Show when={article()}>
                {(post) => (
                    <>
                        <Meta property="article:published_time" content={post().publishedTime} />
                        <Show when={post().modifiedTime}>
                            {(modified) => <Meta property="article:modified_time" content={modified()} />}
                        </Show>
                        <Meta property="article:author" content={post().author ?? seoDefaults.author} />
                        <Meta property="article:section" content="Technology" />
                        <For each={post().tags ?? []}>{(tag) => <Meta property="article:tag" content={tag} />}</For>
                    </>
                )}
            </Show>
            <Meta name="twitter:card" content="summary_large_image" />
            <Meta name="twitter:site" content={site.twitter.site} />
            <Meta name="twitter:creator" content={site.twitter.handle} />
            <Meta name="twitter:image" content={image()} />
            <Show when={identity()}>
                <Script type="application/ld+json">{JSON.stringify(toJsonLd(makePersonSchema(url())))}</Script>
            </Show>
            <For each={props.extraSchemas}>
                {(schema) => <Script type="application/ld+json">{JSON.stringify(toJsonLd(schema))}</Script>}
            </For>
            <Show when={props.breadcrumbs}>
                {(breadcrumbs) => (
                    <Script type="application/ld+json">
                        {JSON.stringify(toJsonLd(makeBreadcrumbListSchema(breadcrumbs())))}
                    </Script>
                )}
            </Show>
            <Show when={article()}>
                {(post) => (
                    <Script type="application/ld+json">
                        {JSON.stringify(
                            toJsonLd(
                                makeBlogSchema({
                                    headline: fullTitle(),
                                    description: description(),
                                    image: image(),
                                    pageUrl: url(),
                                    published: post().publishedTime,
                                    modified: post().modifiedTime,
                                    author: post().author ?? seoDefaults.author,
                                    tags: post().tags,
                                }),
                            ),
                        )}
                    </Script>
                )}
            </Show>
            <Show when={props.robots === "noindex"}>
                <Meta name="robots" content="noindex, nofollow" />
            </Show>
            <For each={props.extraMeta}>{(meta) => <Meta {...meta} />}</For>
        </Head>
    )
}
