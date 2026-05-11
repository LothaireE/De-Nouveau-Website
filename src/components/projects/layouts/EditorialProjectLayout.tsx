import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/library/sanity/imageUrlBuilder";
import type { Project } from "@/types/Project";

export default function EditorialProjectLayout({
    project,
}: {
    project: Project;
}) {
    const images = project.galleryImages ?? [];
    const firstImage = images[0];
    const middleImages = images.slice(1, 3);
    const remainingImages = images.slice(3);

    return (
        <main className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <section className="grid min-h-[75vh] grid-cols-1 gap-10 md:grid-cols-2 md:items-end">
                <Image
                    src={urlFor(project.coverImage).width(1400).url()}
                    alt={project.title}
                    width={1400}
                    height={1800}
                    priority
                    className="h-auto w-full object-cover"
                />

                <div className="pb-6">
                    <h1 className="max-w-xl text-5xl font-medium leading-none tracking-[-0.04em] text-studio-black md:text-7xl">
                        {project.title}
                    </h1>

                    <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-wood">
                        {project.year && <p>{project.year}</p>}
                        {project.client && <p>Client {project.client}</p>}
                        {project.location && <p>Location {project.location}</p>}
                        {project.status && <p>Phase {project.status}</p>}
                        {project.surface && <p>Surface {project.surface}</p>}
                    </div>

                    <p className="mt-8 max-w-xl text-base leading-relaxed text-studio-moss">
                        {project.shortDescription}
                    </p>
                </div>
            </section>

            {project.longDescription && (
                <section className="mx-auto my-24 max-w-2xl text-base leading-relaxed text-studio-moss">
                    <PortableText value={project.longDescription} />
                </section>
            )}

            {firstImage && (
                <figure className="mx-auto my-20 max-w-5xl">
                    <Image
                        src={urlFor(firstImage).width(1800).url()}
                        alt={firstImage.alt || project.title}
                        width={1800}
                        height={1200}
                        className="h-auto w-full object-cover"
                    />

                    {firstImage.caption && (
                        <figcaption className="mt-3 text-sm text-studio-wood">
                            {firstImage.caption}
                        </figcaption>
                    )}
                </figure>
            )}

            {middleImages.length > 0 && (
                <section className="mx-auto my-24 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {middleImages.map((image) => (
                        <figure key={image._key}>
                            <Image
                                src={urlFor(image).width(1000).url()}
                                alt={image.alt || project.title}
                                width={1000}
                                height={1200}
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

            {remainingImages.length > 0 && (
                <section className="mx-auto my-24 max-w-5xl space-y-20">
                    {remainingImages.map((image, index) => (
                        <figure
                            key={image._key}
                            className={
                                index % 2 === 0
                                    ? "mr-auto max-w-4xl"
                                    : "ml-auto max-w-4xl"
                            }
                        >
                            <Image
                                src={urlFor(image).width(1600).url()}
                                alt={
                                    image.alt || `${project.title} ${index + 1}`
                                }
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
