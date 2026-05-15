import MediaImage from "@/components/MediaImage";
import type { Project } from "@/payload-types";

export default function EditorialProjectLayout({
    project,
}: {
    project: Project;
}) {
    const images = project.galleryImages ?? [];
    const firstImage = images[0]?.image;
    const middleImages = images.slice(1, 3);
    const remainingImages = images.slice(3);

    return (
        <main className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <section className="grid min-h-[75vh] grid-cols-1 gap-10 md:grid-cols-2 md:items-end">
                <MediaImage
                    media={project.coverImage}
                    size="hero"
                    variant="half"
                    priority={true}
                    quality={95}
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
                    longDescription ici
                </section>
            )}

            {firstImage && typeof firstImage !== "number" && (
                <figure className="mx-auto my-20 max-w-5xl">
                    <MediaImage
                        media={firstImage}
                        size="large"
                        variant="contained"
                        fallbackAlt={project.title}
                        quality={90}
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
                    {middleImages.map((item, index) => {
                        const image = item.image;

                        if (!image || typeof image === "number") return null;

                        return (
                            <figure key={item.id ?? index}>
                                {/* <MediaImage
                                    media={image}
                                    size="card"
                                    fallbackAlt={project.title}
                                    className="h-auto w-full object-cover"
                                /> */}
                                <MediaImage
                                    media={image}
                                    size="card"
                                    variant="half"
                                    quality={90}
                                    className="h-auto w-full object-cover"
                                    fallbackAlt={project.title}
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

            {remainingImages.length > 0 && (
                <section className="mx-auto my-24 max-w-5xl space-y-20">
                    {remainingImages.map((item, index) => {
                        const image = item.image;

                        if (!image || typeof image === "number") return null;

                        return (
                            <figure
                                key={item.id ?? index}
                                className={
                                    index % 2 === 0
                                        ? "mr-auto max-w-4xl"
                                        : "ml-auto max-w-4xl"
                                }
                            >
                                <MediaImage
                                    media={image}
                                    size="large"
                                    variant="contained"
                                    quality={90}
                                    fallbackAlt={`${project.title} ${index + 1}`}
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
