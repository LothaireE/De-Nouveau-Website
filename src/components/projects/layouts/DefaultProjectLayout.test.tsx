import { render, screen } from "@testing-library/react";
import DefaultProjectLayout from "./DefaultProjectLayout";
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

describe("DefaultProjectLayout", () => {
    it("renders the project main content", () => {
        render(<DefaultProjectLayout project={project} />);

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
        render(<DefaultProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        expect(images[0]).toHaveAttribute("data-media-id", "56");
        expect(images[0]).toHaveAttribute("data-size", "hero");
        expect(images[0]).toHaveAttribute("data-priority", "true");
    });

    it("renders the long description when available", () => {
        render(<DefaultProjectLayout project={project} />);

        const longDescription = screen.getAllByTestId("rich-text")[0];

        expect(longDescription).toHaveTextContent("Rich text content");
    });

    it("renders first gallery media as a large image", () => {
        render(<DefaultProjectLayout project={project} />);

        const firstImage = screen.getAllByTestId("media-image")[0];

        expect(firstImage).toBeInTheDocument();
    });

    it("renders video medias when present", () => {
        render(<DefaultProjectLayout project={project} />);

        expect(screen.getByTestId("media-video")).toHaveAttribute(
            "data-media-id",
            "2",
        );
    });

    it("renders remaining medias with the correct fallback size", () => {
        render(<DefaultProjectLayout project={project} />);

        const images = screen.getAllByTestId("media-image");

        const largeImage = images.find(
            (img) => img.getAttribute("data-media-id") === "3",
        );

        expect(largeImage).toHaveAttribute("data-size", "large");
    });

    it("renders plans with correct fallback sizes", () => {
        render(<DefaultProjectLayout project={project} />);

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
        render(<DefaultProjectLayout project={project} />);

        expect(screen.getByText("Details des plans")).toBeInTheDocument();

        expect(screen.getAllByTestId("rich-text")).toHaveLength(2);
    });

    it("does not render long description when absent", () => {
        render(
            <DefaultProjectLayout
                project={{ ...project, longDescription: undefined }}
            />,
        );

        expect(screen.getAllByTestId("rich-text")).toHaveLength(1);
    });

    it("does not render plans section when there are no plans", () => {
        render(
            <DefaultProjectLayout
                project={{
                    ...project,
                    plans: [],
                    planDetails: undefined,
                }}
            />,
        );

        expect(screen.queryByText("Details des plans")).not.toBeInTheDocument();
    });

    it("does not render gallery media when gallery is empty", () => {
        render(
            <DefaultProjectLayout project={{ ...project, galleryMedia: [] }} />,
        );

        expect(screen.queryByTestId("media-video")).not.toBeInTheDocument();
    });
});
