import Link from "next/link";
import MediaImage from "@/components/media/MediaImage";
import type { Project } from "@/payload-types";
import { getHomeTileWidths, getProjectMeta } from "@/library/projectDisplay";

/** Edge-to-edge photo grid; each caption sits inside its image. */
export default function ProjectGrid({ projects }: { projects: Project[] }) {
    if (!projects.length) return null;

    const wide = getHomeTileWidths(projects.length);

    return (
        <section aria-labelledby="project-grid-title" className="pt-1.5">
            <h2 id="project-grid-title" className="sr-only">
                Projets
            </h2>
            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                {projects.map((project, index) => (
                    <Link
                        key={project.id}
                        href={`/${project.slug}`}
                        className={`fill-trigger group relative block aspect-4/5 overflow-hidden bg-studio-cream ${
                            wide[index] ? "md:col-span-2 md:aspect-2/1" : ""
                        }`}
                    >
                        <MediaImage
                            media={project.coverImage}
                            size="hero"
                            variant={wide[index] ? "full" : "half"}
                            withCaption={false}
                            fallbackAlt={project.title}
                            wrapperClassName="absolute inset-0"
                            className="h-full w-full object-cover transition duration-900 ease-out group-hover:scale-[1.025]"
                        />
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 bg-linear-to-t from-studio-black/55 to-transparent to-40%"
                        />
                        <div className="absolute inset-x-4 bottom-4 z-10 text-studio-white md:inset-x-9 md:bottom-8">
                            <h3 className="fill-text fill-text-white text-body font-bold">
                                {project.title}
                                {project.shortDescription && (
                                    <>
                                        {" — "}
                                        <em>{project.shortDescription}</em>
                                    </>
                                )}
                            </h3>
                            <span className="flex flex-wrap gap-x-4 text-body font-light">
                                {getProjectMeta(project).map((item) => (
                                    <span key={item}>{item}</span>
                                ))}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
