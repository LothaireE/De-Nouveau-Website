import { getMediaUrl } from "@/library/utils";
import type { Media } from "@/payload-types";

type MediaVideoProps = {
    media?: Media | number | null;
    poster?: Media | number | null;
    className?: string;
    wrapperClassName?: string;
    priority?: boolean;
    controls?: boolean;
    withCaption?: boolean;
};

export default function MediaVideo({
    media,
    className = "h-full w-full object-cover object-bottom",
    wrapperClassName = "group relative",
    priority = false,
    controls = false,
    withCaption = true,
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
        <div className={wrapperClassName}>
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

            {withCaption && media.caption?.trim() && (
                <div className="pointer-events-none absolute bottom-4 left-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="bg-black/10 px-1 text-xs uppercase tracking-wide text-studio-white backdrop-blur-xs">
                        {media.caption}
                    </p>
                </div>
            )}
        </div>
    );
}
