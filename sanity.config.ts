import 'dotenv/config'
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure"
import schemas from '@/sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "cs6fu4mw";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "development";
// const apiVersion = process.env.NEXT_PUBLIC_API_VERSION || "2026-04-28";


if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

if (!dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET");
}

const sanityConfig = defineConfig({
    projectId,
    dataset,
    title: "De Nouveau",
    apiVersion: "2026-04-28",
    basePath: "/admin",
    plugins: [structureTool()],
    schema: { types: schemas }
})

export default sanityConfig