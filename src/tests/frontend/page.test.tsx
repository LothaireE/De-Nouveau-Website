import "@testing-library/jest-dom";
import Page from "../../app/(site)/page";
import { render, waitFor } from "@testing-library/react";

jest.mock("@/library/payload/fetchers", () => ({
    getPage: jest.fn().mockResolvedValue({
        title: "Homepage",
    }),

    getAllProjects: jest.fn().mockResolvedValue([
        {
            id: "1",
            title: "Projet test",
        },
    ]),
}));

jest.mock("@/components/home/HomeHero", () => {
    return function MockHomeHero() {
        return <div>Lazy Loading HomeHero Component</div>;
    };
});

jest.mock("@/components/home/ProjectGallery", () => {
    return function MockProjectGallery() {
        return <div>Lazy Loading ProjectGallery Component</div>;
    };
});

describe("Homepage", () => {
    it("renders homepage sections", async () => {
        const Homepage = await Page();

        const { getByText } = render(Homepage);

        await waitFor(() =>
            expect(
                getByText("Lazy Loading HomeHero Component"),
            ).toBeInTheDocument(),
        );
        await waitFor(() =>
            expect(
                getByText("Lazy Loading ProjectGallery Component"),
            ).toBeInTheDocument(),
        );
    });
});
