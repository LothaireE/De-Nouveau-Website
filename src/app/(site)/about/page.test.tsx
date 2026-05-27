import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { aboutPageMockData } from "@/tests/mocks/testData";

const mockGetPage = vi.fn();
const mockNotFound = vi.fn();

const MockMediaImage = () => <div>Mocked MediaImage Component</div>;

vi.mock("@/library/payload/fetchers", () => ({
    getPage: () => mockGetPage(),
}));

vi.mock("next/navigation", () => ({
    notFound: () => mockNotFound(),
}));

vi.mock("@/components/MediaImage", () => ({
    default: () => <MockMediaImage />,
}));

import Page from "./page";

describe("About Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders about page sections calling the appropriate functions", async () => {
        mockGetPage.mockResolvedValue(aboutPageMockData);

        const AboutPage = await Page();

        const { getByText } = render(AboutPage);

        expect(getByText("Mocked MediaImage Component")).toBeInTheDocument();

        expect(getByText("Récompenses")).toBeInTheDocument();

        expect(getByText("Nos membres")).toBeInTheDocument();

        expect(
            getByText("Jean Renaud - Architecte Owner."),
        ).toBeInTheDocument();
    });

    it("renders not found when page is not found", async () => {
        mockGetPage.mockResolvedValue(null);

        await Page();

        expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
});
