import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/payload-types";
import ProjectGrid from "./ProjectGrid";

vi.mock("@/components/media/MediaImage", () => ({
    default: () => <div data-testid="cover" />,
}));

const project = (id: number) =>
    ({
        id,
        slug: `projet-${id}`,
        title: `Projet ${id}`,
        shortDescription: `Description ${id}`,
        projectStatus: "concept",
        year: 2026,
    }) as Project;

describe("ProjectGrid", () => {
    it("renders nothing without projects", () => {
        const { container } = render(<ProjectGrid projects={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("captions each tile with title, description, status and year", () => {
        render(<ProjectGrid projects={[project(1), project(2)]} />);

        const links = screen.getAllByRole("link");
        expect(links.map((link) => link.getAttribute("href"))).toEqual([
            "/projet-1",
            "/projet-2",
        ]);
        expect(
            screen.getByRole("heading", { name: "Projet 1 — Description 1" }),
        ).toBeInTheDocument();
        expect(screen.getAllByText("Concept")).toHaveLength(2);
    });

    it("makes every fifth tile and any lone last tile full width", () => {
        render(<ProjectGrid projects={[1, 2, 3, 4, 5, 6].map(project)} />);

        const wide = screen
            .getAllByRole("link")
            .map((link) => link.className.includes("md:col-span-2"));
        expect(wide).toEqual([false, false, false, false, true, true]);
    });
});
