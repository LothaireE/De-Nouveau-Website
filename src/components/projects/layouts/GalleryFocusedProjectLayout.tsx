import Image from "next/image";
import { Project } from "@/types/Project";
import { urlFor } from "@/library/sanity/imageUrlBuilder";

export default function GalleryFocusedProjectLayout({
    project,
}: {
    project: Project;
}) {
    const images = project.galleryImages ?? [];

    return (
        <main className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <header className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-[1fr_2fr] md:items-end">
                <div>
                    <h1 className="max-w-xl text-5xl font-medium leading-none tracking-[-0.04em] text-studio-black md:text-7xl">
                        {project.title}
                    </h1>

                    <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-wood">
                        {project.year && <p>{project.year}</p>}
                        {project.client && <p>Client {project.client}</p>}
                        {project.location && <p>Location {project.location}</p>}
                        {project.status && <p>Phase {project.status}</p>}
                    </div>
                </div>

                {project.shortDescription && (
                    <p className="max-w-xl text-base leading-relaxed text-studio-moss md:justify-self-end">
                        {project.shortDescription}
                    </p>
                )}
            </header>

            <Image
                src={urlFor(project.coverImage).width(2200).url()}
                alt={project.coverImage.alt ?? ""}
                width={2200}
                height={1400}
                priority
                className="mb-8 h-auto w-full object-cover"
            />

            {images.length > 0 && (
                <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {images.map((image, index) => {
                        const isWide = index % 5 === 0;

                        return (
                            <figure
                                key={image._key}
                                className={isWide ? "md:col-span-2" : undefined}
                            >
                                <Image
                                    src={urlFor(image)
                                        .width(isWide ? 2200 : 1200)
                                        .url()}
                                    alt={
                                        image.alt ||
                                        `${project.title} ${index + 1}`
                                    }
                                    width={isWide ? 2200 : 1200}
                                    height={isWide ? 1400 : 900}
                                    className="h-auto w-full object-cover"
                                />

                                {image.caption && (
                                    <figcaption className="mt-3 text-sm text-studio-wood">
                                        {image.caption}
                                    </figcaption>
                                )}
                            </figure>
                        );
                    })}
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
