import { siteContent } from "@core/content/site-content"
import { colorScheme } from "@core/theme"
import { Footer } from "@features/footer/footer"
import { Header } from "@features/header/header"
import { registerWebMcpTools } from "@features/webmcp/register"
import { createRouter, intentPreload, useNavigate } from "@solidjs/router"
import { fileRoutes } from "@solidjs/router/fs"
import { isServer } from "@solidjs/web"
import { Preferences } from "@ui-sdk/solid/preferences"
import { onCleanup, onHydrationEnd, type ParentProps } from "solid-js"
import { pageRoutes } from "virtual:file-routes"

import "./app.css"

const Router = createRouter({ routes: fileRoutes(pageRoutes), preloadLinks: intentPreload() })

function Layout(props: ParentProps) {
    const navigate = useNavigate()
    const webMcp = new AbortController()

    onCleanup(() => webMcp.abort())
    onHydrationEnd(() => {
        if (isServer) {
            return
        }
        registerWebMcpTools(siteContent.logs, navigate, webMcp.signal)
    })

    return (
        <>
            <Header />
            <main id="main" data-pagefind-body class="flex flex-1 flex-col pb-10">
                {props.children}
            </main>
            <Footer />
        </>
    )
}

export default function App() {
    onHydrationEnd(() => {
        if (isServer) {
            return
        }
        document.documentElement.dataset.hydrated = ""
    })

    return (
        <Preferences preferences={[colorScheme]}>
            <Router>{(props) => <Layout>{props.children}</Layout>}</Router>
        </Preferences>
    )
}
