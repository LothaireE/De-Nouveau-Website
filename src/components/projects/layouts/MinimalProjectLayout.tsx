import type { Project } from "@/payload-types";
import ProjectMedia from "../ProjectMedia";

/** Minimale: up to three images, each across the full width. */
export default function MinimalProjectLayout({
    project,
}: {
    project: Project;
}) {
    const medias = project.galleryMedia?.slice(0, 3) ?? [];

    if (!medias.length) return null;

    return (
        <section aria-label="Galerie" className="flex flex-col gap-1.5">
            {medias.map((item, index) => (
                <ProjectMedia
                    key={item.id ?? index}
                    item={{ ...item, layout: "full" }}
                    alt={`${project.title} ${index + 1}`}
                />
            ))}
        </section>
    );
}
