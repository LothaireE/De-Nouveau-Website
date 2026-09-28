import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
const { form } = vi.hoisted(() => ({
    form: { fields: {} as Record<string, { value: unknown }> },
}));
vi.mock("@payloadcms/ui", () => ({
    useFormFields: (selector: (context: [typeof form.fields]) => unknown) =>
        selector([form.fields]),
}));
import { SeoPreview } from "./SeoPreview";
describe("SEO preview", () => {
    it("reflects edits to normal project fields without asking for SEO input", () => {
        form.fields = {
            title: { value: "Maison patio" },
            shortDescription: { value: "Une maison ouverte." },
            slug: { value: "maison-patio" },
        };
        const { rerender } = render(<SeoPreview kind="project" />);
        expect(
            screen.getByText("Maison patio — De Nouveau"),
        ).toBeInTheDocument();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        form.fields.title = { value: "Maison jardin" };
        rerender(<SeoPreview kind="project" />);
        expect(
            screen.getByText("Maison jardin — De Nouveau"),
        ).toBeInTheDocument();
    });
    it("shows the effective override for a fixed page", () => {
        form.fields = {
            seoTitle: { value: "Le studio" },
            seoDescription: { value: "Une description personnalisée." },
        };
        render(<SeoPreview kind="about" />);
        expect(screen.getByText("Le studio")).toBeInTheDocument();
        expect(
            screen.getByText("Une description personnalisée."),
        ).toBeInTheDocument();
    });
});
