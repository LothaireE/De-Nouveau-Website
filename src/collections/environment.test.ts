import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

// Load the collections as they would be built from a given project folder.
async function loadCollections(withGuardFile: boolean) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "collections-"));
    if (withGuardFile)
        fs.writeFileSync(
            path.join(dir, ".refactor-isolation.json"),
            JSON.stringify({ databaseHost: "dedicated.example.com" }),
        );
    vi.spyOn(process, "cwd").mockReturnValue(dir);
    vi.stubEnv("PAYLOAD_MEDIA_READ_ONLY", "");
    vi.resetModules();
    const { Media } = await import("./Media");
    const { Projects } = await import("./Projects");
    const { protectSharedMedia } = await import("@/hooks/readOnlyMedia");
    const { assignProjectToMedia } = await import("@/library/payload/hooks");
    return { Media, Projects, protectSharedMedia, assignProjectToMedia };
}

afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

describe("Collections per environment", () => {
    it("blocks media writes and media linking in the refactor worktree", async () => {
        const { Media, Projects, protectSharedMedia, assignProjectToMedia } =
            await loadCollections(true);

        expect(Media.access?.create?.({} as never)).toBe(false);
        expect(Media.hooks?.beforeOperation).toContain(protectSharedMedia);
        expect(Projects.hooks?.afterChange).not.toContain(assignProjectToMedia);
    });

    it("restores normal media behavior in the original project", async () => {
        const { Media, Projects, protectSharedMedia, assignProjectToMedia } =
            await loadCollections(false);

        expect(Media.access).toBeUndefined();
        expect(Media.hooks?.beforeOperation).not.toContain(protectSharedMedia);
        expect(Projects.hooks?.afterChange?.[0]).toBe(assignProjectToMedia);
    });
});
