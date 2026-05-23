import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Page from "../../app/(site)/page";

vi.mock("@/library/payload/fetchers", () => ({
    getPage: vi.fn().mockResolvedValue({
        title: "Homepage",
    }),

    getAllProjects: vi.fn().mockResolvedValue([
        {
            id: "1",
            title: "Projet test",
        },
    ]),
}));

vi.mock("@/components/home/HomeHero", () => ({
    default: function MockHomeHero() {
        return <div>Lazy Loading HomeHero Component</div>;
    },
}));

vi.mock("@/components/home/ProjectGallery", () => ({
    default: function MockProjectGallery() {
        return <div>Lazy Loading ProjectGallery Component</div>;
    },
}));

describe("Homepage", () => {
    it("renders homepage sections calling the appropriate functions", async () => {
        const Homepage = await Page();

        const { findByText } = render(Homepage);

        expect(
            await findByText("Lazy Loading HomeHero Component"),
        ).toBeInTheDocument();

        expect(
            await findByText("Lazy Loading ProjectGallery Component"),
        ).toBeInTheDocument();
    });
});
