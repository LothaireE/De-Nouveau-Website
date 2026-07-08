import {
    formatSlug,
    getMediaId,
    assignProjectToMedia,
    assignMediatype,
    preventDuplicateFilename,
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

type MockArgs = Parameters<typeof assignMediatype>[0];

describe("assignMediatype", () => {
    it("should assign image mediaType", () => {
        const args: MockArgs = {
            data: {},
            req: {
                file: {
                    mimetype: "image/webp",
                    size: 1000,
                },
            },
        } as MockArgs;

        const result = assignMediatype(args);

        expect(result.mediaType).toBe("image");
    });

    it("should assign video mediaType", () => {
        const args: MockArgs = {
            data: {},
            req: {
                file: {
                    mimetype: "video/mp4",
                    size: 1024,
                },
            },
        } as MockArgs;

        const result = assignMediatype(args);

        expect(result.mediaType).toBe("video");
    });

    it("should throw when video exceeds 4MB", () => {
        expect(() =>
            assignMediatype({
                data: {},
                req: {
                    file: {
                        mimetype: "video/mp4",
                        size: 5 * 1024 * 1024,
                    },
                },
            } as MockArgs),
        ).toThrow("la vidéo ne doit pas depasser 4MB.");
    });

    it("should return data unchanged when no mimeType is available", () => {
        const data = {
            title: "test",
        };

        const result = assignMediatype({
            data,
            req: {},
        } as unknown as MockArgs);

        expect(result).toEqual(data);
    });
});

type PreventDuplicateFilenameArgs = Parameters<
    typeof preventDuplicateFilename
>[0];

describe("preventDuplicateFilename", () => {
    it("should do nothing when operation is not create or update", async () => {
        const req = {
            file: {
                name: "image.jpg",
            },
            payload: {
                find: vi.fn(),
            },
        };

        await preventDuplicateFilename({
            req,
            operation: "delete",
        } as unknown as PreventDuplicateFilenameArgs);

        expect(req.payload.find).not.toHaveBeenCalled();
    });

    it("should do nothing when there is no file", async () => {
        const req = {
            payload: {
                find: vi.fn(),
            },
        };

        await preventDuplicateFilename({
            req,
            operation: "create",
        } as unknown as PreventDuplicateFilenameArgs);

        expect(req.payload.find).not.toHaveBeenCalled();
    });

    it("should check existing media by filename", async () => {
        const req = {
            file: {
                name: "image.jpg",
            },
            payload: {
                find: vi.fn().mockResolvedValue({
                    totalDocs: 0,
                    docs: [],
                }),
            },
        };

        await preventDuplicateFilename({
            req,
            operation: "create",
        } as unknown as PreventDuplicateFilenameArgs);

        expect(req.payload.find).toHaveBeenCalledWith({
            collection: "media",
            where: {
                filename: {
                    equals: "image.jpg",
                },
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
        });
    });

    it("should throw when filename already exists", async () => {
        const req = {
            file: {
                name: "image.jpg",
            },
            payload: {
                find: vi.fn().mockResolvedValue({
                    totalDocs: 1,
                    docs: [{ id: 1, filename: "image.jpg" }],
                }),
            },
        };

        await expect(
            preventDuplicateFilename({
                req,
                operation: "create",
            } as unknown as PreventDuplicateFilenameArgs),
        ).rejects.toThrow(
            `Un média nommé "image.jpg" existe déjà, utilisez le média existant ou renommez votre fichier avant de l'importer.`,
        );
    });

    it("should allow same media content with a different filename", async () => {
        const req = {
            file: {
                name: "image-renamed.jpg",
            },
            payload: {
                find: vi.fn().mockResolvedValue({
                    totalDocs: 0,
                    docs: [],
                }),
            },
        };

        await expect(
            preventDuplicateFilename({
                req,
                operation: "create",
            } as unknown as PreventDuplicateFilenameArgs),
        ).resolves.toBeUndefined();

        expect(req.payload.find).toHaveBeenCalledWith({
            collection: "media",
            where: {
                filename: {
                    equals: "image-renamed.jpg",
                },
            },
            limit: 1,
            depth: 0,
            overrideAccess: true,
        });
    });
});
