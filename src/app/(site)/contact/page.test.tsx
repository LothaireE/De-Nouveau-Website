import { render } from "@testing-library/react";
import { contactPageMockData } from "@/tests/mocks/testData";
import { describe, vi, it, expect, beforeEach } from "vitest";

const mockGetPage = vi.fn();
const mockNotFound = vi.fn();

vi.mock("@/lib/payload/fetchers", () => ({
    getPage: () => mockGetPage(),
}));

vi.mock("next/navigation", () => ({
    notFound: () => mockNotFound(),
}));

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(props.src)} alt={props.alt ?? ""} />
    ),
}));

import Page from "./page";

describe("Contact Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows the address, phone and e-mail, then the social links", async () => {
        mockGetPage.mockResolvedValue(contactPageMockData);

        const { getByText, getByRole } = render(await Page());

        expect(
            getByRole("heading", { level: 1, name: "Contact" }),
        ).toBeInTheDocument();
        expect(getByText("45B Rue de la Villette")).toBeInTheDocument();
        expect(getByRole("link", { name: "+33626828153" })).toHaveAttribute(
            "href",
            "tel:+33626828153",
        );
        expect(
            getByRole("link", { name: "jean.renaud@example.com" }),
        ).toHaveAttribute("href", "mailto:jean.renaud@example.com");
        expect(getByRole("link", { name: "Instagram" })).toHaveAttribute(
            "href",
            "https://www.instagram.com/",
        );
    });

    it("keeps the details in address, phone, e-mail order", async () => {
        mockGetPage.mockResolvedValue(contactPageMockData);

        const { container } = render(await Page());

        const lines = [...container.querySelector("address")!.children].map(
            (line) => line.textContent?.trim(),
        );
        expect(lines).toEqual([
            "45B Rue de la Villette",
            "+33626828153",
            "jean.renaud@example.com",
        ]);
    });

    it.each([null, undefined, ""])(
        "drops the details group when address, phone and e-mail are %s",
        async (missingValue) => {
            mockGetPage.mockResolvedValue({
                ...contactPageMockData,
                email: missingValue,
                phone: missingValue,
                address: missingValue,
            });

            const { container, getByRole } = render(await Page());

            expect(container.querySelector("address")).not.toBeInTheDocument();
            expect(
                getByRole("link", { name: "Instagram" }),
            ).toBeInTheDocument();
        },
    );

    it("renders not found when page is not found", async () => {
        mockGetPage.mockResolvedValue(null);

        await Page();

        expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
});
