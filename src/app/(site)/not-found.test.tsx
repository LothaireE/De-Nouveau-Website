import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import NotFoundPage from "./not-found";

describe("Not Found Page", () => {
    it("renders not found page", async () => {
        const { getByText, getByRole } = render(<NotFoundPage />);

        expect(getByText("Erreur 404")).toBeInTheDocument();

        expect(
            getByRole("heading", { level: 1, name: "Page introuvable" }),
        ).toBeInTheDocument();

        expect(
            getByText(
                "La page que vous recherchez n’existe pas, a été déplacée ou n’est plus disponible.",
            ),
        ).toBeInTheDocument();

        expect(
            getByRole("link", { name: "Retour à l’accueil" }),
        ).toHaveAttribute("href", "/");

        expect(getByRole("link", { name: "Voir les projets" })).toHaveAttribute(
            "href",
            "/projects",
        );
    });
});
