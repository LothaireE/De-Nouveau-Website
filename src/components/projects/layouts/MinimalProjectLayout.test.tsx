import { render, screen } from "@testing-library/react";
import MinimalProjectLayout from "./MinimalProjectLayout";
import { vi, it, describe, expect } from "vitest";
import { MediaImageProps } from "@/components/media/MediaImage";
import { testProjectData } from "@/tests/mocks/testData";
import { Media } from "@/payload-types";

vi.mock("@/components/media/MediaImage", () => ({
    default: ({ media, fallbackAlt, size, priority }: MediaImageProps) => (
        <div
            data-testid="media-image"
            data-media-id={typeof media === "object" && media?.id}
            data-fallback-alt={fallbackAlt}
            data-size={size}
            data-priority={String(Boolean(priority))}
        />
    ),
}));

vi.mock("@/components/media/MediaVideo", () => ({
    default: ({ media }: { media: Media }) => (
        <div data-testid="media-video" data-media-id={media?.id} />
    ),
}));

vi.mock("@payloadcms/richtext-lexical/react", () => ({
    RichText: ({ data }: { data: unknown }) => (
        <div data-testid="rich-text">{data ? "Rich text content" : null}</div>
    ),
}));

const project = testProjectData;

describe("MinimalProjectLayout", () => {
    it("renders the project main content", () => {
        render(<MinimalProjectLayout project={project} />);

        expect(
            screen.getByRole("heading", {
                name: "Concours Bambou U Default",
            }),
        ).toBeInTheDocument();

        expect(screen.getAllByText("Bali, Indonésie").length).toBeGreaterThan(
            0,
        );
        expect(screen.getAllByText("2026").length).toBeGreaterThan(0);
        expect(screen.getByText("délivré")).toBeInTheDocument();
        expect(
            screen.getByText("Une courte description du projet."),
        ).toBeInTheDocument();
    });

    it("renders the cover image with hero size and priority", () => {
        render(<MinimalProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        expect(images[0]).toHaveAttribute("data-media-id", "56");
        expect(images[0]).toHaveAttribute("data-size", "hero");
        expect(images[0]).toHaveAttribute("data-priority", "true");
        expect(images[0]).toHaveAttribute(
            "data-fallback-alt",
            "Concours Bambou U Default",
        );
    });

    it("renders only the first three gallery media items", () => {
        render(<MinimalProjectLayout project={project} />);

        expect(screen.getByTestId("media-video")).toHaveAttribute(
            "data-media-id",
            "2",
        );

        const galleryAndPlanImages = screen.getAllByTestId("media-image");

        expect(
            galleryAndPlanImages.some(
                (img) => img.getAttribute("data-media-id") === "4",
            ),
        ).toBe(false);
    });

    it("renders plans with correct fallback sizes", () => {
        render(<MinimalProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        const planLarge = images.find(
            (img) => img.getAttribute("data-media-id") === "10",
        );
        const planCard = images.find(
            (img) => img.getAttribute("data-media-id") === "11",
        );

        expect(planLarge).toHaveAttribute("data-size", "large");
        expect(planCard).toHaveAttribute("data-size", "card");
    });

    it("renders plan details when available", () => {
        render(<MinimalProjectLayout project={project} />);

        expect(screen.getByText("Détails des plans")).toBeInTheDocument();
        expect(screen.getByTestId("rich-text")).toHaveTextContent(
            "Rich text content",
        );
    });

    it("does not render gallery section when there is no gallery media", () => {
        render(
            <MinimalProjectLayout project={{ ...project, galleryMedia: [] }} />,
        );

        expect(screen.queryByTestId("media-video")).not.toBeInTheDocument();
    });

    it("does not render plan details section when there are no plans", () => {
        render(
            <MinimalProjectLayout
                project={{ ...project, plans: [], planDetails: undefined }}
            />,
        );

        expect(screen.queryByText("Détails des plans")).not.toBeInTheDocument();
    });
});
