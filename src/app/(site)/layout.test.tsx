import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt ?? ""} />;
    },
}));

vi.mock("next/font/google", () => ({
    Geist: vi.fn(() => ({
        variable: "mocked-geist-sans-variable",
        className: "mocked-geist-sans-class",
    })),
    Geist_Mono: vi.fn(() => ({
        variable: "mocked-geist-mono-variable",
        className: "mocked-geist-mono-class",
    })),
}));

vi.mock("@/library/payload/fetchers", () => ({
    getNavProjects: vi.fn().mockResolvedValue([
        {
            _id: "1",
            _createdAt: "some-date",
            title: "project 1",
            slug: "project-1",
        },
        {
            _id: "2",
            _createdAt: "some-date",
            title: "project 2",
            slug: "project-2",
        },
        {
            _id: "3",
            _createdAt: "some-date",
            title: "project 3",
            slug: "project-3",
        },
    ]),
}));

import RootLayout from "@/app/(site)/layout";

const SamplePage = () => {
    return <div>Sample Page Content</div>;
};

describe("Main layout", () => {
    it("renders main Layout with desktop and mobile navigations properly", async () => {
        const layout = await RootLayout({
            children: <SamplePage />,
        });

        const { getByText, getAllByRole } = render(layout.props.children);

        expect(getByText("Sample Page Content")).toBeInTheDocument();

        expect(
            getAllByRole("link", { name: "Accueil", hidden: true }),
        ).toHaveLength(2);

        expect(
            getAllByRole("link", { name: "À propos", hidden: true }),
        ).toHaveLength(2);

        expect(
            getAllByRole("link", { name: "Contact", hidden: true }),
        ).toHaveLength(2);

        expect(
            getAllByRole("link", { name: "project 1", hidden: true }),
        ).toHaveLength(2);

        expect(
            getAllByRole("link", { name: "project 2", hidden: true }),
        ).toHaveLength(2);

        expect(
            getAllByRole("link", { name: "project 3", hidden: true }),
        ).toHaveLength(2);
    });
});
