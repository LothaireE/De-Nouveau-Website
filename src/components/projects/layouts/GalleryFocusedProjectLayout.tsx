import MediaImage from "@/components/media/MediaImage";
import MediaVideo from "@/components/media/MediaVideo";
import type { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getMediaItemClass, getMediaImageProps } from "../ProjectsRenderer";

export default function GalleryFocusedProjectLayout({
    project,
}: {
    project: Project;
}) {
    const medias = project.galleryMedia ?? [];

    return (
        <main className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <header className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr] md:items-end">
                <div className="w-full">
                    <h1 className="w-full max-w-full md:max-w-4xl text-5xl font-medium leading-none tracking-[-0.04em] text-studio-black sm:text-7xl">
                        {project.title}
                    </h1>
                    <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-red-muted">
                        {project.year && <p>{project.year}</p>}
                        {project.client && <p>Client {project.client}</p>}
                        {project.location && <p>{project.location}</p>}
                        {project.status && <p>Projet {project.status}</p>}
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

            {medias.length > 0 && (
                <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {medias.map((item, index) => {
                        const { media, layout } = item;

                        if (!media || typeof media === "number") return null;

                        const imageProps = getMediaImageProps(layout ?? "auto");

                        return (
                            <figure
                                key={item.id ?? index}
                                className={getMediaItemClass(layout ?? "auto")}
                            >
                                {media.mediaType === "video" ? (
                                    <MediaVideo media={media} />
                                ) : (
                                    <MediaImage
                                        media={media}
                                        size={imageProps.size}
                                        fallbackAlt={`${project.title} ${index + 1}`}
                                        variant={imageProps.variant}
                                        quality={90}
                                        className={imageProps.className}
                                    />
                                )}
                            </figure>
                        );
                    })}
                </section>
            )}

            {project.plans && project.plans.length > 0 && (
                <section className="my-24 border-t border-studio-sand/60 pt-16">
                    <div className="mb-10 flex justify-between text-sm uppercase tracking-wide text-studio-red-muted">
                        <span>Plans</span>
                        <span>{project.plans.length}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {project.plans.map((item, index) => {
                            const { image, layout } = item;

                            if (!image || typeof image === "number")
                                return null;

                            const imageProps = getMediaImageProps(
                                layout ?? "auto",
                            );

                            return (
                                <figure
                                    key={item.id ?? index}
                                    className={getMediaItemClass(
                                        layout ?? "auto",
                                    )}
                                >
                                    <MediaImage
                                        media={image}
                                        size={imageProps.size}
                                        variant={imageProps.variant}
                                        fallbackAlt={`Plan ${project.title} ${index + 1}`}
                                        quality={90}
                                        className={imageProps.className}
                                    />
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
