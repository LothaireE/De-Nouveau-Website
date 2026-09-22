import { render } from "@testing-library/react";
import { contactPageMockData } from "@/tests/mocks/testData";
import { describe, vi, it, expect } from "vitest";

const mockGetPage = vi.fn();
const mockNotFound = vi.fn();

const MockMediaImage = () => <div>Mocked MediaImage Component</div>;

vi.mock("@/library/payload/fetchers", () => ({
    getPage: () => mockGetPage(),
}));

vi.mock("next/navigation", () => ({
    notFound: () => mockNotFound(),
}));

vi.mock("@/components/media/MediaImage", () => ({
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

    it.each([null, undefined, ""])(
        "hides the contact block when both contact details are %s",
        async (missingValue) => {
            mockGetPage.mockResolvedValue({
                ...contactPageMockData,
                email: missingValue,
                phone: missingValue,
            });

            const { queryByText, queryByRole, getByText, container } = render(
                await Page(),
            );

            expect(queryByText("Contact")).not.toBeInTheDocument();
            expect(
                queryByRole("link", { name: contactPageMockData.email! }),
            ).not.toBeInTheDocument();
            expect(
                queryByRole("link", { name: contactPageMockData.phone! }),
            ).not.toBeInTheDocument();
            expect(getByText("Adresse")).toBeInTheDocument();
            expect(getByText("Nous suivre")).toBeInTheDocument();
            expect(container.querySelector("p:empty")).not.toBeInTheDocument();
        },
    );

    it.each([
        {
            email: "hello@example.com",
            phone: null,
            name: "hello@example.com",
            href: "mailto:hello@example.com",
        },
        {
            email: null,
            phone: "+33 6 26 82 81 53",
            name: "+33 6 26 82 81 53",
            href: "tel:+33626828153",
        },
    ])(
        "keeps the contact block with only $name",
        async ({ email, phone, name, href }) => {
            mockGetPage.mockResolvedValue({
                ...contactPageMockData,
                email,
                phone,
            });

            const { getByText, getByRole } = render(await Page());

            expect(getByText("Contact")).toBeInTheDocument();
            expect(getByRole("link", { name })).toHaveAttribute("href", href);
        },
    );

    it("renders not found when page is not found", async () => {
        mockGetPage.mockResolvedValue(null);
        const ContactPage = await Page();

        render(ContactPage);

        expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
});
