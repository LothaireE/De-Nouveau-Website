/** The media fields that can receive an AI suggestion. */
export type MediaTextField = "alt" | "caption";

export const MEDIA_TEXT_FIELDS: readonly MediaTextField[] = ["alt", "caption"];

export function isMediaTextField(value: unknown): value is MediaTextField {
    return value === "alt" || value === "caption";
}

/** Project facts the model may rely on. Every entry is optional. */
export type ProjectContext = {
    title?: string | null;
    location?: string | null;
    year?: number | string | null;
    shortDescription?: string | null;
    projectStatus?: string | null;
    categories?: string[];
};

/** Current form values, possibly not saved yet. */
export type MediaTextContext = {
    caption?: string | null;
    alt?: string | null;
    project?: ProjectContext | null;
};

/** A small JPEG, never the original file. */
export type SuggestionImage = {
    data: Buffer;
    mimeType: "image/jpeg";
};

export type SuggestMediaTextInput = {
    field: MediaTextField;
    image: SuggestionImage;
    context: MediaTextContext;
};

/** Usage reported by the provider, used to measure the free quota. */
export type AiUsage = {
    inputTokens?: number;
    outputTokens?: number;
    /** Cloudflare's billing unit, when known (reported or estimated). */
    neurons?: number;
    neuronsEstimated?: boolean;
};

export type ProviderResult = {
    text: string;
    usage?: AiUsage;
    model?: string;
};

/**
 * A vision model able to suggest media text. Add a provider (e.g. Gemini) by
 * implementing this interface and registering it in `./index.ts`.
 */
export interface MediaTextProvider {
    readonly name: string;
    isConfigured(): boolean;
    generate(args: {
        system: string;
        user: string;
        image: SuggestionImage;
        maxTokens: number;
        signal: AbortSignal;
    }): Promise<ProviderResult>;
}

export type SuggestionFailureReason =
    | "not_configured"
    | "quota"
    | "timeout"
    | "error"
    | "empty"
    | "image_unavailable";

export class AiSuggestionError extends Error {
    constructor(
        readonly reason: SuggestionFailureReason,
        message?: string,
    ) {
        super(message ?? reason);
        this.name = "AiSuggestionError";
    }
}

export type SuggestionResponse = {
    text: string;
    source: "ai" | "fallback";
    reason?: SuggestionFailureReason;
    /** True when the answer comes from the server cache (no AI call). */
    cached?: boolean;
};
