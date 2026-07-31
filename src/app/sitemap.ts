import type { MetadataRoute } from "next";
import { getSitemapProjects } from "@/library/payload/fetchers";
import { SITE_URL } from "@/library/seo";

const staticRoutes: MetadataRoute.Sitemap = [
    {
        url: SITE_URL,
        changeFrequency: "weekly",
        priority: 1,
    },
    {
        url: `${SITE_URL}/about`,
        changeFrequency: "monthly",
        priority: 0.7,
    },
    {
        url: `${SITE_URL}/contact`,
        changeFrequency: "yearly",
        priority: 0.5,
    },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getSitemapProjects();
    const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
        url: new URL(`/${project.slug}`, SITE_URL).toString(),
        lastModified: project.updatedAt,
        changeFrequency: "monthly",
        priority: 0.8,
    }));

    return [...staticRoutes, ...projectRoutes];
}
