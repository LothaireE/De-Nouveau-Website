import { Media } from "@/payload-types";
import type { FieldHook, CollectionAfterChangeHook } from "payload";
import slugify from "slugify";

export const formatSlug =
    (fallback: string): FieldHook =>
    ({ data, originalDoc, value }) => {
        if (typeof value === "string" && value.length > 0) {
            return slugify(value, {
                lower: true,
                strict: true,
            });
        }

        const fallbackData = data?.[fallback] || originalDoc?.[fallback];

        if (fallbackData && typeof fallbackData === "string") {
            return slugify(fallbackData, {
                lower: true,
                strict: true,
            });
        }

        return value;
    };

export const getMediaId = (
    image: Media | string | number | null,
): string | number | null => {
    if (!image) return null;

    if (typeof image === "string" || typeof image === "number") return image;

    return image.id;
};

type GalleryImageItem = {
    image: Media | string | number | null;
};

/**
 * checking if new media images are assigned to a project or not
 * if not assigned, it updates the media item to link it to the project
 * */
export const assignProjectToMedia: CollectionAfterChangeHook = async ({
    doc,
    req,
    context,
}) => {
    if (context?.skipProjectGalleryHook) return doc;

    const projectId = doc.id;
    const galleryImages = doc.galleryImages ?? [];

    const medias = [
        getMediaId(doc.coverImage),
        getMediaId(doc.plans),
        ...galleryImages.map((item: GalleryImageItem) =>
            getMediaId(item.image),
        ),
    ];

    const mediaIds = Array.from(
        new Set(medias.filter((id): id is string | number => Boolean(id))),
    );

    for (const mediaId of mediaIds) {
        const media = await req.payload.findByID({
            collection: "media",
            id: mediaId,
            depth: 0,
            overrideAccess: true,
            req: req,
        });

        if (media.project) continue;

        await req.payload.update({
            collection: "media",
            id: mediaId,
            depth: 0,
            overrideAccess: true,
            req: req,
            context: {
                skipProjectGalleryHook: true, // prevent infinite loop of updates between project and media when a media is added to a project gallery
            },
            data: {
                project: projectId,
            },
        });
    }
    return doc;
};
