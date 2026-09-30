import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HomePage } from "@/payload-types";
const { find } = vi.hoisted(() => ({ find: vi.fn() }));
vi.mock("./payload", () => ({ getPayloadClient: async () => ({ find }) }));
import { getFeaturedProjects } from "./featuredProjects";
const publicProject = (id: number) => ({
    id,
    title: `Project ${id}`,
    _status: "published",
    visibility: "show",
});
describe("Homepage featured projects", () => {
    beforeEach(() => vi.resetAllMocks());
    it("returns no featured project when nothing is selected", async () => {
        expect(await getFeaturedProjects([])).toEqual([]);
        expect(await getFeaturedProjects(undefined)).toEqual([]);
        expect(find).not.toHaveBeenCalled();
    });
    it("preserves the chosen order rather than database order", async () => {
        find.mockResolvedValue({
            docs: [publicProject(1), publicProject(3), publicProject(2)],
        });
        const result = await getFeaturedProjects([
            { project: 3 },
            { project: 1 },
            { project: 2 },
        ]);
        expect(result.map((project) => project.id)).toEqual([3, 1, 2]);
        expect(find).toHaveBeenCalledWith(
            expect.objectContaining({
                draft: false,
                limit: 3,
                where: {
                    and: [
                        { id: { in: [3, 1, 2] } },
                        { _status: { equals: "published" } },
                        { visibility: { equals: "show" } },
                    ],
                },
            }),
        );
    });
    it("excludes drafts, hidden projects and missing references without replacing them", async () => {
        find.mockResolvedValue({
            docs: [
                { ...publicProject(1), _status: "draft" },
                { ...publicProject(2), visibility: "hidden" },
            ],
        });
        expect(
            await getFeaturedProjects([
                { project: 1 },
                { project: 2 },
                { project: 3 },
            ]),
        ).toEqual([]);
    });
    it("handles deleted references without showing other projects", async () => {
        expect(await getFeaturedProjects([{ project: null }])).toEqual([]);
        expect(find).not.toHaveBeenCalled();
    });
    it("deduplicates and caps inconsistent stored selections defensively", async () => {
        find.mockResolvedValue({ docs: [1, 2, 3, 4].map(publicProject) });
        const rows = [1, 1, 2, 3, 4].map((project) => ({
            project,
        })) as HomePage["featuredProjects"];
        expect(
            (await getFeaturedProjects(rows)).map((project) => project.id),
        ).toEqual([1, 2, 3]);
    });
});
