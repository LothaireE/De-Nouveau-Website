import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(props.src)} alt={props.alt ?? ""} />
    ),
}));

import NotFoundPage from "./not-found";

describe("Not Found Page", () => {
    it("names the error and links back home", () => {
        const { getByText, getByRole } = render(<NotFoundPage />);

        expect(
            getByRole("heading", { level: 1, name: "Page introuvable" }),
        ).toBeInTheDocument();
        expect(getByText("Erreur 404")).toBeInTheDocument();
        expect(
            getByRole("link", { name: "Retour à l’accueil" }),
        ).toHaveAttribute("href", "/");
    });

    it("keeps the page links at the top", () => {
        const { getByRole } = render(<NotFoundPage />);

        expect(getByRole("navigation", { name: "Pages" })).toBeInTheDocument();
    });
});
