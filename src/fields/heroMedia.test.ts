import { describe, expect, it, vi } from "vitest";
import type { UploadField, Validate } from "payload";
import { HERO_VIDEO_MAX_BYTES, validateHeroMedia } from "./heroMedia";
import { Media } from "@/collections/Media";

type Options = Parameters<Validate<unknown, unknown, unknown, UploadField>>[1];

const optionsFor = (
    media: unknown,
    event: "onChange" | "submit" = "submit",
) => {
    const findByID = vi.fn().mockResolvedValue(media);
    const options = {
        event,
        relationTo: "media",
        req: {
            payload: {
                findByID,
                collections: { media: { customIDType: undefined } },
                db: { defaultIDType: "number" },
            },
            t: (key: string) => key,
        },
    } as unknown as Options;
    return { findByID, options };
};

describe("Hero media validation", () => {
    it("refuses a hero video heavier than 4 MB with a clear message", async () => {
        const { options } = optionsFor({
            mediaType: "video",
            filesize: 6.5 * 1024 * 1024,
        });

        expect(await validateHeroMedia(12, options)).toBe(
            "Cette vidéo pèse 6,5 Mo : la vidéo d’en-tête ne doit pas dépasser 4 Mo. Choisissez une vidéo plus légère ou une image.",
        );
    });

    it("accepts a 4 MB video and a heavy image", async () => {
        for (const media of [
            { mediaType: "video", filesize: HERO_VIDEO_MAX_BYTES },
            { mediaType: "image", filesize: 30 * 1024 * 1024 },
        ]) {
            const { options } = optionsFor(media);
            expect(await validateHeroMedia(3, options)).toBe(true);
        }
    });

    it("does not query the database while the field is being edited", async () => {
        const { findByID, options } = optionsFor(
            { mediaType: "video", filesize: 10 * 1024 * 1024 },
            "onChange",
        );

        expect(await validateHeroMedia(12, options)).toBe(true);
        expect(findByID).not.toHaveBeenCalled();
    });
});

describe("Media admin", () => {
    it("lists media by file name and keeps the project link read-only", () => {
        const project = Media.fields.find(
            (field) => "name" in field && field.name === "project",
        );

        expect(Media.admin?.useAsTitle).toBe("filename");
        expect(project).toMatchObject({ admin: { readOnly: true } });
    });
});
