import { Page } from "@/types/Page";
import { client } from "./client";
import { Project } from "@/types/Project";
import {
    allProjectsQuery,
    navQuery,
    pageQuery,
    singleProjectQuery,
} from "./queries";
import { NavProjectItem } from "@/types/Navigation";

export async function getAllProjects(): Promise<Project[]> {
    return client.fetch<Project[]>(allProjectsQuery);
}

export async function getSingleProject(slug: string): Promise<Project | null> {
    return client.fetch<Project | null>(singleProjectQuery, { slug });
}

export async function getPage(slug: string): Promise<Page | null> {
    return client.fetch<Page | null>(pageQuery, { slug });
}

export async function getNavProjects() {
    return client.fetch<NavProjectItem[]>(navQuery);
}
