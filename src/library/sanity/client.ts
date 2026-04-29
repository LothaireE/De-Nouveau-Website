import { createClient } from "next-sanity"

export const client = createClient({
        projectId: "cs6fu4mw",
        dataset: "development",
        apiVersion: "2026-04-28",
        useCdn: process.env.NODE_ENV === "production"
    })
