import { askInputSchema } from "@features/mcp/ask-schema"
import { describe, expect, it } from "vite-plus/test"

describe("the ask tool input", () => {
    it("publishes the shared question bounds", () => {
        const schema = askInputSchema["~standard"].jsonSchema.input({ target: "draft-2020-12" })

        expect(schema).toMatchObject({
            type: "object",
            properties: {
                question: { type: "string", minLength: 1, maxLength: 500, pattern: "\\S" },
                summarize: { type: "boolean" },
            },
            required: ["question"],
        })
    })
})
