import { Media } from "@/payload-types";
import {
    type FieldHook,
    type CollectionAfterChangeHook,
    type CollectionBeforeValidateHook,
    type CollectionBeforeOperationHook,
    APIError,
} from "payload";
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
    media: Media | string | number | null,
): string | number | null => {
    if (!media) return null;

    if (typeof media === "string" || typeof media === "number") {
        return media;
    }

    return media.id;
};

type GalleryMediaItem = {
    media?: Media | string | number | null;
};

type PlanMediaItem = {
    image?: Media | string | number | null;
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
    const galleryMedia = doc.galleryMedia ?? [];
    const plans = doc.plans ?? [];

    const medias = [
        getMediaId(doc.coverImage),
        ...galleryMedia.map((item: GalleryMediaItem) =>
            getMediaId(item.media ?? null),
        ),
        ...plans.map((item: PlanMediaItem) => getMediaId(item.image ?? null)),
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

export const assignMediatype: CollectionBeforeValidateHook = ({
    data = {},
    req,
}) => {
    const mimeType = req.file?.mimetype || data?.mimeType;

    if (!mimeType) return data;

    if (mimeType.startsWith("image/")) {
        data.mediaType = "image";
    }

    if (mimeType.startsWith("video/")) {
        data.mediaType = "video";
        const maxSize = 4 * 1024 * 1024; // 4MB

        if (req.file?.size && req.file.size > maxSize) {
            throw new Error("la vidéo ne doit pas depasser 4MB.");
        }
    }

    return data;
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

export const preventDuplicateFilename: CollectionBeforeOperationHook = async ({
    req,
    operation,
}) => {
    if ((operation !== "create" && operation !== "update") || !req.file) {
        return;
    }
    const filename = req.file.name;

    const existingMedia = await req.payload.find({
        collection: "media",
        where: {
            filename: {
                equals: filename,
            },
        },
        limit: 1,
        depth: 0,
        overrideAccess: true,
    });

    if (existingMedia.totalDocs > 0) {
        throw new APIError(
            `Un média nommé "${filename}" existe déjà, utilisez le média existant ou renommez votre fichier avant de l'importer.`,
            400,
        );
    }
};
