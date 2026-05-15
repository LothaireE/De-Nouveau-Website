import MediaImage from "@/components/MediaImage";
import type { Project } from "@/payload-types";

export default function DefaultProjectLayout({
    project,
}: {
    project: Project;
}) {
    const firstImages = project.galleryImages?.slice(0, 2) ?? [];
    const remainingImages = project.galleryImages?.slice(2) ?? [];

    return (
        <main className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <section className="grid min-h-[75vh] grid-cols-1 gap-10 md:grid-cols-2 md:items-end">
                <MediaImage
                    media={project.coverImage}
                    size="hero"
                    priority={true}
                    variant="half"
                    className="h-auto w-full object-cover"
                    loading="eager"
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

            {firstImages[0]?.image &&
                typeof firstImages[0].image !== "number" && (
                    <figure className="mx-auto my-20 max-w-5xl">
                        <MediaImage
                            media={firstImages[0].image}
                            size="large"
                            fallbackAlt={project.title}
                            variant="contained"
                            className="h-auto w-full object-cover"
                        />

                        {firstImages[0].image.caption && (
                            <figcaption className="mt-3 text-sm text-studio-wood">
                                {firstImages[0].image.caption}
                            </figcaption>
                        )}
                    </figure>
                )}

            {firstImages.length > 1 && (
                <section className="mx-auto my-20 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {firstImages.slice(1).map((item, index) => {
                        const image = item.image;

                        if (!image || typeof image === "number") return null;

                        return (
                            <figure key={item.id ?? index}>
                                <MediaImage
                                    media={image}
                                    size="card"
                                    fallbackAlt={project.title}
                                    variant="half"
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

            {remainingImages.length > 0 && (
                <section className="mx-auto my-20 max-w-5xl space-y-16">
                    {remainingImages.map((item, index) => {
                        const image = item.image;

                        if (!image || typeof image === "number") return null;

                        return (
                            <figure key={item.id ?? index}>
                                {/* <MediaImage
                                    media={image}
                                    size="large"
                                    fallbackAlt={`${project.title} ${index + 1}`}
                                    className="h-auto w-full object-cover"
                                /> */}
                                <MediaImage
                                    media={image}
                                    size="large"
                                    variant="contained"
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
