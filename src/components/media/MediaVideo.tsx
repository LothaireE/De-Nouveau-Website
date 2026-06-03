import { getMediaUrl } from "@/library/utils";
import type { Media } from "@/payload-types";

type MediaVideoProps = {
    media?: Media | number | null;
    poster?: Media | number | null;
    className?: string;
    priority?: boolean;
    controls?: boolean;
};

export default function MediaVideo({
    media,
    className = "h-full w-full object-cover object-bottom",
    priority = false,
    controls = false,
}: MediaVideoProps) {
    if (!media || typeof media === "number") return null;

    const src = getMediaUrl(media.filename || null);

    if (!src) return null;

    const posterMedia =
        media.poster && typeof media.poster !== "number" ? media.poster : null;

    const posterSrc = posterMedia
        ? getMediaUrl(
              posterMedia.sizes?.hero?.filename ||
                  posterMedia.sizes?.large?.filename ||
                  posterMedia.sizes?.card?.filename ||
                  posterMedia.filename ||
                  null,
          )
        : undefined;

    return (
        <video
            src={src}
            poster={posterSrc || undefined}
            autoPlay={!controls}
            muted={!controls}
            loop={!controls}
            playsInline
            controls={controls}
            preload={priority ? "auto" : "metadata"}
            className={className}
        />
    );
}
