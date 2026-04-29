import { Page } from "@/types/Page";
import { client } from "./client";
import { Project } from "@/types/Project";
import { allProjectsQuery, pageQuery, singleProjectQuery } from "./queries";



export async function getAllProjects(): Promise<Project[]> {
    return client.fetch<Project[]>(allProjectsQuery)
}

export async function getSingleProject(slug: string): Promise<Project| null> {
    return client.fetch<Project | null>(singleProjectQuery,{ slug })
}


export async function getPage(slug: string): Promise<Page | null> {
  return client.fetch<Page | null>(pageQuery, {slug})
}
