import LoadingLogo from "@/components/LoadingLogo";
import { getAllProjects, getPage } from "@/lib/payload/fetchers";
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
    const projects = await getAllProjects();

    return (
        <main>
            <section>
                <HomeHero content={pageContent} />
                <ProjectGallery projects={projects} />
            </section>
        </main>
    );
}
