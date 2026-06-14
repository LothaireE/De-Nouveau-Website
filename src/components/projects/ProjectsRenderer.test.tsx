import { render, screen } from "@testing-library/react";
import { ProjectRenderer } from "./ProjectsRenderer";
import { vi, it, describe, expect } from "vitest";
import { Project } from "@/payload-types";

const MockDefaultProjectLayout = ({ project }: { project: Project }) => (
    <div data-testid="default-layout">{project.title}</div>
);

const MockEditorialProjectLayout = ({ project }: { project: Project }) => (
    <div data-testid="editorial-layout">{project.title}</div>
);

const MockGalleryFocusedProjectLayout = ({ project }: { project: Project }) => (
    <div data-testid="gallery-focused-layout">{project.title}</div>
);

const MockMinimalProjectLayout = ({ project }: { project: Project }) => (
    <div data-testid="minimal-layout">{project.title}</div>
);

vi.mock("./layouts/DefaultProjectLayout", () => ({
    default: ({ project }: { project: Project }) => (
        <MockDefaultProjectLayout project={project} />
    ),
}));

vi.mock("./layouts/EditorialProjectLayout", () => ({
    default: ({ project }: { project: Project }) => (
        <MockEditorialProjectLayout project={project} />
    ),
}));

vi.mock("./layouts/GalleryFocusedProjectLayout", () => ({
    default: ({ project }: { project: Project }) => (
        <MockGalleryFocusedProjectLayout project={project} />
    ),
}));

vi.mock("./layouts/MinimalProjectLayout", () => ({
    default: ({ project }: { project: Project }) => (
        <MockMinimalProjectLayout project={project} />
    ),
}));

const baseProject: Partial<Project> = {
    id: 1,
    title: "Test Project",
};

describe("ProjectRenderer Component", () => {
    it("Calls DefaultProjectLayout when project has default project layout props", () => {
        const { getByTestId } = render(
            <ProjectRenderer
                project={
                    { ...baseProject, projectLayout: "default" } as Project
                }
            />,
        );

        expect(getByTestId("default-layout")).toBeInTheDocument();
        expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("Calls EditorialProjectLayout when project has editorial project layout props", () => {
        const { getByTestId } = render(
            <ProjectRenderer
                project={
                    { ...baseProject, projectLayout: "editorial" } as Project
                }
            />,
        );

        expect(getByTestId("editorial-layout")).toBeInTheDocument();
        expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("Calls GalleryFocusedPjectLayout when project has gallery focused layout props", () => {
        const { getByTestId } = render(
            <ProjectRenderer
                project={
                    {
                        ...baseProject,
                        projectLayout: "galleryFocused",
                    } as Project
                }
            />,
        );

        expect(getByTestId("gallery-focused-layout")).toBeInTheDocument();
        expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("Calls MinimalProjectLayout when project has minimal project layout props", () => {
        const { getByTestId } = render(
            <ProjectRenderer
                project={
                    { ...baseProject, projectLayout: "minimal" } as Project
                }
            />,
        );

        expect(getByTestId("minimal-layout")).toBeInTheDocument();
        expect(screen.getByText("Test Project")).toBeInTheDocument();
    });

    it("Calls DefaultProjectLayout when project does not have layout props", () => {
        const { getByTestId } = render(
            <ProjectRenderer project={{ ...baseProject } as Project} />,
        );

        expect(getByTestId("default-layout")).toBeInTheDocument();
        expect(screen.getByText("Test Project")).toBeInTheDocument();
    });
});
