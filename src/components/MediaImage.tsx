import Image from "next/image";
import type { Media } from "@/payload-types";

type SizeKey = "thumbnail" | "card" | "hero" | "large";
type Variant = "full" | "half" | "contained" | "grid" | "auto";

type Props = {
    media?: Media | number | null;
    size?: SizeKey;
    variant?: Variant;
    fallbackAlt?: string;
    className?: string;
    priority?: boolean;
    quality?: number;
    loading?: "lazy" | "eager";
};

function getResponsive(variant: Variant, size: SizeKey) {
    switch (variant) {
        case "full":
            return "100vw";

        case "half":
            return "(max-width: 768px) 100vw, 50vw";

        case "grid":
            return "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

        case "contained":
            return "(max-width: 768px) 100vw, 800px";

        case "auto":
        default:
            // fallback based on size
            if (size === "hero") return "100vw";
            if (size === "card") return "(max-width: 768px) 100vw, 50vw";
            return "(max-width: 768px) 100vw, 800px";
    }
}

function getMediaUrl(filename: string | null) {
    if (!filename) return null;

    const baseUrl = process.env.NEXT_PUBLIC_S3_PUBLIC_DEV_URL;
    const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;

    if (!baseUrl || !bucket) return null;

    return `${baseUrl}/${bucket}/${encodeURIComponent(filename)}`;
}

export default function MediaImage({
    media,
    size = "card",
    variant = "auto",
    fallbackAlt = "",
    className,
    priority = false,
    quality = 90,
    loading,
}: Props) {
    if (!media || typeof media === "number") return null;

    const selectedSize = media.sizes?.[size];

    const filename = selectedSize?.filename || media.filename || null;
    const cleanedSrc = getMediaUrl(filename);

    const width = selectedSize?.width || media.width || 800;
    const height = selectedSize?.height || media.height || 600;
    const alt = media.alt || fallbackAlt;

    if (!cleanedSrc) return null;

    const responsive = getResponsive(variant, size);

    return (
        <Image
            src={cleanedSrc}
            alt={alt}
            width={width}
            height={height}
            className={className}
            priority={priority}
            sizes={responsive}
            quality={quality}
            loading={loading ?? (priority ? "eager" : "lazy")} // patch to avoid waring to fix later
        />
    );
}
