import Link from "next/link";
import MediaImage from "@/components/media/MediaImage";
import type { Project } from "@/payload-types";

export default function NextProject({ project }: { project: Project }) {
    return (
        <Link
            href={`/${project.slug}`}
            className="fill-trigger group relative mt-1.5 block aspect-4/5 overflow-hidden bg-studio-cream md:aspect-16/7"
        >
            <MediaImage
                media={project.coverImage}
                size="hero"
                variant="full"
                withCaption={false}
                fallbackAlt={project.title}
                wrapperClassName="absolute inset-0"
                className="h-full w-full object-cover transition duration-900 ease-out group-hover:scale-[1.025]"
            />
            <span
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-studio-black/55 to-transparent to-40%"
            />
            <div className="absolute inset-x-4 bottom-6 z-10 text-studio-white md:inset-x-9 md:bottom-10">
                <p className="mb-1.5 text-small uppercase tracking-wide">
                    Projet suivant
                </p>
                <h2 className="fill-text fill-text-white text-heading font-light uppercase">
                    {project.title}
                </h2>
            </div>
        </Link>
    );
}
