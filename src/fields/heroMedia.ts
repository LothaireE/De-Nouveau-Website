import type { UploadField, Validate } from "payload";
import { upload } from "payload/shared";

export const HERO_VIDEO_MAX_BYTES = 4 * 1024 * 1024;

type MediaSize = { mediaType?: string | null; filesize?: number | null };

export function getHeroMediaError(media: MediaSize | null | undefined) {
    return media?.mediaType === "video" &&
        (media.filesize ?? 0) > HERO_VIDEO_MAX_BYTES
        ? `Cette vidéo pèse ${(media.filesize! / 1024 / 1024).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} Mo : la vidéo d’en-tête ne doit pas dépasser 4 Mo. Choisissez une vidéo plus légère ou une image.`
        : null;
}

/** Hero videos autoplay on the homepage, so their weight is checked on save. */
export const validateHeroMedia: Validate<
    unknown,
    unknown,
    unknown,
    UploadField
> = async (value, options) => {
    const id =
        value && typeof value === "object" && "id" in value ? value.id : value;
    if (
        options.event !== "onChange" &&
        (typeof id === "number" || typeof id === "string")
    ) {
        const media = await options.req.payload
            .findByID({ collection: "media", id, depth: 0, req: options.req })
            .catch(() => null);
        const error = getHeroMediaError(media);
        if (error) return error;
    }
    return upload(value, options);
};
