import LoadingLogo from "@/components/LoadingLogo";
import ProjectGrid from "@/components/home/ProjectGrid";
import {
    getAllProjects,
    getFeaturedProjects,
    getPage,
} from "@/lib/payload/fetchers";
import { getPageMetadata } from "@/lib/payload/metadata";
import type { Page } from "@/payload-types";
import dynamic from "next/dynamic";

const HomeHero = dynamic<{ content: Page | null }>(
    () => import("@/components/home/HomeHero"),
    {
        loading: () => <LoadingLogo />,
    },
);

export async function generateMetadata() {
    return getPageMetadata(SLUG);
}

const SLUG = "home";

export default async function Home() {
    const pageContent = await getPage(SLUG);
    const [featuredProjects, projects] = await Promise.all([
        getFeaturedProjects(pageContent?.featuredProjects),
        getAllProjects(),
    ]);

    // The grid lists every project, featured ones first, in their chosen order.
    const featuredIds = new Set(featuredProjects.map((project) => project.id));
    const gridProjects = [
        ...featuredProjects,
        ...projects.filter((project) => !featuredIds.has(project.id)),
    ];

    return (
        <main>
            <HomeHero content={pageContent} />
            <ProjectGrid projects={gridProjects} />
        </main>
    );
}
