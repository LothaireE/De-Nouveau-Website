import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/payload-types";
import { ProjectRenderer } from "./ProjectsRenderer";

const { stub } = vi.hoisted(() => ({
    stub: (testId: string) => ({
        default: ({ project }: { project: Project }) => (
            <div data-testid={testId}>{project.title}</div>
        ),
    }),
}));

vi.mock("./layouts/DefaultProjectLayout", () => stub("default-layout"));
vi.mock("./layouts/EditorialProjectLayout", () => stub("editorial-layout"));
vi.mock("./layouts/GalleryFocusedProjectLayout", () =>
    stub("gallery-focused-layout"),
);
vi.mock("./layouts/MinimalProjectLayout", () => stub("minimal-layout"));
vi.mock("./ProjectHero", () => stub("hero"));
vi.mock("./ProjectSummary", () => stub("summary"));
vi.mock("./ProjectPlans", () => stub("plans"));
vi.mock("./NextProject", () => stub("next"));

const baseProject = { id: 1, title: "Test Project" } as Project;

describe("ProjectRenderer", () => {
    it.each([
        ["default", "default-layout"],
        ["editorial", "editorial-layout"],
        ["galleryFocused", "gallery-focused-layout"],
        ["minimal", "minimal-layout"],
    ] as const)("uses the %s gallery layout", (projectLayout, testId) => {
        render(<ProjectRenderer project={{ ...baseProject, projectLayout }} />);

        expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    it("falls back to the default gallery layout", () => {
        render(<ProjectRenderer project={baseProject} />);

        expect(screen.getByTestId("default-layout")).toBeInTheDocument();
    });

    it("wraps the gallery with the shared hero, summary and plans, in order", () => {
        const { container } = render(<ProjectRenderer project={baseProject} />);

        const order = [...container.querySelectorAll("[data-testid]")].map(
            (element) => element.getAttribute("data-testid"),
        );
        expect(order).toEqual(["hero", "summary", "default-layout", "plans"]);
    });

    it("links to the next project only when there is one", () => {
        const next = { id: 2, title: "Suivant" } as Project;
        render(<ProjectRenderer project={baseProject} nextProject={next} />);

        expect(screen.getByTestId("next")).toHaveTextContent("Suivant");
    });
});
