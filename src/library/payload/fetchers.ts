import type { NavProjectItem } from "@/types/Navigation";
import { getPayloadClient } from "./client";
import { Project, Page } from "@/payload-types";

export async function getAllProjects(): Promise<Project[]> {
    const payload = await getPayloadClient();

    const result = await payload.find({
        collection: "projects",
        depth: 2,
        sort: "order",
        limit: 100,
    });

    return result.docs as Project[];
}

export async function getSingleProject(slug: string): Promise<Project | null> {
    const payload = await getPayloadClient();

    const result = await payload.find({
        collection: "projects",
        depth: 2,
        where: {
            slug: {
                equals: slug,
            },
        },
        limit: 1,
    });

    return (result.docs[0] as Project) || null;
}

export async function getPage(slug: string): Promise<Page | null> {
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
}

export async function getNavProjects(): Promise<NavProjectItem[]> {
    const payload = await getPayloadClient();

    const result = await payload.find({
        collection: "projects",
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
}
