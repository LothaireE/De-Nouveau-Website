import Image from "next/image";
import { Project } from "@/types/Project";
import { urlFor } from "@/library/sanity/imageUrlBuilder";

export default function MinimalProjectLayout({
    project,
}: {
    project: Project;
}) {
    const images = project.galleryImages?.slice(0, 3) ?? [];

    return (
        <main className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <header className="mb-16">
                <h1 className="max-w-xl text-5xl font-medium leading-none tracking-[-0.04em] text-studio-black md:text-7xl">
                    {project.title}
                </h1>

                <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-wood">
                    {project.year && <p>{project.year}</p>}
                    {project.location && <p>{project.location}</p>}
                    {project.status && <p>{project.status}</p>}
                </div>

                {project.shortDescription && (
                    <p className="mt-8 max-w-xl text-base leading-relaxed text-studio-moss">
                        {project.shortDescription}
                    </p>
                )}
            </header>

            <figure className="mx-auto max-w-5xl">
                <Image
                    src={urlFor(project.coverImage).width(1800).url()}
                    alt={project.title}
                    width={1800}
                    height={1200}
                    priority
                    className="h-auto w-full object-cover"
                />
            </figure>

            {images.length > 0 && (
                <section className="mx-auto mt-20 max-w-5xl space-y-16">
                    {images.map((image) => (
                        <figure key={image._key}>
                            <Image
                                src={urlFor(image).width(1600).url()}
                                alt={image.alt || project.title}
                                width={1600}
                                height={1100}
                                className="h-auto w-full object-cover"
                            />

                            {image.caption && (
                                <figcaption className="mt-3 text-sm text-studio-wood">
                                    {image.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </section>
            )}

            {project.video && (
                <section className="mx-auto my-20 max-w-5xl">
                    <div className="aspect-video overflow-hidden bg-studio-black">
                        <iframe
                            src={project.video}
                            className="h-full w-full"
                            allowFullScreen
                        />
                    </div>
                </section>
            )}

            <footer className="mx-auto mt-24 flex max-w-5xl justify-between border-t border-studio-sand/60 pt-6 text-sm text-studio-wood">
                <span>{project.location}</span>
                <span>{project.year}</span>
            </footer>
        </main>
    );
}
