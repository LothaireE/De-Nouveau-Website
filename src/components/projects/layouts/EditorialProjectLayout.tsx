import type { Project } from "@/payload-types";
import ProjectMedia from "../ProjectMedia";

/**
 * Éditoriale: one full-width image, a pair, then the remaining images one by
 * one, alternating sides with open space around them.
 */
export default function EditorialProjectLayout({
    project,
}: {
    project: Project;
}) {
    const medias = project.galleryMedia ?? [];

    if (!medias.length) return null;

    const [first, ...rest] = medias;
    // A single image after the first one cannot form a pair.
    const pair = rest.length >= 2 ? rest.slice(0, 2) : [];
    const remaining = rest.slice(pair.length);
    const alt = (index: number) => `${project.title} ${index + 1}`;

    return (
        <section aria-label="Galerie" className="flex flex-col gap-1.5">
            <ProjectMedia item={first} wide alt={alt(0)} />

            {pair.length > 0 && (
                <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                    {pair.map((item, index) => (
                        <ProjectMedia
                            key={item.id ?? index}
                            item={{ ...item, layout: "auto" }}
                            alt={alt(index + 1)}
                        />
                    ))}
                </div>
            )}

            {remaining.length > 0 && (
                <div className="flex flex-col gap-16 px-4 py-16 sm:px-6 md:gap-24 md:py-24 lg:px-10">
                    {remaining.map((item, index) => (
                        <ProjectMedia
                            key={item.id ?? index}
                            item={{ ...item, layout: "auto" }}
                            alt={alt(index + 1 + pair.length)}
                            className={`w-full md:w-1/2 ${index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
