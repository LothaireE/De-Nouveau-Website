import LoadingLogo from "@/components/LoadingLogo";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import {
    getAllProjects,
    getFeaturedProjects,
    getPage,
} from "@/lib/payload/fetchers";
import { getPageMetadata } from "@/lib/payload/metadata";
import { Page } from "@/payload-types";
import dynamic from "next/dynamic";

const HomeHero = dynamic<{ content: Page | null }>(
    () => import("@/components/home/HomeHero"),
    {
        loading: () => <LoadingLogo />,
    },
);

const ProjectGallery = dynamic(
    () => import("@/components/home/ProjectGallery"),
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

    return (
        <main>
            <section>
                <HomeHero content={pageContent} />
                <FeaturedProjects projects={featuredProjects} />
                <ProjectGallery projects={projects} />
            </section>
        </main>
    );
}
