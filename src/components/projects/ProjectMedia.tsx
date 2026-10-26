import MediaImage from "@/components/media/MediaImage";
import MediaVideo from "@/components/media/MediaVideo";
import type { Project } from "@/payload-types";
import { getMediaImageProps, getMediaItemClass } from "./mediaLayout";

type GalleryItem = NonNullable<Project["galleryMedia"]>[number];

/** One gallery image or video, sized for the edge-to-edge grid. */
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
                <MediaImage
                    media={media}
                    {...getMediaImageProps(layout, wide)}
                    fallbackAlt={alt}
                    quality={90}
                />
            )}
        </figure>
    );
}
