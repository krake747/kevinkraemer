import type { CatalogEntry } from "@core/site/catalog"
import * as v from "valibot"

export const TAPE_VERSION = 1

export const TapePrintSchema = v.object({
    path: v.string(),
    title: v.string(),
    description: v.string(),
    content: v.string(),
})

export const TapeFileSchema = v.object({
    version: v.number(),
    sourceHash: v.string(),
    prints: v.array(TapePrintSchema),
})

export type TapePrint = v.InferOutput<typeof TapePrintSchema>

export type TapeFile = v.InferOutput<typeof TapeFileSchema>

export function buildTape(contentFor: (path: string) => string): (entries: CatalogEntry[]) => TapePrint[] {
    return (entries) => {
        return entries.map(({ path, title, description }) => {
            const content = contentFor(path)
            return { path, title, description, content: content === "" ? description : content }
        })
    }
}
