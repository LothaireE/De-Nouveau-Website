import {
    addDataAndFileToRequest,
    type Endpoint,
    type PayloadHandler,
    type PayloadRequest,
} from "payload";
import sharp from "sharp";
import type { Media, Project } from "@/payload-types";
import {
    cacheSuggestion,
    getCachedSuggestion,
    imageCacheKey,
    suggestionCacheKey,
} from "./cache";
import {
    AiSuggestionError,
    fallbackSuggestion,
    isMediaTextField,
    suggestMediaText,
    type MediaTextContext,
    type ProjectContext,
    type SuggestionImage,
    type SuggestionResponse,
} from "./index";

/** Width of the image sent to the model, like the `thumbnail` size. */
export const SUGGESTION_IMAGE_WIDTH = 600;

const json = (body: unknown, status = 200) => Response.json(body, { status });

const optionalText = (value: unknown) =>
    typeof value === "string" ? value : undefined;

const toId = (value: unknown): string | number | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value && typeof value === "object" && "id" in value)
        return toId((value as { id: unknown }).id);
    return undefined;
};

/** A small JPEG for the model; the original never leaves the server. */
export async function toSuggestionImage(
    input: Buffer,
): Promise<SuggestionImage> {
    const data = await sharp(input)
        .rotate()
        .resize({ width: SUGGESTION_IMAGE_WIDTH, withoutEnlargement: true })
        .flatten({ background: "#ffffff" })
        .jpeg({ quality: 80 })
        .toBuffer();
    return { data, mimeType: "image/jpeg" };
}

async function responseToBuffer(response: Response) {
    if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (!location) return null;
        return responseToBuffer(await fetch(location));
    }
    return response.ok ? Buffer.from(await response.arrayBuffer()) : null;
}

/** Reads a stored file through the storage adapter (R2), without HTTP. */
async function readStoredFile(
    req: PayloadRequest,
    media: Media,
    filename: string,
): Promise<Buffer | null> {
    const upload = req.payload.collections.media?.config.upload;
    const handlers =
        upload && typeof upload === "object" ? (upload.handlers ?? []) : [];
    for (const handler of handlers) {
        const response = await handler(req, {
            doc: media,
            params: { collection: "media", filename },
        });
        if (response instanceof Response) return responseToBuffer(response);
    }
    return null;
}

/** The `thumbnail` size when it exists, else the original resized. */
async function loadSavedImage(req: PayloadRequest, media: Media) {
    const candidates = [
        {
            filename: media.sizes?.thumbnail?.filename,
            url: media.sizes?.thumbnail?.url,
        },
        { filename: media.filename, url: media.url },
    ];
    for (const { filename, url } of candidates) {
        let buffer = filename
            ? await readStoredFile(req, media, filename).catch(() => null)
            : null;
        if (!buffer && url && /^https?:\/\//.test(url))
            buffer = await fetch(url)
                .then(responseToBuffer)
                .catch(() => null);
        if (buffer) return toSuggestionImage(buffer);
    }
    return null;
}

/** Project facts for the prompt, with the category names. */
export async function loadProjectContext(
    req: PayloadRequest,
    projectId: string | number | undefined,
): Promise<ProjectContext | null> {
    if (projectId === undefined) return null;
    const project = (await req.payload
        .findByID({
            collection: "projects",
            id: projectId,
            depth: 1,
            draft: true,
            disableErrors: true,
            select: {
                title: true,
                location: true,
                year: true,
                shortDescription: true,
                projectStatus: true,
                categories: true,
            },
        })
        .catch(() => null)) as Partial<Project> | null;
    if (!project) return null;
    const categories = (project.categories ?? [])
        .map((category) =>
            category && typeof category === "object" ? category.title : null,
        )
        .filter((title): title is string => Boolean(title));
    return {
        title: project.title,
        location: project.location,
        year: project.year,
        shortDescription: project.shortDescription,
        projectStatus: project.projectStatus,
        categories,
    };
}

/**
 * POST /api/media/suggest — suggests an alt text or a caption.
 * Only reads data, so it also works where media are read-only.
 */
export const suggestMediaTextHandler: PayloadHandler = async (req) => {
    if (!req.user) return json({ error: "Vous devez être connecté." }, 401);

    try {
        if (req.data === undefined && !req.file)
            await addDataAndFileToRequest(req);
    } catch {
        return json({ error: "Requête invalide." }, 400);
    }

    const data = (req.data ?? {}) as Record<string, unknown>;
    const field = data.field;
    if (!isMediaTextField(field))
        return json({ error: "Champ inconnu : alt ou caption attendu." }, 400);

    const id = toId(data.id);
    const media = id
        ? ((await req.payload
              .findByID({
                  collection: "media",
                  id,
                  depth: 0,
                  disableErrors: true,
              })
              .catch(() => null)) as Media | null)
        : null;
    if (id && !media) return json({ error: "Média introuvable." }, 404);

    const file = req.file;
    const mimeType = file?.mimetype ?? media?.mimeType ?? "";
    if (media?.mediaType === "video" || mimeType.startsWith("video/"))
        return json(
            { error: "Les suggestions ne concernent que les images." },
            400,
        );
    if (!file && !media)
        return json({ error: "Ajoutez d'abord une image." }, 400);

    const context: MediaTextContext = {
        caption: optionalText(data.caption) ?? media?.caption,
        alt: optionalText(data.alt) ?? media?.alt,
        project: await loadProjectContext(
            req,
            toId(data.projectId) ?? toId(media?.project),
        ),
    };

    const started = performance.now();
    const fallback = (reason: SuggestionResponse["reason"]) => {
        req.payload.logger.warn({
            msg: "Suggestion IA indisponible, repli utilisé",
            field,
            reason,
            durationMs: Math.round(performance.now() - started),
        });
        return json({
            text: fallbackSuggestion(field, context),
            source: "fallback",
            reason,
        } satisfies SuggestionResponse);
    };

    // Same image, field and context as before: reuse the answer, no new call.
    const cacheKey = suggestionCacheKey(
        field,
        imageCacheKey(media, file?.data),
        context,
    );
    const cached = getCachedSuggestion(cacheKey);
    if (cached) {
        req.payload.logger.info({
            msg: "Suggestion IA reprise du cache",
            field,
        });
        return json({
            text: cached,
            source: "ai",
            cached: true,
        } satisfies SuggestionResponse);
    }

    let image: SuggestionImage | null = null;
    try {
        image =
            file?.data && file.data.length
                ? await toSuggestionImage(file.data)
                : media
                  ? await loadSavedImage(req, media)
                  : null;
    } catch (error) {
        req.payload.logger.error({ err: error, msg: "Image illisible" });
    }
    if (!image) return fallback("image_unavailable");

    try {
        const suggestion = await suggestMediaText({ field, image, context });
        // Only AI answers are kept: a fallback must not outlive an outage.
        cacheSuggestion(cacheKey, suggestion.text);
        req.payload.logger.info({
            msg: "Suggestion IA générée",
            field,
            provider: suggestion.provider,
            model: suggestion.model,
            durationMs: Math.round(performance.now() - started),
            imageBytes: image.data.length,
            inputTokens: suggestion.usage?.inputTokens,
            outputTokens: suggestion.usage?.outputTokens,
            neurons:
                suggestion.usage?.neurons === undefined
                    ? undefined
                    : Math.round(suggestion.usage.neurons * 100) / 100,
            neuronsEstimated: suggestion.usage?.neuronsEstimated,
        });
        return json({
            text: suggestion.text,
            source: "ai",
        } satisfies SuggestionResponse);
    } catch (error) {
        const reason =
            error instanceof AiSuggestionError ? error.reason : "error";
        if (reason !== "not_configured")
            req.payload.logger.warn({
                msg: "Échec de l'appel IA",
                detail: (error as Error)?.message,
            });
        return fallback(reason);
    }
};

export const suggestMediaTextEndpoint: Endpoint = {
    path: "/suggest",
    method: "post",
    handler: suggestMediaTextHandler,
};
