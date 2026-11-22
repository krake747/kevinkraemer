import { endpoints, type Endpoint } from "@core/site/endpoints"

export type CatalogEntry = Pick<Endpoint, "path"> & NonNullable<Endpoint["catalog"]>

export const catalogEntries: CatalogEntry[] = endpoints.flatMap((endpoint) => {
    if (endpoint.catalog === undefined) {
        return []
    }
    return [{ path: endpoint.path, ...endpoint.catalog }]
})
