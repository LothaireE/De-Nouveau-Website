import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HomePage } from "@/payload-types";
const { find, getAllProjects } = vi.hoisted(() => ({
    find: vi.fn(),
    getAllProjects: vi.fn(),
}));
vi.mock("./payload", () => ({ getPayloadClient: async () => ({ find }) }));
vi.mock("./projects", () => ({ getAllProjects }));
import { getHomeProjects } from "./featuredProjects";
const publicProject = (id: number) => ({
    id,
    title: `Project ${id}`,
    _status: "published",
    visibility: "show",
});
describe("Homepage featured projects", () => {
    beforeEach(() => vi.resetAllMocks());
    it("keeps the usual gallery when no selection exists", async () => {
        getAllProjects.mockResolvedValue([publicProject(4)]);
        expect(await getHomeProjects([])).toEqual([publicProject(4)]);
        expect(find).not.toHaveBeenCalled();
    });
    it("preserves the chosen order rather than database order", async () => {
        find.mockResolvedValue({
            docs: [publicProject(1), publicProject(3), publicProject(2)],
        });
        const result = await getHomeProjects([
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
            await getHomeProjects([
                { project: 1 },
                { project: 2 },
                { project: 3 },
            ]),
        ).toEqual([]);
        expect(getAllProjects).not.toHaveBeenCalled();
    });
    it("handles deleted references without reverting to the full gallery", async () => {
        expect(await getHomeProjects([{ project: null }])).toEqual([]);
        expect(find).not.toHaveBeenCalled();
        expect(getAllProjects).not.toHaveBeenCalled();
    });
    it("deduplicates and caps inconsistent stored selections defensively", async () => {
        find.mockResolvedValue({ docs: [1, 2, 3, 4].map(publicProject) });
        const rows = [1, 1, 2, 3, 4].map((project) => ({
            project,
        })) as HomePage["featuredProjects"];
        expect(
            (await getHomeProjects(rows)).map((project) => project.id),
        ).toEqual([1, 2, 3]);
    });
});
