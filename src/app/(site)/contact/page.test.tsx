import { render } from "@testing-library/react";
import { contactPageMockData } from "@/tests/mocks/testData";
import { describe, vi, it, expect } from "vitest";

const mockGetPage = vi.fn(); //.mockResolvedValue(aboutPageMockData);
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

describe("Contact Page", () => {
    it("renders contact page sections calling the appropriate functions", async () => {
        mockGetPage.mockResolvedValue(contactPageMockData);
        const ContactPage = await Page();

        const { getByText, getByRole } = render(ContactPage);

        expect(getByText("Mocked MediaImage Component")).toBeInTheDocument();

        expect(getByText("Contact")).toBeInTheDocument();

        expect(
            getByRole("link", { name: "jean.renaud@example.com" }),
        ).toHaveAttribute("href", "mailto:jean.renaud@example.com");

        expect(getByRole("link", { name: "+33626828153" })).toHaveAttribute(
            "href",
            "tel:+33626828153",
        );
        expect(getByText("Adresse")).toBeInTheDocument();
        expect(getByText("45B Rue de la Villette")).toBeInTheDocument();

        expect(getByText("Nous suivre")).toBeInTheDocument();

        expect(getByRole("link", { name: "Instagram" })).toHaveAttribute(
            "href",
            "https://www.instagram.com/",
        );
    });

    it("renders not found when page is not found", async () => {
        mockGetPage.mockResolvedValue(null);
        const ContactPage = await Page();

        render(ContactPage);

        expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
});
