import { createHash } from "node:crypto";
import { getUserPrompt } from "./prompts";
import type { MediaTextContext, MediaTextField } from "./types";

const MAX_ENTRIES = 500;
const TTL_MS = 24 * 60 * 60 * 1000;

type Entry = { text: string; expiresAt: number };

/**
 * AI suggestions kept in memory, so asking again for the same image, field
 * and context returns the previous answer without a new call. Lost on restart,
 * which is fine: it only spares the quota.
 */
const entries = new Map<string, Entry>();

/** Stable identity of the image: the saved version, or the uploaded bytes. */
export function imageCacheKey(
    media: { id: string | number; updatedAt?: string | null } | null,
    upload?: Buffer | null,
): string {
    if (upload?.length)
        return `upload:${createHash("sha256").update(upload).digest("hex")}`;
    return `media:${media?.id}:${media?.updatedAt ?? ""}`;
}

/**
 * The prompt holds every input the model sees (field, caption, alt, project),
 * so a changed caption gives a new alt suggestion.
 */
export function suggestionCacheKey(
    field: MediaTextField,
    image: string,
    context: MediaTextContext,
): string {
    return createHash("sha256")
        .update(
            JSON.stringify([
                field,
                image,
                process.env.AI_PROVIDER ?? "",
                process.env.CLOUDFLARE_AI_MODEL ?? "",
                getUserPrompt(field, context),
            ]),
        )
        .digest("hex");
}

export function getCachedSuggestion(key: string): string | undefined {
    const entry = entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
        entries.delete(key);
        return undefined;
    }
    // Refresh its position: the least recently used entry goes first.
    entries.delete(key);
    entries.set(key, entry);
    return entry.text;
}

export function cacheSuggestion(key: string, text: string) {
    entries.delete(key);
    entries.set(key, { text, expiresAt: Date.now() + TTL_MS });
    while (entries.size > MAX_ENTRIES)
        entries.delete(entries.keys().next().value as string);
}

export function clearSuggestionCache() {
    entries.clear();
}
