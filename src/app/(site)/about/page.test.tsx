import { render, within } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { aboutPageMockData } from "@/tests/mocks/testData";

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

vi.mock("@/components/media/MediaImage", () => ({
    default: () => <div>Mocked MediaImage Component</div>,
}));

vi.mock("@payloadcms/richtext-lexical/react", () => ({
    RichText: () => <p>Texte de présentation</p>,
}));

import Page from "./page";

describe("About Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("opens with the large logo and the presentation text, then the photo", async () => {
        mockGetPage.mockResolvedValue(aboutPageMockData);

        const { getByRole, getByText } = render(await Page());

        expect(
            getByRole("heading", { level: 1, name: "À propos" }),
        ).toBeInTheDocument();
        expect(
            getByRole("link", { name: "De Nouveau, accueil" }),
        ).toHaveAttribute("href", "/");
        expect(getByText("Texte de présentation")).toBeInTheDocument();
        expect(getByText("Mocked MediaImage Component")).toBeInTheDocument();
    });

    it("lists the team and awards as label and name rows", async () => {
        mockGetPage.mockResolvedValue(aboutPageMockData);

        const { getByRole } = render(await Page());

        const team = getByRole("heading", { name: "Équipe" }).parentElement!;
        expect(within(team).getByText("Architecte Owner")).toBeInTheDocument();
        expect(within(team).getByText("Jean Renaud")).toBeInTheDocument();

        const awards = getByRole("heading", {
            name: "Récompenses",
        }).parentElement!;
        expect(within(awards).getByText("2025")).toBeInTheDocument();
        expect(
            within(awards).getByText("Best Bambou Pergola"),
        ).toBeInTheDocument();
    });

    it("hides empty lists and the photo band", async () => {
        mockGetPage.mockResolvedValue({
            ...aboutPageMockData,
            portrait: null,
            heroMedia: null,
            awards: [],
            studioTeam: [],
        });

        const { queryByRole, queryByText } = render(await Page());

        expect(
            queryByRole("heading", { name: "Équipe" }),
        ).not.toBeInTheDocument();
        expect(
            queryByRole("heading", { name: "Récompenses" }),
        ).not.toBeInTheDocument();
        expect(
            queryByText("Mocked MediaImage Component"),
        ).not.toBeInTheDocument();
    });

    it("renders not found when page is not found", async () => {
        mockGetPage.mockResolvedValue(null);

        await Page();

        expect(mockNotFound).toHaveBeenCalledTimes(1);
    });
});
