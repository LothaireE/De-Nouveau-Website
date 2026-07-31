import LoadingLogo from "@/components/LoadingLogo";
import { getAllProjects, getPage } from "@/library/payload/fetchers";
import { createMetadata } from "@/library/seo";
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

export const metadata = createMetadata({
    title: "De Nouveau",
    description: "Studio d'architecture De Nouveau",
    path: "/",
    locale: "fr_FR",
});

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
