import { getNavProjects } from "@/library/payload/fetchers";
import { MetadataRoute } from "next";

/*
from Next.js documentation:
sitemap.(xml|js|ts) is a special file that matches the Sitemaps XML format to help search engine crawlers index your site more efficiently.
You can use the sitemap.(js|ts) file convention to programmatically generate a sitemap by exporting a default function that returns an array of URLs. If using TypeScript, a Sitemap type is available.
*/

const siteUrl = "https://www.de-nouveau.fr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const projects = await getNavProjects();

    const projectUrls = projects.map((project) => ({
        url: `${siteUrl}/${project.slug}`,
        lastModified: new Date(project._updatedAt),
        alternates: {
            languages: {
                fr: `${siteUrl}/${project.slug}`,
                // en: `${siteUrl}/en/${project.slug}`,
            },
        },
    }));

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            alternates: {
                languages: {
                    fr: siteUrl,
                    // en: `${siteUrl}/en`, --- IGNORE FOR AS LONG AS WE DON'T HAVE AN ENGLISH VERSION ---
                },
            },
        },
        {
            url: `${siteUrl}/about`,
            lastModified: new Date(),
            alternates: {
                languages: {
                    fr: `${siteUrl}/about`,
                    // en: `${siteUrl}/en/about`,
                },
            },
        },
        {
            url: `${siteUrl}/contact`,
            lastModified: new Date(),
            alternates: {
                languages: {
                    fr: `${siteUrl}/contact`,
                    // en: `${siteUrl}/en/contact`,
                },
            },
        },
        ...projectUrls,
    ];
}
