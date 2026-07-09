import { render, screen } from "@testing-library/react";
import EditorialProjectLayout from "./EditorialProjectLayout";
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

describe("EditorialProjectLayout", () => {
    it("renders the project main content", () => {
        render(<EditorialProjectLayout project={project} />);

        expect(
            screen.getByRole("heading", {
                name: "Concours Bambou U Default",
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("Client Concours")).toBeInTheDocument();
        expect(screen.getByText("Projet délivré")).toBeInTheDocument();
        expect(screen.getByText("Surface 8 m × 12 m")).toBeInTheDocument();
        expect(screen.getAllByText("Bali, Indonésie").length).toBeGreaterThan(
            0,
        );
        expect(screen.getAllByText("2026").length).toBeGreaterThan(0);
        expect(
            screen.getByText("Une courte description du projet."),
        ).toBeInTheDocument();
    });

    it("renders the cover image with hero size and priority", () => {
        render(<EditorialProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        expect(images[0]).toHaveAttribute("data-media-id", "56");
        expect(images[0]).toHaveAttribute("data-size", "hero");
        expect(images[0]).toHaveAttribute("data-priority", "true");
    });

    it("renders the long description when available", () => {
        render(<EditorialProjectLayout project={project} />);

        const longDescription = screen.getAllByTestId("rich-text")[0];

        expect(longDescription).toHaveTextContent("Rich text content");
    });

    it("renders first gallery media as a large image", () => {
        render(<EditorialProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        const firstGalleryImage = images.find(
            (img) => img.getAttribute("data-media-id") === "1",
        );

        expect(firstGalleryImage).toHaveAttribute("data-size", "hero");
        expect(firstGalleryImage).toHaveAttribute(
            "data-fallback-alt",
            "Concours Bambou U Default",
        );
    });

    it("renders middle gallery medias with card size", () => {
        render(<EditorialProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        const middleImage = images.find(
            (img) => img.getAttribute("data-media-id") === "3",
        );

        expect(screen.getByTestId("media-video")).toHaveAttribute(
            "data-media-id",
            "2",
        );
        expect(middleImage).toHaveAttribute("data-size", "card");
    });

    it("renders remaining gallery medias with large size", () => {
        render(<EditorialProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        const remainingImage = images.find(
            (img) => img.getAttribute("data-media-id") === "4",
        );

        expect(remainingImage).toHaveAttribute("data-size", "large");
        expect(remainingImage).toHaveAttribute(
            "data-fallback-alt",
            "Concours Bambou U Default 1",
        );
    });

    it("renders plans with correct fallback sizes", () => {
        render(<EditorialProjectLayout project={project} />);

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
        render(<EditorialProjectLayout project={project} />);

        expect(screen.getByText("Détails des plans")).toBeInTheDocument();
        expect(screen.getAllByTestId("rich-text").length).toBeGreaterThan(0);
    });

    it("does not render gallery media when gallery is empty", () => {
        render(
            <EditorialProjectLayout
                project={{ ...project, galleryMedia: [] }}
            />,
        );

        expect(screen.queryByTestId("media-video")).not.toBeInTheDocument();

        const images = screen.getAllByTestId("media-image");

        expect(
            images.some((img) => img.getAttribute("data-media-id") === "1"),
        ).toBe(false);
    });

    it("does not render long description when absent", () => {
        render(
            <EditorialProjectLayout
                project={{ ...project, longDescription: undefined }}
            />,
        );

        expect(screen.getByText("Détails des plans")).toBeInTheDocument();
    });

    it("does not render plans section when there are no plans", () => {
        render(
            <EditorialProjectLayout
                project={{
                    ...project,
                    plans: [],
                    planDetails: undefined,
                }}
            />,
        );

        expect(screen.queryByText("Détails des plans")).not.toBeInTheDocument();
    });
});
