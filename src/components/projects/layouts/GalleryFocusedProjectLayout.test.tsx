import { render, screen } from "@testing-library/react";
import GalleryFocusedProjectLayout from "./GalleryFocusedProjectLayout";
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

describe("GalleryFocusedProjectLayout", () => {
    it("renders the project header content", () => {
        render(<GalleryFocusedProjectLayout project={project} />);

        expect(
            screen.getByRole("heading", {
                name: "Concours Bambou U Default",
            }),
        ).toBeInTheDocument();

        expect(screen.getByText("Client Concours")).toBeInTheDocument();
        expect(screen.getByText("Projet délivré")).toBeInTheDocument();
        expect(screen.getAllByText("Bali, Indonésie").length).toBeGreaterThan(
            0,
        );
        expect(screen.getAllByText("2026").length).toBeGreaterThan(0);
        expect(
            screen.getByText("Une courte description du projet."),
        ).toBeInTheDocument();
    });

    it("renders the cover image with hero size and priority", () => {
        render(<GalleryFocusedProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        expect(images[0]).toHaveAttribute("data-media-id", "56");
        expect(images[0]).toHaveAttribute("data-size", "hero");
        expect(images[0]).toHaveAttribute("data-priority", "true");
        expect(images[0]).toHaveAttribute(
            "data-fallback-alt",
            "Concours Bambou U Default",
        );
    });

    it("renders gallery images with hero size for wide items and card size for regular items", () => {
        render(<GalleryFocusedProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        const firstGalleryImage = images.find(
            (img) => img.getAttribute("data-media-id") === "1",
        );

        const thirdGalleryImage = images.find(
            (img) => img.getAttribute("data-media-id") === "3",
        );

        expect(firstGalleryImage).toHaveAttribute("data-size", "hero");
        expect(firstGalleryImage).toHaveAttribute(
            "data-fallback-alt",
            "Concours Bambou U Default 1",
        );

        expect(thirdGalleryImage).toHaveAttribute("data-size", "card");
        expect(thirdGalleryImage).toHaveAttribute(
            "data-fallback-alt",
            "Concours Bambou U Default 3",
        );
    });

    it("renders video medias when present", () => {
        render(<GalleryFocusedProjectLayout project={project} />);

        expect(screen.getByTestId("media-video")).toHaveAttribute(
            "data-media-id",
            "2",
        );
    });

    it("renders all gallery media items", () => {
        render(<GalleryFocusedProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        expect(
            images.some((img) => img.getAttribute("data-media-id") === "1"),
        ).toBe(true);

        expect(
            images.some((img) => img.getAttribute("data-media-id") === "3"),
        ).toBe(true);

        expect(
            images.some((img) => img.getAttribute("data-media-id") === "4"),
        ).toBe(true);
    });

    it("renders plans with count and correct fallback sizes", () => {
        render(<GalleryFocusedProjectLayout project={project} />);

        expect(screen.getByText("Plans")).toBeInTheDocument();
        expect(
            screen.getByText(String(project.plans?.length)),
        ).toBeInTheDocument();

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
        render(<GalleryFocusedProjectLayout project={project} />);

        expect(screen.getByText("Détails des plans")).toBeInTheDocument();
        expect(screen.getByTestId("rich-text")).toHaveTextContent(
            "Rich text content",
        );
    });

    it("renders a single plan with full variant", () => {
        render(
            <GalleryFocusedProjectLayout
                project={{
                    ...project,
                    plans: project.plans?.slice(0, 1),
                }}
            />,
        );

        const images = screen.getAllByTestId("media-image");

        const singlePlan = images.find(
            (img) => img.getAttribute("data-media-id") === "10",
        );

        expect(singlePlan).toHaveAttribute("data-size", "large");
    });

    it("does not render gallery media when gallery is empty", () => {
        render(
            <GalleryFocusedProjectLayout
                project={{ ...project, galleryMedia: [] }}
            />,
        );

        expect(screen.queryByTestId("media-video")).not.toBeInTheDocument();

        const images = screen.getAllByTestId("media-image");

        expect(
            images.some((img) => img.getAttribute("data-media-id") === "1"),
        ).toBe(false);
    });

    it("does not render plans section when there are no plans", () => {
        render(
            <GalleryFocusedProjectLayout
                project={{
                    ...project,
                    plans: [],
                    planDetails: undefined,
                }}
            />,
        );

        expect(screen.queryByText("Plans")).not.toBeInTheDocument();
        expect(screen.queryByText("Détails des plans")).not.toBeInTheDocument();
    });
});
