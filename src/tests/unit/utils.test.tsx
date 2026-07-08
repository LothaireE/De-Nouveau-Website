import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { getMediaUrl } from "@/library/utils";

describe("getMediaUrl", () => {
    const originalEnv = process.env.NEXT_PUBLIC_S3_PUBLIC_DEV_URL;

    beforeEach(() => {
        process.env.NEXT_PUBLIC_S3_PUBLIC_DEV_URL = "https://cdn.example.com";
    });

    afterEach(() => {
        process.env.NEXT_PUBLIC_S3_PUBLIC_DEV_URL = originalEnv;
    });

    it("returns null when filename is null", () => {
        expect(getMediaUrl(null)).toBeNull();
    });

    it("returns null when NEXT_PUBLIC_S3_PUBLIC_DEV_URL is not defined", () => {
        delete process.env.NEXT_PUBLIC_S3_PUBLIC_DEV_URL;

        expect(getMediaUrl("image.webp")).toBeNull();
    });

    it("builds the media url correctly", () => {
        expect(getMediaUrl("image.webp")).toBe(
            "https://cdn.example.com/media/image.webp",
        );
    });

    it("encodes special characters in filename", () => {
        expect(getMediaUrl("mon image été.webp")).toBe(
            "https://cdn.example.com/media/mon%20image%20%C3%A9t%C3%A9.webp",
        );
    });
});
