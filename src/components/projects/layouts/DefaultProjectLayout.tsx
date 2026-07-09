import MediaImage from "@/components/media/MediaImage";
import MediaVideo from "@/components/media/MediaVideo";
import type { Project } from "@/payload-types";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getMediaItemClass, getMediaImageProps } from "../ProjectsRenderer";

export default function DefaultProjectLayout({
    project,
}: {
    project: Project;
}) {
    const firstMedias = project.galleryMedia?.slice(0, 2) ?? [];
    const remainingMedias = project.galleryMedia?.slice(2) ?? [];

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
                    <h1 className="max-w-2xl text-5xl font-medium leading-none tracking-[-0.04em] text-studio-black md:text-7xl">
                        {project.title}
                    </h1>

                    <div className="mt-8 space-y-1 text-sm uppercase tracking-wide text-studio-red-muted">
                        {project.year && <p>{project.year}</p>}
                        {project.client && <p>Client {project.client}</p>}
                        {project.location && <p>{project.location}</p>}
                        {project.projectStatus && (
                            <p>Projet {project.projectStatus}</p>
                        )}
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
            {firstMedias[0]?.media &&
                typeof firstMedias[0].media !== "number" && (
                    <figure
                        className={`mx-auto my-20 max-w-5xl ${getMediaItemClass(firstMedias[0].layout ?? "auto")}`}
                    >
                        {firstMedias[0].media.mediaType === "video" ? (
                            <MediaVideo media={firstMedias[0].media} />
                        ) : (
                            <MediaImage
                                media={firstMedias[0].media}
                                {...getMediaImageProps(
                                    firstMedias[0].layout ?? "auto",
                                )}
                                fallbackAlt={project.title}
                                quality={90}
                            />
                        )}
                    </figure>
                )}

            {firstMedias.length > 1 && (
                <section className="mx-auto my-20 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
                    {firstMedias.slice(1).map((item, index) => {
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

            {remainingMedias.length > 0 && (
                <section className="mx-auto my-20 max-w-5xl space-y-16">
                    {remainingMedias.map((item, index) => {
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
                                        fallbackAlt={`${project.title} ${index + 1}`}
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
                <section className="my-24 border-t border-studio-sand/60 px-6 pt-16 md:px-10">
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
                        <div className="max-w-2xl mx-auto mt-10 border-studio-sand/40 pt-10">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-[220px_1fr]">
                                <div>
                                    <p className="text-sm uppercase tracking-wide text-studio-red-muted">
                                        Details des plans
                                    </p>
                                </div>

                                <div className="max-w-2xl text-base leading-relaxed text-studio-moss">
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
