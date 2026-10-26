// Sizing rules for gallery items in the edge-to-edge project grid.

type MediaLayout = "auto" | "portrait" | "landscape" | "square" | "full";

/** Landscape and full-width items take both columns of the gallery grid. */
export function isWideMedia(layout?: string | null) {
    return layout === "landscape" || layout === "full";
}

/** Grid cell for a gallery item; `wide` may be forced by the page layout. */
export function getMediaItemClass(layout?: string | null, wide = false) {
    if (wide || isWideMedia(layout)) {
        // "Pleine largeur" keeps the photo whole; other wide items are cropped.
        return layout === "full"
            ? "md:col-span-2"
            : "aspect-3/2 md:col-span-2 md:aspect-16/9";
    }

    switch (layout as MediaLayout) {
        case "portrait":
            return "aspect-4/5";
        case "square":
            return "aspect-square";
        case "auto":
        default:
            return "aspect-3/2";
    }
}

export function getMediaImageProps(layout?: string | null, wide = false) {
    if (wide || isWideMedia(layout)) {
        return {
            size: "hero" as const,
            variant: "full" as const,
            wrapperClassName: "relative h-full w-full",
            className:
                layout === "full"
                    ? "h-auto w-full object-cover"
                    : "h-full w-full object-cover",
        };
    }

    return {
        size: "card" as const,
        variant: "half" as const,
        wrapperClassName: "relative h-full w-full",
        className: "h-full w-full object-cover",
    };
}
