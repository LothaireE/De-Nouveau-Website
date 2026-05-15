import { getAllProjects, getPage } from "@/library/payload/fetchers";
import { createMetadata } from "@/library/seo";
import dynamic from "next/dynamic";

const HomeHero = dynamic(() => import("@/components/home/HomeHero"), {
    loading: () => <div className="min-h-screen bg-neutral-100" />,
});

const ProjectGallery = dynamic(
    () => import("@/components/home/ProjectGallery"),
    {
        loading: () => <div className="h-96 bg-neutral-100" />,
    },
);

export const metadata = createMetadata({
    title: "De Nouveau",
    description: "Studio d'architecture De Nouveau",
    path: "/about",
    locale: "fr_FR",
    image: "/images/about.jpg",
});

const SLUG = "homepage";

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
