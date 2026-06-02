import { render } from "@testing-library/react";
import { describe, vi, it, expect } from "vitest";
import { singleProjectMockData } from "@/tests/mocks/testData";

const mockGetSingleProject = vi.fn(); //.mockResolvedValue(aboutSingleProjectMockData);
const mockNotFound = vi.fn();

vi.mock("@/library/payload/fetchers", () => ({
    getSingleProject: () => mockGetSingleProject(),
}));

vi.mock("next/navigation", () => ({
    notFound: () => mockNotFound(),
}));

import Page from "./page";

describe("[slug] - Project Page", () => {
    it("renders the ProjectRenderer component", async () => {
        mockGetSingleProject.mockResolvedValue(singleProjectMockData);
        const ProjectPage = await Page({
            params: Promise.resolve({ slug: "concours-bambou-u" }),
        });

        const { getByText, getByRole, getAllByRole } = render(ProjectPage);

        expect(
            getByRole("heading", { level: 1, name: "Concours Bambou U" }),
        ).toBeInTheDocument();

        const images = getAllByRole("img");
        expect(images[0]).toHaveAttribute("alt", "Toiture en bambou");
        expect(images.length).toBe(8);

        expect(
            getByText(
                "The project reinterprets the traditional Balinese Bale typology through four modular pavilions arranged around a central courtyard, with local materials and contemporary construction methods adapted to low-income communities.",
            ),
        ).toBeInTheDocument();

        // expect(container.getElementsByClassName("rich-text").length).toBe(1);

        expect(getByText("Bali, Indonesia")).toBeInTheDocument();
    });

    it("renders not found when project is not found", async () => {
        mockGetSingleProject.mockResolvedValue(null);
        const ProjectPage = await Page({
            params: Promise.resolve({ slug: "unexistant-project" }),
        });

        render(ProjectPage);

        expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
});
