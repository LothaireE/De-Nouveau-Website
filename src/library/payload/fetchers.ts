import type { NavProjectItem } from "@/types/Navigation";
import { getPayloadClient } from "./client";
import { Project, Page } from "@/payload-types";
import { cache } from "react";

export type SitemapProject = Pick<Project, "slug" | "updatedAt">;

export async function getAllProjects(): Promise<Project[]> {
    try {
        const payload = await getPayloadClient();

        const result = await payload.find({
            collection: "projects",
            where: {
                and: [
                    {
                        _status: {
                            equals: "published",
                        },
                    },
                    {
                        visibility: {
                            equals: "show",
                        },
                    },
                ],
            },
            depth: 2,
            sort: "order",
            limit: 100,
        });

        return result.docs as Project[];
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}

export async function getSitemapProjects(): Promise<SitemapProject[]> {
    try {
        const payload = await getPayloadClient();

        const result = await payload.find({
            collection: "projects",
            where: {
                and: [
                    {
                        _status: {
                            equals: "published",
                        },
                    },
                    {
                        visibility: {
                            equals: "show",
                        },
                    },
                ],
            },
            select: {
                slug: true,
                updatedAt: true,
            },
            depth: 0,
            limit: 1000,
        });

        return result.docs as SitemapProject[];
    } catch (error) {
        console.error("Error fetching sitemap projects:", error);
        return [];
    }
}

export const getSingleProject = cache(async function getSingleProject(
    slug: string,
): Promise<Project | null> {
    try {
        const payload = await getPayloadClient();

        const result = await payload.find({
            collection: "projects",
            depth: 2,
            where: {
                and: [
                    {
                        slug: {
                            equals: slug,
                        },
                    },
                    {
                        _status: {
                            equals: "published",
                        },
                    },
                    {
                        visibility: {
                            equals: "show",
                        },
                    },
                ],
            },
            limit: 1,
        });

        return (result.docs[0] as Project) || null;
    } catch (error) {
        console.error(`Error fetching project with slug "${slug}":`, error);
        return null;
    }
});

export const getPage = cache(async function getPage(
    slug: string,
): Promise<Page | null> {
    try {
        const payload = await getPayloadClient();

        const result = await payload.find({
            collection: "pages",
            depth: 2,
            where: {
                slug: {
                    equals: slug,
                },
            },
            limit: 1,
        });

        return (result.docs[0] as Page) || null;
    } catch (error) {
        console.error(`Error fetching page with slug "${slug}":`, error);
        return null;
    }
});

export async function getNavProjects(): Promise<NavProjectItem[]> {
    try {
        const payload = await getPayloadClient();

        const result = await payload.find({
            collection: "projects",
            where: {
                and: [
                    {
                        _status: {
                            equals: "published",
                        },
                    },
                    {
                        visibility: {
                            equals: "show",
                        },
                    },
                ],
            },
            sort: "order",
            limit: 100,
            depth: 1,
        });

        return result.docs.map((project) => ({
            _id: String(project.id),
            _createdAt: project.createdAt,
            title: project.title,
            slug: project.slug,
        })) as NavProjectItem[];
    } catch (error) {
        console.error("Error fetching navigation projects:", error);
        return [];
    }
}
