import Link from "next/link";
import Arrow from "@/components/Arrow";
import MediaImage from "@/components/media/MediaImage";
import type { Project } from "@/payload-types";

export default function FeaturedProjects({
    projects,
}: {
    projects: Project[];
}) {
    if (!projects.length) return null;

    return (
        <section
            aria-labelledby="featured-projects-title"
            className="bg-studio-white px-5 pb-16 text-studio-black md:px-10 md:pb-24"
        >
            <h2 id="featured-projects-title" className="sr-only">
                Projets à la une
            </h2>

            {projects.map((project, index) => {
                const href = `/${project.slug}`;
                const reversed = index % 2 === 1;

                return (
                    <article
                        key={project.id}
                        className="grid grid-cols-1 gap-6 border-t border-studio-black pt-8 not-first:mt-16 md:grid-cols-12 md:gap-10 md:pt-10 md:not-first:mt-24"
                    >
                        {/* The image repeats the text link, so it stays out of the tab order. */}
                        <Link
                            href={href}
                            tabIndex={-1}
                            aria-hidden="true"
                            className={`group block overflow-hidden bg-studio-cream md:col-span-7 ${reversed ? "md:order-2" : ""}`}
                        >
                            <MediaImage
                                media={project.coverImage}
                                size="hero"
                                variant="half"
                                withCaption={false}
                                fallbackAlt={project.title}
                                className="aspect-3/2 h-auto w-full object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                            />
                        </Link>

                        <div
                            className={`flex flex-col items-start md:col-span-5 ${reversed ? "md:order-1" : ""}`}
                        >
                            <h3 className="text-heading font-medium">
                                {project.title}
                            </h3>

                            {project.shortDescription && (
                                <p className="mt-6 max-w-md text-body">
                                    {project.shortDescription}
                                </p>
                            )}

                            <Link
                                href={href}
                                aria-label={`Voir le projet ${project.title}`}
                                className="group mt-8 inline-flex items-center gap-3 text-body font-medium transition-colors hover:text-studio-red-muted"
                            >
                                Voir le projet
                                <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </article>
                );
            })}
        </section>
    );
}
