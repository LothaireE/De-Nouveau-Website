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

export async function revalidateFrontend(path: string) {
    const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    const secret = process.env.REVALIDATION_SECRET;

    if (!siteUrl || !secret) {
        console.warn(
            "NEXT_PUBLIC_SERVER_URL or REVALIDATION_SECRET is not defined. Skipping revalidation.",
        );
        return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 5000);

    try {
        const response = await fetch(`${siteUrl}/api/revalidate`, {
            method: "POST",
            signal: controller.signal,
            headers: {
                "Content-Type": "application/json",
                "x-revalidation-secret": secret,
            },
            body: JSON.stringify({ path }),
        });

        if (!response.ok) {
            console.error(
                `Failed to revalidate "${path}": ${response.status} ${response.statusText}`,
            );
        }
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            console.error(`Revalidation timeout after 5s for path "${path}"`);
            return;
        }

        console.error(`Error revalidating "${path}":`, error);
    } finally {
        clearTimeout(timeout);
    }
}
