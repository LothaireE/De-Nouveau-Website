import { MAX_LENGTH } from "./prompts";
import { truncateAtWord } from "./postprocess";
import type { MediaTextContext, MediaTextField } from "./types";

const clean = (value?: string | null) =>
    typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

/**
 * Suggestion built without AI, from the form values and the project:
 * - caption: the project title, or nothing;
 * - alt: "{caption}, projet {title}" with whatever is available.
 */
export function fallbackSuggestion(
    field: MediaTextField,
    context: MediaTextContext,
): string {
    const title = clean(context.project?.title);
    if (field === "caption") return truncateAtWord(title, MAX_LENGTH.caption);

    const caption = clean(context.caption);
    const parts: string[] = [];
    if (caption) parts.push(caption);
    if (title && caption.toLowerCase() !== title.toLowerCase())
        parts.push(caption ? `projet ${title}` : `Projet ${title}`);
    return truncateAtWord(parts.join(", "), MAX_LENGTH.alt);
}
