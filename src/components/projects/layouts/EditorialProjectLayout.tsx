import MediaImage from "@/components/media/MediaImage";
import MediaVideo from "@/components/media/MediaVideo";
import type { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getMediaItemClass, getMediaImageProps } from "../ProjectsRenderer";

export default function EditorialProjectLayout({
    project,
}: {
    project: Project;
}) {
    const medias = project.galleryMedia ?? [];
    const firstMedia = medias[0];
    const middleMedias = medias.slice(1, 3);
    const remainingMedias = medias.slice(3);

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

                    <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-red-muted">
                        {project.year && <p>{project.year}</p>}
                        {project.client && <p>Client {project.client}</p>}
                        {project.location && <p>{project.location}</p>}
                        {project.projectStatus && (
                            <p>Projet {project.projectStatus}</p>
                        )}
                        {project.surface && <p>Surface {project.surface}</p>}
                    </div>

                    <p className="mt-8 max-w-xl text-base leading-relaxed text-studio-moss">
                        {project.shortDescription}
                    </p>
                </div>
            </section>
            {project.longDescription && (
                <section className="mx-auto my-24 max-w-2xl text-base leading-relaxed text-studio-moss">
                    <RichText data={project.longDescription} />
                </section>
            )}

            {firstMedia?.media && typeof firstMedia.media !== "number" ? (
                <figure
                    className={`mx-auto my-24 max-w-5xl ${getMediaItemClass(firstMedia.layout ?? "auto")}`}
                >
                    {firstMedia.media.mediaType === "video" ? (
                        <MediaVideo media={firstMedia.media} />
                    ) : (
                        <MediaImage
                            media={firstMedia.media}
                            {...getMediaImageProps(firstMedia.layout ?? "auto")}
                            fallbackAlt={project.title}
                            quality={90}
                        />
                    )}
                </figure>
            ) : null}
            {middleMedias.length > 0 && (
                <section className="mx-auto my-24 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {middleMedias.map((item, index) => {
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
                                        quality={90}
                                        className={imageProps.className}
                                        fallbackAlt={project.title}
                                    />
                                )}
                            </figure>
                        );
                    })}
                </section>
            )}

            {remainingMedias.length > 0 && (
                <section className="mx-auto my-24 max-w-5xl space-y-20">
                    {remainingMedias.map((item, index) => {
                        const { media, layout } = item;

                        if (!media || typeof media === "number") return null;

                        const imageProps = getMediaImageProps(layout ?? "auto");

                        return (
                            <figure
                                key={item.id ?? index}
                                className={`${index % 2 === 0 ? "mr-auto" : "ml-auto"} ${getMediaItemClass(layout ?? "auto")}`}
                            >
                                {media.mediaType === "video" ? (
                                    <MediaVideo media={media} />
                                ) : (
                                    <MediaImage
                                        media={media}
                                        size={imageProps.size}
                                        variant={imageProps.variant}
                                        quality={90}
                                        fallbackAlt={`${project.title} ${index + 1}`}
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
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
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
                                    className={`${index % 2 === 0 ? "mr-auto" : "ml-auto"} ${getMediaItemClass(layout ?? "auto")}`}
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
                        <div className="mx-auto mt-16 max-w-2xl border-t border-studio-sand/40 pt-10">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-[180px_1fr]">
                                <p className="text-sm uppercase tracking-wide text-studio-red-muted">
                                    Détails des plans
                                </p>

                                <div className="text-base leading-relaxed text-studio-moss">
                                    <RichText data={project.planDetails} />
                                </div>
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
