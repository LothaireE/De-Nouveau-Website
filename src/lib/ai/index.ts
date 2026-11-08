import { postProcess } from "./postprocess";
import { MAX_TOKENS, getSystemPrompt, getUserPrompt } from "./prompts";
import { createCloudflareProvider } from "./providers/cloudflare";
import {
    AiSuggestionError,
    type AiUsage,
    type MediaTextProvider,
    type SuggestMediaTextInput,
} from "./types";

export * from "./types";
export { fallbackSuggestion } from "./fallback";

export const AI_TIMEOUT_MS = 15_000;

/** Providers by `AI_PROVIDER` value. Add "gemini" here later. */
const PROVIDERS: Record<string, () => MediaTextProvider> = {
    cloudflare: () => createCloudflareProvider(),
};

/** The configured provider, or null when `AI_PROVIDER` names none. */
export function getMediaTextProvider(): MediaTextProvider | null {
    const name = (process.env.AI_PROVIDER || "cloudflare").trim().toLowerCase();
    return PROVIDERS[name]?.() ?? null;
}

export type MediaTextSuggestion = {
    text: string;
    usage?: AiUsage;
    model?: string;
    provider: string;
};

/**
 * Asks the vision model for a suggestion and cleans it up.
 * Throws an `AiSuggestionError` whose `reason` explains any failure.
 */
export async function suggestMediaText(
    { field, image, context }: SuggestMediaTextInput,
    {
        provider = getMediaTextProvider(),
        timeoutMs = AI_TIMEOUT_MS,
    }: { provider?: MediaTextProvider | null; timeoutMs?: number } = {},
): Promise<MediaTextSuggestion> {
    if (!provider || !provider.isConfigured())
        throw new AiSuggestionError("not_configured");

    const result = await provider.generate({
        system: getSystemPrompt(field),
        user: getUserPrompt(field, context),
        image,
        maxTokens: MAX_TOKENS[field],
        signal: AbortSignal.timeout(timeoutMs),
    });
    const text = postProcess(field, result.text);
    if (!text) throw new AiSuggestionError("empty");
    return {
        text,
        usage: result.usage,
        model: result.model,
        provider: provider.name,
    };
}
