import { MAX_LENGTH } from "./prompts";
import type { MediaTextField } from "./types";

const QUOTES = /^[\s"'«»“”„‘’`]+|[\s"'«»“”„‘’`]+$/g;

// Labels a model sometimes echoes before its answer.
const LABEL = /^(?:légende|texte alternatif|texte alt|alt|description)\s*:\s*/i;

// "Image de…", "Photo d'…", "Cette image montre…", etc.
const DESCRIPTIVE_PREFIX =
    /^(?:(?:une|cette|l['’])\s*)?(?:image|photo|photographie|vue de l['’]image|illustration)\s+(?:(?:de|d['’]|du|des|montrant|représentant|qui montre)\s*|montre\s+)/i;

// Short words that should not end a truncated text.
const DANGLING =
    /\s+(?:de|du|des|d['’]|la|le|les|l['’]|et|ou|en|à|au|aux|sur|sous|avec|par|pour|dans|un|une|vers|entre)$/i;

const capitalize = (text: string) =>
    text ? text.charAt(0).toLocaleUpperCase("fr") + text.slice(1) : text;

/** Cuts at the last whole word that fits, without a dangling article. */
export function truncateAtWord(text: string, max: number): string {
    if (text.length <= max) return text;
    const slice = text.slice(0, max + 1);
    const lastSpace = slice.lastIndexOf(" ");
    let cut = lastSpace > 0 ? slice.slice(0, lastSpace) : text.slice(0, max);
    let previous = "";
    while (previous !== cut) {
        previous = cut;
        cut = cut.replace(DANGLING, "").replace(/[\s,;:–—-]+$/, "");
    }
    return cut;
}

/** Normalizes a raw model answer for the given field. */
export function postProcess(field: MediaTextField, raw: string): string {
    let text = (raw ?? "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find(Boolean);
    if (!text) return "";

    text = text.replace(/\s+/g, " ").replace(/\*\*/g, "");
    let previous = "";
    while (previous !== text) {
        previous = text;
        text = text
            .replace(QUOTES, "")
            .replace(LABEL, "")
            .replace(DESCRIPTIVE_PREFIX, "")
            .trim();
    }
    text = capitalize(text);

    if (field === "caption") text = text.replace(/[\s.…;,:]+$/, "");

    text = truncateAtWord(text, MAX_LENGTH[field]);
    if (field === "caption") text = text.replace(/[\s.…;,:]+$/, "");
    return text.trim();
}
