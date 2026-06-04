import MediaImage from "@/components/media/MediaImage";
import type { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";

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

                    <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-red-muted">
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
            <MediaImage
                media={project.coverImage}
                size="hero"
                fallbackAlt={project.title}
                variant="full"
                priority
                quality={95}
                className="mb-8 h-auto w-full object-cover"
            />

            {images.length > 0 && (
                <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {images.map((item, index) => {
                        const image = item.image;

                        if (!image || typeof image === "number") return null;

                        const isWide = index % 5 === 0;

                        return (
                            <figure
                                key={item.id ?? index}
                                className={isWide ? "md:col-span-2" : undefined}
                            >
                                {/* <MediaImage
                                    media={image}
                                    size={isWide ? "hero" : "card"}
                                    fallbackAlt={`${project.title} ${index + 1}`}
                                    className="h-auto w-full object-cover"
                                /> */}
                                <MediaImage
                                    media={image}
                                    size={isWide ? "hero" : "card"}
                                    fallbackAlt={`${project.title} ${index + 1}`}
                                    variant={isWide ? "full" : "half"}
                                    quality={90}
                                    className="h-auto w-full object-cover"
                                />

                                {/* {image.caption && (
                                    <figcaption className="mt-3 text-sm text-studio-red-muted">
                                        {image.caption}
                                    </figcaption>
                                )} */}
                            </figure>
                        );
                    })}
                </section>
            )}

            {/* {project.video && (
                <section className="mx-auto my-20 max-w-5xl">
                    <div className="aspect-video overflow-hidden bg-studio-black">
                        <iframe
                            src={project.video}
                            className="h-full w-full"
                            allowFullScreen
                        />
                    </div>
                </section>
            )} */}
            {project.plans && project.plans.length > 0 && (
                <section className="my-24 border-t border-studio-sand/60 pt-16">
                    <div className="mb-10 flex justify-between text-sm uppercase tracking-wide text-studio-red-muted">
                        <span>Plans</span>
                        <span>{project.plans.length}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {project.plans.map((item, index) => {
                            const plan = item.image;

                            if (!plan || typeof plan === "number") return null;

                            const fallbackSize = plan.sizes?.large?.filename
                                ? "large"
                                : "card";

                            return (
                                <figure
                                    key={item.id ?? index}
                                    className={
                                        project.plans?.length === 1
                                            ? "md:col-span-2"
                                            : undefined
                                    }
                                >
                                    <MediaImage
                                        media={plan}
                                        size={fallbackSize}
                                        fallbackAlt={`Plan ${project.title} ${index + 1}`}
                                        variant={
                                            project.plans?.length === 1
                                                ? "full"
                                                : "half"
                                        }
                                        quality={90}
                                        className="h-auto w-full object-contain"
                                    />

                                    {/* {plan.caption && (
                                        <figcaption className="mt-3 text-sm text-studio-red-muted">
                                            {plan.caption}
                                        </figcaption>
                                    )} */}
                                </figure>
                            );
                        })}
                    </div>

                    {project.planDetails && (
                        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-studio-sand/40 pt-10 md:grid-cols-[1fr_2fr]">
                            <p className="text-sm uppercase tracking-wide text-studio-red-muted">
                                Détails des plans
                            </p>

                            <div className="max-w-2xl text-base leading-relaxed text-studio-moss md:justify-self-end">
                                <RichText data={project.planDetails} />
                            </div>
                        </div>
                    )}
                </section>
            )}
            <footer className="mx-auto mt-24 flex max-w-5xl justify-between border-t border-studio-sand/60 pt-6 text-sm text-studio-red-muted">
                <span>{project.location}</span>
                <span>{project.year}</span>
            </footer>
        </main>
    );
}
