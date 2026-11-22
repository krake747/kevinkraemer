import { apiVersion } from "@core/site/api-version"
import { problemResponse } from "@core/site/problem"
import { describe, expect, it } from "vite-plus/test"

describe("a problem response", () => {
    it("returns an RFC 9457 problem+json envelope", async () => {
        const response = problemResponse({
            status: 404,
            code: "NOT_FOUND",
            detail: "Missing resource.",
            hint: "Check the URL.",
        })

        expect(response.status).toBe(404)
        expect(response.headers.get("Content-Type")).toBe("application/problem+json")
        expect(response.headers.get("API-Version")).toBe(apiVersion)
        await expect(response.json()).resolves.toEqual({
            type: "https://httpstatuses.com/404",
            title: "Not Found",
            status: 404,
            detail: "Missing resource.",
            code: "NOT_FOUND",
            hint: "Check the URL.",
        })
    })

    it("pins the title by status and lets the caller add transport headers", async () => {
        const response = problemResponse(
            {
                status: 405,
                code: "METHOD_NOT_ALLOWED",
                detail: "Use POST.",
                hint: "Retry with POST.",
            },
            { Allow: "POST, OPTIONS" },
        )

        expect(response.headers.get("Allow")).toBe("POST, OPTIONS")
        await expect(response.json()).resolves.toMatchObject({
            title: "Method Not Allowed",
            status: 405,
            code: "METHOD_NOT_ALLOWED",
        })
    })
})
