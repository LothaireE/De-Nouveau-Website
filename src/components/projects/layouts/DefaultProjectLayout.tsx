import type { Project } from "@/payload-types";
import { fillLoneHalves } from "@/library/projectDisplay";
import ProjectMedia from "../ProjectMedia";
import { isWideMedia } from "../mediaLayout";

/** Classique: the first image full width, the rest in the two-column grid. */
export default function DefaultProjectLayout({
    project,
}: {
    project: Project;
}) {
    const medias = project.galleryMedia ?? [];

    if (!medias.length) return null;

    const wide = fillLoneHalves(
        medias.map((item, index) => index === 0 || isWideMedia(item.layout)),
    );

    return (
        <section
            aria-label="Galerie"
            className="grid grid-cols-1 gap-1.5 md:grid-cols-2"
        >
            {medias.map((item, index) => (
                <ProjectMedia
                    key={item.id ?? index}
                    item={item}
                    wide={wide[index]}
                    alt={`${project.title} ${index + 1}`}
                />
            ))}
        </section>
    );
}
