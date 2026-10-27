import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Page as PageContent, Project } from "@/payload-types";

import Page from "../../app/(site)/page";

const { project } = vi.hoisted(() => ({
    project: (id: number) =>
        ({ id, slug: `projet-${id}`, title: `Projet ${id}` }) as Project,
}));

vi.mock("@/lib/payload/fetchers", () => ({
    getPage: vi.fn().mockResolvedValue({
        title: "Homepage",
    }),
    getFeaturedProjects: vi.fn().mockResolvedValue([project(2), project(3)]),
    getAllProjects: vi.fn().mockResolvedValue([1, 2, 3, 4].map(project)),
}));

vi.mock("@/components/LoadingLogo", () => ({
    default: function MockLoadingLogo() {
        return <div>Loading...</div>;
    },
}));

vi.mock("@/components/home/HomeHero", () => ({
    default: function MockHomeHero({
        content,
    }: {
        content: PageContent | null;
    }) {
        return <div>Hero: {content?.title}</div>;
    },
}));

vi.mock("@/components/home/ProjectGrid", () => ({
    default: function MockProjectGrid({ projects }: { projects: Project[] }) {
        return <div>Grid: {projects.map((p) => p.title).join(", ")}</div>;
    },
}));

describe("Homepage", () => {
    it("passes the home page content to the hero", async () => {
        const { findByText } = render(await Page());

        expect(await findByText("Hero: Homepage")).toBeInTheDocument();
    });

    it("lists every project in the grid, featured ones first", async () => {
        const { findByText } = render(await Page());

        expect(
            await findByText("Grid: Projet 2, Projet 3, Projet 1, Projet 4"),
        ).toBeInTheDocument();
    });
});
