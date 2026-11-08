import type { PayloadRequest } from "payload";
import sharp from "sharp";
import {
    afterEach,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import { clearSuggestionCache } from "./cache";
import { DEFAULT_CLOUDFLARE_MODEL } from "./providers/cloudflare";
import { suggestMediaTextHandler } from "./suggestEndpoint";

let png: Buffer;
beforeAll(async () => {
    png = await sharp({
        create: {
            width: 1800,
            height: 1200,
            channels: 3,
            background: "#b07040",
        },
    })
        .png()
        .toBuffer();
});

const project = {
    id: 3,
    title: "Bambou U",
    location: "Hanoï",
    year: 2024,
    projectStatus: "concept",
    categories: [{ id: 1, title: "Concours" }],
};

type ReqOptions = {
    user?: object | null;
    data?: Record<string, unknown>;
    file?: { data: Buffer; mimetype: string; name: string; size: number };
    media?: Record<string, unknown> | null;
};

function makeReq({
    user = { id: 1 },
    data = {},
    file,
    media = null,
}: ReqOptions) {
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
    const storageHandler = vi.fn(async () => new Response(new Uint8Array(png)));
    const findByID = vi.fn(async ({ collection }: { collection: string }) =>
        collection === "media" ? media : project,
    );
    const req = {
        user,
        data,
        file,
        payload: {
            findByID,
            logger,
            collections: {
                media: { config: { upload: { handlers: [storageHandler] } } },
            },
        },
    } as unknown as PayloadRequest;
    return { req, logger, findByID, storageHandler };
}

const newImage = () => ({
    data: png,
    mimetype: "image/png",
    name: "toiture.png",
    size: png.length,
});

async function call(options: ReqOptions) {
    const parts = makeReq(options);
    const response = await suggestMediaTextHandler(parts.req);
    return { ...parts, response, body: await response.json() };
}

const fetchMock = vi.fn();

/** The JSON body sent to Cloudflare by the n-th fetch call. */
const sentBody = (n = 0) => JSON.parse(fetchMock.mock.calls[n][1].body);

const aiAnswer = (content: string) =>
    Response.json({
        choices: [{ message: { role: "assistant", content } }],
        usage: { prompt_tokens: 1000, completion_tokens: 10 },
    });

beforeEach(() => {
    clearSuggestionCache();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("AI_PROVIDER", "");
    vi.stubEnv("CLOUDFLARE_AI_MODEL", "");
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "account-123");
    vi.stubEnv("CLOUDFLARE_AI_API_TOKEN", "token-abc");
});
afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
});

describe("POST /api/media/suggest", () => {
    it("refuses anonymous requests", async () => {
        const { response, body } = await call({
            user: null,
            data: { field: "alt" },
            file: newImage(),
        });
        expect(response.status).toBe(401);
        expect(body.error).toBeTruthy();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("rejects an unknown field, a video or a missing image", async () => {
        expect(
            (await call({ data: { field: "title" }, file: newImage() }))
                .response.status,
        ).toBe(400);
        expect(
            (
                await call({
                    data: { field: "alt", id: 9 },
                    media: { id: 9, mediaType: "video", mimeType: "video/mp4" },
                })
            ).response.status,
        ).toBe(400);
        expect((await call({ data: { field: "alt" } })).response.status).toBe(
            400,
        );
    });

    it("falls back without calling the AI when Cloudflare is not configured", async () => {
        vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "");
        vi.stubEnv("CLOUDFLARE_AI_API_TOKEN", "");
        const { body } = await call({
            data: { field: "caption", projectId: 3 },
            file: newImage(),
        });
        expect(body).toEqual({
            text: "Bambou U",
            source: "fallback",
            reason: "not_configured",
        });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("falls back when Cloudflare answers 429 (quota reached)", async () => {
        fetchMock.mockResolvedValue(
            Response.json(
                {
                    success: false,
                    errors: [
                        {
                            code: 3036,
                            message: "daily free allocation exceeded",
                        },
                    ],
                },
                { status: 429 },
            ),
        );
        const { body, logger } = await call({
            data: {
                field: "alt",
                caption: "Toiture en bambou de nuit",
                projectId: 3,
            },
            file: newImage(),
        });
        expect(body).toEqual({
            text: "Toiture en bambou de nuit, projet Bambou U",
            source: "fallback",
            reason: "quota",
        });
        expect(logger.warn).toHaveBeenCalled();
    });

    it("suggests a caption for a new image, resized to 600 px JPEG", async () => {
        fetchMock.mockResolvedValue(aiAnswer("« Toiture en bambou de nuit. »"));
        const { body, logger } = await call({
            data: { field: "caption", projectId: 3 },
            file: newImage(),
        });

        expect(body).toEqual({
            text: "Toiture en bambou de nuit",
            source: "ai",
        });

        const [url, init] = fetchMock.mock.calls[0];
        expect(url).toBe(
            "https://api.cloudflare.com/client/v4/accounts/account-123/ai/v1/chat/completions",
        );
        expect(init.headers.Authorization).toBe("Bearer token-abc");
        const sent = sentBody();
        expect(sent.model).toBe(DEFAULT_CLOUDFLARE_MODEL);
        expect(sent.messages[0].content).toContain("légende");
        const [text, image] = sent.messages[1].content;
        expect(text.text).toContain("Titre : Bambou U");
        expect(text.text).toContain("Catégories : Concours");

        const dataUri: string = image.image_url.url;
        expect(dataUri.startsWith("data:image/jpeg;base64,")).toBe(true);
        const meta = await sharp(
            Buffer.from(dataUri.split(",")[1], "base64"),
        ).metadata();
        expect(meta.format).toBe("jpeg");
        expect(meta.width).toBe(600);

        expect(logger.info).toHaveBeenCalledWith(
            expect.objectContaining({
                field: "caption",
                inputTokens: 1000,
                outputTokens: 10,
                neurons: 32,
                neuronsEstimated: true,
                durationMs: expect.any(Number),
            }),
        );
    });

    it("suggests an alt text for a saved image from its thumbnail and unsaved caption", async () => {
        fetchMock.mockResolvedValue(
            aiAnswer(
                "Image de charpente en bambou éclairée par des lampes chaudes.",
            ),
        );
        const media = {
            id: 9,
            mediaType: "image",
            mimeType: "image/jpeg",
            filename: "toiture.jpg",
            caption: "Ancienne légende",
            project: 3,
            sizes: { thumbnail: { filename: "toiture-600x400.jpg" } },
        };
        const { body, storageHandler, findByID } = await call({
            data: { field: "alt", id: 9, caption: "Toiture en bambou de nuit" },
            media,
        });

        expect(body).toEqual({
            text: "Charpente en bambou éclairée par des lampes chaudes.",
            source: "ai",
        });
        expect(storageHandler).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                params: {
                    collection: "media",
                    filename: "toiture-600x400.jpg",
                },
            }),
        );
        expect(findByID).toHaveBeenCalledWith(
            expect.objectContaining({ collection: "projects", id: 3 }),
        );
        const sent = sentBody();
        expect(sent.messages[0].content).toContain("texte alternatif");
        const prompt: string = sent.messages[1].content[0].text;
        expect(prompt).toContain("« Toiture en bambou de nuit »");
        expect(prompt).not.toContain("Ancienne légende");
    });

    it("falls back on timeout", async () => {
        fetchMock.mockRejectedValue(
            Object.assign(new Error("timed out"), { name: "TimeoutError" }),
        );
        const { body } = await call({
            data: { field: "caption" },
            file: newImage(),
        });
        expect(body).toEqual({
            text: "",
            source: "fallback",
            reason: "timeout",
        });
    });
});

describe("Suggestion cache", () => {
    const savedMedia = {
        id: 9,
        mediaType: "image",
        mimeType: "image/jpeg",
        filename: "toiture.jpg",
        updatedAt: "2026-06-09T15:00:00.000Z",
        sizes: { thumbnail: { filename: "toiture-600x400.jpg" } },
    };

    it("reuses the answer for the same image, field and context", async () => {
        fetchMock.mockImplementation(async () => aiAnswer("Toiture en bambou"));
        const first = await call({
            data: { field: "caption", id: 9 },
            media: savedMedia,
        });
        const second = await call({
            data: { field: "caption", id: 9 },
            media: savedMedia,
        });
        expect(first.body).toEqual({ text: "Toiture en bambou", source: "ai" });
        expect(second.body).toEqual({
            text: "Toiture en bambou",
            source: "ai",
            cached: true,
        });
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(second.storageHandler).not.toHaveBeenCalled();
    });

    it("reuses the answer for the same new file", async () => {
        fetchMock.mockImplementation(async () => aiAnswer("Toiture en bambou"));
        await call({ data: { field: "caption" }, file: newImage() });
        const second = await call({
            data: { field: "caption" },
            file: newImage(),
        });
        expect(second.body.cached).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("asks again for the alt text once the caption changed", async () => {
        fetchMock.mockImplementation(async () =>
            aiAnswer("Charpente éclairée."),
        );
        await call({
            data: { field: "alt", id: 9, caption: "Toiture de nuit" },
            media: savedMedia,
        });
        await call({
            data: { field: "alt", id: 9, caption: "Toiture au crépuscule" },
            media: savedMedia,
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("asks again once the media was modified", async () => {
        fetchMock.mockImplementation(async () => aiAnswer("Toiture en bambou"));
        await call({ data: { field: "caption", id: 9 }, media: savedMedia });
        await call({
            data: { field: "caption", id: 9 },
            media: { ...savedMedia, updatedAt: "2026-06-10T08:00:00.000Z" },
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("does not keep fallbacks", async () => {
        fetchMock
            .mockResolvedValueOnce(
                Response.json({ errors: [] }, { status: 429 }),
            )
            .mockResolvedValueOnce(aiAnswer("Toiture en bambou"));
        const first = await call({
            data: { field: "caption" },
            file: newImage(),
        });
        const second = await call({
            data: { field: "caption" },
            file: newImage(),
        });
        expect(first.body.source).toBe("fallback");
        expect(second.body).toEqual({
            text: "Toiture en bambou",
            source: "ai",
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });
});
