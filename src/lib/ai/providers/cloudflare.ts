import {
    AiSuggestionError,
    type AiUsage,
    type MediaTextProvider,
    type ProviderResult,
} from "../types";

/** Mistral Small 3.1: vision, good French, licence usable in the EU. */
export const DEFAULT_CLOUDFLARE_MODEL =
    "@cf/mistralai/mistral-small-3.1-24b-instruct";

/**
 * Neurons per million tokens, from the Workers AI pricing page, used to
 * estimate quota usage when the API does not report it.
 * ($0.351 / $0.555 per M tokens at $0.011 per 1,000 neurons.)
 */
const NEURON_RATES: Record<string, { input: number; output: number }> = {
    [DEFAULT_CLOUDFLARE_MODEL]: { input: 31876, output: 50488 },
};

type CloudflareEnv = {
    accountId?: string;
    apiToken?: string;
    model?: string;
    fetchImpl?: typeof fetch;
};

const readEnv = (): CloudflareEnv => ({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID?.trim(),
    apiToken: process.env.CLOUDFLARE_AI_API_TOKEN?.trim(),
    model: process.env.CLOUDFLARE_AI_MODEL?.trim(),
});

type ChatResponse = {
    choices?: { message?: { content?: unknown } }[];
    result?: { response?: unknown; usage?: RawUsage };
    usage?: RawUsage;
    errors?: { code?: number; message?: string }[];
    [key: string]: unknown;
};

type RawUsage = {
    prompt_tokens?: number;
    completion_tokens?: number;
    neurons?: number;
};

function messageText(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content))
        return content
            .map((part) =>
                typeof part === "string"
                    ? part
                    : typeof part?.text === "string"
                      ? part.text
                      : "",
            )
            .join("");
    return "";
}

function readUsage(
    body: ChatResponse,
    headers: Headers,
    model: string,
): AiUsage | undefined {
    const raw = body.usage ?? body.result?.usage;
    const usage: AiUsage = {
        inputTokens: raw?.prompt_tokens,
        outputTokens: raw?.completion_tokens,
    };
    const reported =
        raw?.neurons ??
        Number(headers.get("cf-ai-neurons") ?? headers.get("x-neurons") ?? NaN);
    const rate = NEURON_RATES[model];
    if (Number.isFinite(reported)) {
        usage.neurons = reported;
    } else if (rate && (usage.inputTokens || usage.outputTokens)) {
        usage.neurons = Math.round(
            ((usage.inputTokens ?? 0) * rate.input +
                (usage.outputTokens ?? 0) * rate.output) /
                1_000_000,
        );
        usage.neuronsEstimated = true;
    }
    return raw || usage.neurons !== undefined ? usage : undefined;
}

function isQuotaError(status: number, body: ChatResponse | null) {
    if (status === 429) return true;
    const text = JSON.stringify(body?.errors ?? "").toLowerCase();
    return /neuron|allocation|quota|rate limit|capacity/.test(text);
}

/** Workers AI through its OpenAI-compatible REST endpoint. No Worker to deploy. */
export function createCloudflareProvider(
    env: CloudflareEnv = readEnv(),
): MediaTextProvider {
    const fetchImpl = env.fetchImpl ?? ((...args) => fetch(...args));
    const model = env.model || DEFAULT_CLOUDFLARE_MODEL;

    return {
        name: "cloudflare",
        isConfigured: () => Boolean(env.accountId && env.apiToken),
        async generate({
            system,
            user,
            image,
            maxTokens,
            signal,
        }): Promise<ProviderResult> {
            if (!env.accountId || !env.apiToken)
                throw new AiSuggestionError("not_configured");

            const url = `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(
                env.accountId,
            )}/ai/v1/chat/completions`;
            const dataUri = `data:${image.mimeType};base64,${image.data.toString("base64")}`;

            let response: Response;
            try {
                response = await fetchImpl(url, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${env.apiToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model,
                        max_tokens: maxTokens,
                        temperature: 0.2,
                        messages: [
                            { role: "system", content: system },
                            {
                                role: "user",
                                content: [
                                    { type: "text", text: user },
                                    {
                                        type: "image_url",
                                        image_url: { url: dataUri },
                                    },
                                ],
                            },
                        ],
                    }),
                    signal,
                });
            } catch (error) {
                const name = (error as Error)?.name;
                if (name === "TimeoutError" || name === "AbortError")
                    throw new AiSuggestionError("timeout");
                throw new AiSuggestionError(
                    "error",
                    `Cloudflare unreachable: ${(error as Error)?.message}`,
                );
            }

            const body = (await response
                .json()
                .catch(() => null)) as ChatResponse | null;

            if (!response.ok) {
                const detail = JSON.stringify(body?.errors ?? body ?? "");
                throw new AiSuggestionError(
                    isQuotaError(response.status, body) ? "quota" : "error",
                    `Cloudflare ${response.status}: ${detail.slice(0, 300)}`,
                );
            }

            const text = messageText(
                body?.choices?.[0]?.message?.content ?? body?.result?.response,
            );
            return {
                text,
                model,
                usage: body
                    ? readUsage(body, response.headers, model)
                    : undefined,
            };
        },
    };
}
