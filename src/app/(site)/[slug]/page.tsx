import { ProjectRenderer } from "@/components/projects/ProjectsRenderer";
import { getSingleProject } from "@/library/payload/fetchers";
import { getMediaUrl } from "@/library/utils";
import { createMetadata } from "@/library/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type ProjectPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getSingleProject(slug);

    if (!project) {
        return {
            title: "Projet introuvable — De Nouveau",
            robots: { index: false, follow: false },
        };
    }

    const coverImage =
        project.coverImage && typeof project.coverImage !== "number"
            ? project.coverImage
            : null;
    const imageFilename =
        coverImage?.sizes?.hero?.filename ?? coverImage?.filename ?? null;

    return createMetadata({
        title: `${project.title} — De Nouveau`,
        description: project.shortDescription,
        path: `/${project.slug}`,
        locale: "fr_FR",
        image: getMediaUrl(imageFilename) ?? undefined,
    });
}

export default async function SingleProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;

    const project = await getSingleProject(slug);

    if (!project) return notFound();

    return (
        <div>
            <ProjectRenderer project={project} />
        </div>
    );
}
