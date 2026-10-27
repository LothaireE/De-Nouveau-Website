import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SiteFooter from "./SiteFooter";

vi.mock("next/image", () => ({
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(props.src)} alt={props.alt ?? ""} />
    ),
}));

describe("SiteFooter", () => {
    it("shows only the legal link next to its heading", () => {
        render(<SiteFooter />);

        expect(
            screen.getByRole("heading", { name: "Informations" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("link", { name: "Mentions légales" }),
        ).toHaveAttribute("href", "/mentions-legales");
        expect(screen.getAllByRole("link")).toHaveLength(1);
    });
});
