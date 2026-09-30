import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/payload-types";
import FeaturedProjects from "./FeaturedProjects";

vi.mock("@/components/media/MediaImage", () => ({
    default: () => <div data-testid="cover" />,
}));

const project = (id: number) =>
    ({
        id,
        slug: `projet-${id}`,
        title: `Projet ${id}`,
        shortDescription: `Description ${id}`,
    }) as Project;

describe("FeaturedProjects", () => {
    it("renders nothing without a selection", () => {
        const { container } = render(<FeaturedProjects projects={[]} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("shows each project with its description and a link, alternating sides", () => {
        render(<FeaturedProjects projects={[1, 2, 3].map(project)} />);

        const titles = screen.getAllByRole("heading", { level: 3 });
        expect(titles.map((title) => title.textContent)).toEqual([
            "Projet 1",
            "Projet 2",
            "Projet 3",
        ]);
        expect(screen.getByText("Description 2")).toBeInTheDocument();

        const links = screen.getAllByRole("link");
        expect(links.map((link) => link.getAttribute("href"))).toEqual([
            "/projet-1",
            "/projet-2",
            "/projet-3",
        ]);
        expect(links[1]).toHaveAccessibleName("Voir le projet Projet 2");

        const rows = screen.getAllByRole("article");
        const textSide = (row: HTMLElement) =>
            row.lastElementChild?.className.includes("md:order-1");
        expect(rows.map(textSide)).toEqual([false, true, false]);
    });
});
