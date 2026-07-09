import MediaImage from "@/components/media/MediaImage";
import MediaVideo from "@/components/media/MediaVideo";
import type { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getMediaItemClass, getMediaImageProps } from "../ProjectsRenderer";

export default function MinimalProjectLayout({
    project,
}: {
    project: Project;
}) {
    const medias = project.galleryMedia?.slice(0, 3) ?? [];

    return (
        <main className="bg-studio-white px-6 py-16 text-studio-black md:px-10">
            <header className="mb-16">
                <h1 className="w-full max-w-full md:max-w-4xl text-5xl font-medium leading-none tracking-[-0.04em] text-studio-black md:text-7xl">
                    {project.title}
                </h1>

                <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-red-muted">
                    {project.year && <p>{project.year}</p>}
                    {project.location && <p>{project.location}</p>}
                    {project.projectStatus && <p>{project.projectStatus}</p>}
                </div>

                {project.shortDescription && (
                    <p className="mt-8 max-w-xl text-base leading-relaxed text-studio-moss">
                        {project.shortDescription}
                    </p>
                )}
            </header>

            <figure className="mx-auto max-w-5xl">
                <MediaImage
                    media={project.coverImage}
                    fallbackAlt={project.title}
                    size="hero"
                    variant="contained"
                    priority={true}
                    quality={95}
                    className="h-auto w-full object-cover"
                />
            </figure>

            {medias.length > 0 && (
                <section className="mx-auto mt-20 max-w-5xl space-y-16">
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
                                        variant={imageProps.variant}
                                        fallbackAlt={project.title}
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
                <section className="mx-auto my-24 max-w-5xl border-t border-studio-sand/60 pt-16">
                    <div className="space-y-12">
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
                                        className={imageProps.className.replace(
                                            "object-cover",
                                            "object-contain",
                                        )}
                                    />
                                </figure>
                            );
                        })}
                    </div>

                    {project.planDetails && (
                        <div className="mx-auto mt-14 max-w-2xl border-t border-studio-sand/40 pt-10">
                            <p className="mb-6 text-sm uppercase tracking-wide text-studio-red-muted">
                                Détails des plans
                            </p>

                            <div className="text-base leading-relaxed text-studio-moss">
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
