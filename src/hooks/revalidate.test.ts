import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PayloadRequest } from "payload";
const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath }));
import { revalidateProject, revalidateGlobal } from "./revalidate";
describe("Local revalidation", () => {
    beforeEach(() => vi.clearAllMocks());
    it("invalidates old and new project URLs and shared navigation", () => {
        const req = {
            context: {},
            payload: { logger: { warn: vi.fn() } },
        } as unknown as PayloadRequest;
        revalidateProject({
            doc: { slug: "new" },
            previousDoc: { slug: "old" },
            req,
        } as Parameters<typeof revalidateProject>[0]);
        expect(revalidatePath).toHaveBeenCalledWith("/old", undefined);
        expect(revalidatePath).toHaveBeenCalledWith("/new", undefined);
        expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
        expect(revalidatePath).toHaveBeenCalledWith("/sitemap.xml", undefined);
    });
    it("does not revalidate while copying content outside Next.js", () => {
        const hook = revalidateGlobal("/");
        hook({
            doc: {},
            req: { context: { disableRevalidate: true } },
        } as unknown as Parameters<typeof hook>[0]);
        expect(revalidatePath).not.toHaveBeenCalled();
    });
});
