import {
    formatSlug,
    getMediaId,
    assignProjectToMedia,
} from "@/library/payload/hooks";
import { describe, expect, it, vi } from "vitest";
import type { FieldHookArgs, CollectionAfterChangeHook } from "payload";
import { Media } from "@/payload-types";

describe("test function formatSlug", () => {
    it("formats title correctly", () => {
        const hook = formatSlug("title"); // beforeValidate hook

        const args: Partial<FieldHookArgs> = {
            value: "",
            data: {
                title: "Maison Contemporaine",
            },
            operation: "create",
        };

        const result = hook(args as FieldHookArgs);

        expect(result).toBe("maison-contemporaine");
    });
});

describe("test function getMediaId", () => {
    it("returns media id from media object", () => {
        const image = {
            id: 12345,
        } as Media;

        const result = getMediaId(image);

        expect(result).toBe(12345);
    });

    it("returns media id from number", () => {
        const image = 12345;
        const result = getMediaId(image);

        expect(result).toBe(12345);
    });

    it("returns media id from string", () => {
        const image = "12345";
        const result = getMediaId(image);

        expect(result).toBe("12345");
    });

    it("returns null if image is null", () => {
        const image = null;
        const result = getMediaId(image);

        expect(result).toBeNull();
    });
});

type HookArgs = Parameters<CollectionAfterChangeHook>[0];

describe("test function assignProjectToMedia", () => {
    it("should skip and return doc if context.skipProjectGalleryHook is true", async () => {
        const doc = {
            id: "project1",
            coverImage: 1,
            plans: [{ media: 2 }],
            galleryMedia: [{ media: 3 }],
        };

        const req = {
            payload: {
                findByID: vi.fn(),
                update: vi.fn(),
            },
        };

        const result = await assignProjectToMedia({
            doc,
            context: { skipProjectGalleryHook: true },
        } as unknown as HookArgs);

        expect(result).toBe(doc);
        expect(req.payload.findByID).toHaveBeenCalledTimes(0);
        expect(req.payload.update).toHaveBeenCalledTimes(0);
    });

    it("should assign project to media without project", async () => {
        const doc = {
            id: 19,
            coverImage: { id: 1 },
            plans: [{ media: { id: 2 } }],
            galleryMedia: [{ media: { id: 3 } }, { media: { id: 4 } }],
        };
        const req = {
            payload: {
                findByID: vi.fn().mockResolvedValue({ id: 1, project: null }),
                update: vi.fn().mockResolvedValue({ id: 1, project: 19 }),
            },
        };

        const result = await assignProjectToMedia({
            doc,
            req,
            context: {},
        } as unknown as HookArgs);

        expect(result).toBe(doc);
        expect(req.payload.findByID).toHaveBeenCalledTimes(4);
        expect(req.payload.update).toHaveBeenCalledTimes(4);

        expect(req.payload.update).toHaveBeenCalledWith({
            collection: "media",
            id: 1,
            depth: 0,
            overrideAccess: true,
            req: req,
            context: {
                skipProjectGalleryHook: true,
            },
            data: {
                project: 19,
            },
        });
    });

    it("should not assign project to media that already has a project assigned", async () => {
        const doc = {
            id: 20,
            coverImage: { id: 1, project: 20 },
            plans: null,
            galleryMedia: [],
        };
        const req = {
            payload: {
                findByID: vi.fn().mockResolvedValue({ id: 1, project: 20 }),
                update: vi.fn(), //.mockResolvedValue({ id: 1, project: 20 }),
            },
        };

        const result = await assignProjectToMedia({
            doc,
            req,
            context: {},
        } as unknown as HookArgs);

        expect(result).toBe(doc);
        expect(req.payload.findByID).toHaveBeenCalledTimes(1);
        expect(req.payload.update).toHaveBeenCalledTimes(0);
    });

    it("should assign project to media with null project and skip media with project assigned", async () => {
        const doc = {
            id: 21,
            coverImage: { id: 1, project: null },
            plans: [{ media: { id: 2, project: 21 } }],

            galleryMedia: [
                { media: { id: 3, project: null } },
                { media: { id: 4, project: 21 } },
            ],
        };

        const req = {
            payload: {
                findByID: vi.fn(({ id }) => {
                    const medias = {
                        1: { id: 1, project: null },
                        2: { id: 2, project: 21 },
                        3: { id: 3, project: null },
                        4: { id: 4, project: 21 },
                    };
                    return Promise.resolve(medias[id as keyof typeof medias]);
                }),
                update: vi.fn().mockResolvedValue({}),
            },
        };

        await assignProjectToMedia({
            doc,
            req,
            context: {},
            collection: {} as HookArgs["collection"],
            data: {},
            operation: "update",
            previousDoc: {}, //as HookArgs["previousDoc"],
        } as unknown as HookArgs);

        expect(req.payload.findByID).toHaveBeenCalledTimes(4);
        expect(req.payload.update).toHaveBeenCalledTimes(2);

        expect(req.payload.update).toHaveBeenCalledWith({
            collection: "media",
            id: 1,
            data: {
                project: 21,
            },
            context: {
                skipProjectGalleryHook: true,
            },
            depth: 0,
            overrideAccess: true,
            req: req,
        });

        expect(req.payload.update).toHaveBeenCalledWith({
            collection: "media",
            id: 3,
            data: {
                project: 21,
            },
            context: {
                skipProjectGalleryHook: true,
            },
            depth: 0,
            overrideAccess: true,
            req: req,
        });

        expect(req.payload.update).not.toHaveBeenCalledWith({
            collection: "media",
            id: 2,
            data: {
                project: 21,
            },
            context: {
                skipProjectGalleryHook: true,
            },
            depth: 0,
            overrideAccess: true,
            req: req,
        });

        expect(req.payload.update).not.toHaveBeenCalledWith({
            collection: "media",
            id: 4,
            data: {
                project: 21,
            },
            context: {
                skipProjectGalleryHook: true,
            },
            depth: 0,
            overrideAccess: true,
            req: req,
        });
    });
});
