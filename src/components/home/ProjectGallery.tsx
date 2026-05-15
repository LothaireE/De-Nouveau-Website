import Link from "next/link";
import MediaImage from "@/components/MediaImage";
import type { Project } from "@/payload-types";

const SingleProject = ({ project }: { project: Project }) => {
    return (
        <Link
            href={String(project.slug)}
            className="group relative block h-130 overflow-hidden bg-studio-cream"
        >
            <MediaImage
                media={project.coverImage}
                size="card"
                fallbackAlt={project.title}
                variant="half"
                className="h-full w-full object-cover  transition duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />

            <div className="absolute inset-0 bg-linear-to-t from-studio-black/80 via-studio-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 text-studio-white">
                <p className="mb-2 text-xs uppercase tracking-wide text-studio-sand">
                    {project.location}
                </p>

                <h2 className="text-xl font-medium leading-none tracking-[-0.03em] md:text-2xl">
                    {project.title}
                </h2>

                <div className="mt-4 max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-48 group-hover:opacity-100">
                    <div className="space-y-1 text-xs uppercase tracking-wide text-studio-sand">
                        {project.year && <p>{project.year}</p>}
                        {project.client && <p>Client {project.client}</p>}
                        {project.status && <p>Phase {project.status}</p>}
                    </div>

                    {project.shortDescription && (
                        <p className="mt-4 text-sm leading-relaxed text-studio-cream">
                            {project.shortDescription}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

const ProjectGallery = ({ projects }: { projects: Project[] }) => {
    return (
        // <section className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
        <section className="bg-studio-white text-studio-black">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {projects.map((project) => (
                    <SingleProject key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
};

export default ProjectGallery;
