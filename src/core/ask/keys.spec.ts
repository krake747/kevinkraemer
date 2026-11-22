import { AskKeysMissing } from "@core/ask/errors"
import { getAskKeys } from "@core/ask/keys"
import { describe, expect, it } from "vite-plus/test"

describe("ask keys", () => {
    it("returns keys when both are set", () => {
        const result = getAskKeys({ TYPESAFE_API_KEY: "ts", OPENAI_API_KEY: "oa" })
        expect(result.match({ ok: (keys) => keys, err: () => null })).toEqual({
            typesafeApiKey: "ts",
            openaiApiKey: "oa",
        })
    })

    it("returns AskKeysMissing when either key is missing or empty", () => {
        for (const env of [
            {},
            { TYPESAFE_API_KEY: "", OPENAI_API_KEY: "oa" },
            { TYPESAFE_API_KEY: "ts" },
            { TYPESAFE_API_KEY: "ts", OPENAI_API_KEY: "" },
        ]) {
            const result = getAskKeys(env)
            expect(result.match({ ok: () => false, err: (error) => AskKeysMissing.is(error) })).toBe(true)
        }
    })
})
