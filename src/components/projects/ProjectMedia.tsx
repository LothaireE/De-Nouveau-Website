import MediaImage from "@/components/media/MediaImage";
import MediaVideo from "@/components/media/MediaVideo";
import type { Media, Project } from "@/payload-types";
import { getMediaUrl } from "@/library/utils";
import { getMediaImageProps, getMediaItemClass } from "./mediaLayout";

type GalleryItem = NonNullable<Project["galleryMedia"]>[number];

/**
 * One gallery image or video, sized for the edge-to-edge grid. Images are
 * buttons carrying their full-size photo for the lightbox (ProjectLightbox).
 */
export default function ProjectMedia({
    item,
    alt,
    wide = false,
    className = "",
}: {
    item: GalleryItem;
    alt: string;
    /** Span both columns regardless of the item's own format. */
    wide?: boolean;
    className?: string;
}) {
    const { media, layout } = item;

    if (!media || typeof media === "number") return null;

    return (
        <figure
            className={`m-0 overflow-hidden bg-studio-cream ${getMediaItemClass(layout, wide)} ${className}`}
        >
            {media.mediaType === "video" ? (
                <MediaVideo
                    media={media}
                    wrapperClassName="relative h-full w-full"
                />
            ) : (
                <LightboxTrigger media={media} alt={media.alt || alt}>
                    <MediaImage
                        media={media}
                        {...getMediaImageProps(layout, wide)}
                        fallbackAlt={alt}
                        quality={90}
                    />
                </LightboxTrigger>
            )}
        </figure>
    );
}

function LightboxTrigger({
    media,
    alt,
    children,
}: {
    media: Media;
    alt: string;
    children: React.ReactNode;
}) {
    // "large" keeps the whole photo (no crop), capped at 3000px wide.
    const large = media.sizes?.large;
    const src = getMediaUrl(large?.filename || media.filename || null);
    const width = (large?.filename && large.width) || media.width;
    const height = (large?.filename && large.height) || media.height;

    if (!src) return children;

    return (
        <button
            type="button"
            aria-label={`Agrandir : ${alt}`}
            data-lightbox-src={src}
            data-lightbox-width={width ?? undefined}
            data-lightbox-height={height ?? undefined}
            data-lightbox-alt={alt}
            data-lightbox-caption={media.caption?.trim() || undefined}
            className="block h-full w-full cursor-pointer [&_img]:transition-opacity [&_img]:duration-300 data-active:[&_img]:opacity-0"
        >
            {children}
        </button>
    );
}
