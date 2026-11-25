import { makeBlogSchema, makeBreadcrumbListSchema, makePersonSchema, toJsonLd } from "@core/site/jsonld"
import { buildTitle, seoDefaults } from "@core/site/seo"
import { site } from "@core/site/site-meta"
import { canonicalFor, origin } from "@core/site/urls"
import { Head, Link, Meta, Script, Title } from "@solidjs/meta"
import { For, Show, merge, type VoidProps } from "solid-js"

type SeoBase = {
    title: string
    description: string
}

type SeoPage = SeoBase & {
    type?: undefined
    path?: string
}

type SeoArticle = SeoBase & {
    type: "article"
    path: string
    publishedTime: string
    tags: string[]
}

type SeoProps = SeoPage | SeoArticle

type Crumb = { name: string; url: string } | { name: string }

export function BreadcrumbSchema(props: VoidProps<{ items: Crumb[] }>) {
    return <Script type="application/ld+json">{JSON.stringify(toJsonLd(makeBreadcrumbListSchema(props.items)))}</Script>
}

export function Seo(_props: VoidProps<SeoProps>) {
    const props = merge({ type: "website" } as const, _props)
    const fullTitle = () => buildTitle(props.title)
    const description = () => props.description
    const article = (): Extract<SeoProps, { type: "article" }> | undefined =>
        props.type === "article" ? props : undefined

    return (
        <Head>
            <Title>{fullTitle()}</Title>
            <Link rel="alternate" type="application/rss+xml" title={`${site.name} · Logs`} href={`${origin}/rss.xml`} />
            <Meta name="description" content={description()} />
            <Meta name="theme-color" content="#fafaf9" media="(prefers-color-scheme: light)" />
            <Meta name="theme-color" content="#0c0a09" media="(prefers-color-scheme: dark)" />
            <Meta property="og:title" content={fullTitle()} />
            <Meta property="og:description" content={description()} />
            <Meta property="og:type" content={props.type} />
            <Meta property="og:site_name" content={site.name} />
            <Meta property="og:image" content={seoDefaults.image} />
            <Meta property="og:image:width" content={String(site.imageDimensions.width)} />
            <Meta property="og:image:height" content={String(site.imageDimensions.height)} />
            <Meta name="twitter:card" content="summary_large_image" />
            <Meta name="twitter:site" content={site.twitter.site} />
            <Meta name="twitter:creator" content={site.twitter.handle} />
            <Meta name="twitter:image" content={seoDefaults.image} />
            <Show when={props.path}>
                {(path) => (
                    <>
                        <Link rel="canonical" href={canonicalFor(path())} />
                        <Meta property="og:url" content={canonicalFor(path())} />
                        <Script type="application/ld+json">
                            {JSON.stringify(toJsonLd(makePersonSchema(canonicalFor(path()))))}
                        </Script>
                    </>
                )}
            </Show>
            <Show when={article()}>
                {(post) => (
                    <>
                        <Link rel="alternate" type="text/markdown" href={canonicalFor(`${post().path}.md`)} />
                        <Meta property="article:published_time" content={post().publishedTime} />
                        <Meta property="article:author" content={seoDefaults.author} />
                        <Meta property="article:section" content="Technology" />
                        <For each={post().tags}>{(tag) => <Meta property="article:tag" content={tag} />}</For>
                        <Meta data-pagefind-filter="type:article" />
                        <For each={post().tags}>{(tag) => <Meta data-pagefind-filter={`tag:${tag}`} />}</For>
                        <Script type="application/ld+json">
                            {JSON.stringify(
                                toJsonLd(
                                    makeBlogSchema({
                                        headline: fullTitle(),
                                        description: description(),
                                        image: seoDefaults.image,
                                        pageUrl: canonicalFor(post().path),
                                        published: post().publishedTime,
                                        author: seoDefaults.author,
                                        tags: post().tags,
                                    }),
                                ),
                            )}
                        </Script>
                    </>
                )}
            </Show>
        </Head>
    )
}
